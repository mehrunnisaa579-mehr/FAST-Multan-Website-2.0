import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.6";

serve(async (req) => {
  // This is typically called via internal pg_cron, but we allow POST
  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    // 1. Fetch current token metadata
    const { data: metadataList } = await supabaseClient
      .from('integration_settings')
      .select('value_expires_at')
      .eq('key', 'instagram_token_metadata')
      .limit(1);

    const metadata = metadataList?.[0];
    
    // If we have an expiry date, check if it's within 5 days
    if (metadata?.value_expires_at) {
      const expiresAt = new Date(metadata.value_expires_at);
      const now = new Date();
      const diffTime = Math.abs(expiresAt.getTime() - now.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      // If token expires in more than 5 days, skip refresh
      if (diffDays > 5) {
        return new Response(JSON.stringify({ success: true, message: 'Token is still healthy, refresh skipped.' }), { status: 200, headers: { 'Content-Type': 'application/json' } });
      }
    }

    // 2. We need to refresh the token.
    const { data: accessToken, error: tokenErr } = await supabaseClient.rpc('get_vault_secret', { secret_name: 'INSTAGRAM_ACCESS_TOKEN' });

    if (tokenErr || !accessToken) {
      return new Response(JSON.stringify({ error: 'Token not found in Vault.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    // 3. Call Instagram Refresh Endpoint
    const refreshUrl = `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${accessToken}`;
    const response = await fetch(refreshUrl);
    const data = await response.json();

    if (!response.ok || data.error) {
      // Log the failure securely
      await supabaseClient.from('integration_alerts').insert({
        source: 'refresh-instagram-token',
        message: data.error?.message || 'Failed to refresh token with Meta API',
        severity: 'critical'
      });
      return new Response(JSON.stringify({ error: 'Failed to refresh token' }), { status: 502, headers: { 'Content-Type': 'application/json' } });
    }

    const newAccessToken = data.access_token;
    const expiresIn = data.expires_in; // usually seconds, ~60 days

    // 4. Overwrite in Vault securely
    await supabaseClient.rpc('store_vault_secret', {
      secret_name: 'INSTAGRAM_ACCESS_TOKEN',
      secret_value: newAccessToken,
      secret_description: 'Instagram Graph API Access Token (Refreshed)'
    });

    // 5. Update metadata expiry
    const newExpiresAt = new Date();
    newExpiresAt.setSeconds(newExpiresAt.getSeconds() + expiresIn);

    await supabaseClient
      .from('integration_settings')
      .upsert({
        key: 'instagram_token_metadata',
        value_expires_at: newExpiresAt.toISOString(),
        updated_at: new Date().toISOString()
      }, { onConflict: 'key' });

    return new Response(JSON.stringify({ success: true, message: 'Token refreshed successfully.' }), { status: 200, headers: { 'Content-Type': 'application/json' } });

  } catch (err: any) {
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
});
