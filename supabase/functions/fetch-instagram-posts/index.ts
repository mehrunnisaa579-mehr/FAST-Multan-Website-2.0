import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.6";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    // Fetch credentials from Vault via our secure RPC helper
    const { data: accessToken, error: tokenErr } = await supabaseClient.rpc('get_vault_secret', { secret_name: 'INSTAGRAM_ACCESS_TOKEN' });
    const { data: businessAccountId, error: idErr } = await supabaseClient.rpc('get_vault_secret', { secret_name: 'INSTAGRAM_BUSINESS_ACCOUNT_ID' });

    if (tokenErr || idErr || !accessToken || !businessAccountId) {
      console.error("Credentials not configured in Vault");
      return new Response(JSON.stringify({ error: 'Instagram integration credentials not configured.' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Call Instagram Graph API (v25.0 as specified)
    const igApiUrl = `https://graph.facebook.com/v25.0/${businessAccountId}/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&access_token=${accessToken}`;
    
    const response = await fetch(igApiUrl);
    const data = await response.json();

    if (!response.ok || data.error) {
      console.error("Instagram API Error:", data.error);
      
      // Log the alert
      await supabaseClient.from('integration_alerts').insert({
        source: 'fetch-instagram-posts',
        message: data.error?.message || 'Failed to fetch Instagram posts',
        severity: 'error'
      });

      return new Response(JSON.stringify({ error: 'Failed to fetch from Instagram API' }), { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const posts = data.data || [];
    
    // Take the most recent 20
    const recentPosts = posts.slice(0, 20);

    // Fetch existing posts to preserve `is_visible` if they already exist
    const { data: existingData } = await supabaseClient
      .from('instagram_posts')
      .select('id, is_visible')
      .in('id', recentPosts.map((p: any) => p.id));
      
    const existingMap = new Map((existingData || []).map((row: any) => [row.id, row.is_visible]));

    const upsertPayload = recentPosts.map((post: any) => ({
      id: post.id,
      media_type: post.media_type,
      media_url: post.media_url,
      thumbnail_url: post.thumbnail_url || null,
      permalink: post.permalink,
      caption: post.caption || null,
      posted_at: post.timestamp,
      fetched_at: new Date().toISOString(),
      is_visible: existingMap.has(post.id) ? existingMap.get(post.id) : true
    }));

    if (upsertPayload.length > 0) {
      const { error: upsertError } = await supabaseClient
        .from('instagram_posts')
        .upsert(upsertPayload, { onConflict: 'id' });

      if (upsertError) {
        console.error("Database Upsert Error:", upsertError);
        return new Response(JSON.stringify({ error: 'Failed to save posts to database' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
    }

    // Update integration settings 'last_synced' timestamp
    await supabaseClient
      .from('integration_settings')
      .upsert({
        key: 'instagram_last_synced',
        updated_at: new Date().toISOString()
      }, { onConflict: 'key' });

    return new Response(JSON.stringify({ success: true, message: `Successfully fetched and saved ${upsertPayload.length} posts.` }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (err: any) {
    console.error("Internal Error:", err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
