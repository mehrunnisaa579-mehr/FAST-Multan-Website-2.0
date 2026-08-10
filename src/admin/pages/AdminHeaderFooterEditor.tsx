import React, { useState, useEffect } from 'react';
import AdminPageHeader from '../components/ui/AdminPageHeader';
import AdminCard from '../components/ui/AdminCard';
import AdminSection from '../components/ui/AdminSection';
import AdminButton from '../components/ui/AdminButton';
import AdminFormGroup from '../components/ui/AdminFormGroup';
import AdminInput from '../components/ui/AdminInput';
import AdminToggle from '../components/ui/AdminToggle';
import { cmsService } from '../../services/cmsService';
import { footerContent } from '../../data/footer';
import { Save, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AdminHeaderFooterEditor() {
  // Header Settings
  const [tickerText, setTickerText] = useState('Orientation Ceremony — 16 August 2026');
  const [tickerEnabled, setTickerEnabled] = useState(true);
  const [facebookUrl, setFacebookUrl] = useState(footerContent.socials[0].url);
  const [instagramUrl, setInstagramUrl] = useState(footerContent.socials[1].url);
  const [linkedInUrl, setLinkedInUrl] = useState(footerContent.socials[2].url);
  const [youtubeUrl, setYoutubeUrl] = useState(footerContent.socials[3].url);

  // Footer Settings
  const [address, setAddress] = useState(footerContent.address);
  const [addressUrl, setAddressUrl] = useState(footerContent.addressUrl);
  const [phone, setPhone] = useState(footerContent.phone);
  const [email, setEmail] = useState(footerContent.email);
  const [copyrightText, setCopyrightText] = useState(footerContent.copyrightText);

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    const loadSettings = async () => {
      const data = await cmsService.getSetting('header_footer_content', null);
      if (data) {
        if (data.tickerText !== undefined) setTickerText(data.tickerText);
        if (data.tickerEnabled !== undefined) setTickerEnabled(data.tickerEnabled);
        if (data.facebookUrl) setFacebookUrl(data.facebookUrl);
        if (data.instagramUrl) setInstagramUrl(data.instagramUrl);
        if (data.linkedInUrl) setLinkedInUrl(data.linkedInUrl);
        if (data.youtubeUrl) setYoutubeUrl(data.youtubeUrl);

        if (data.address) setAddress(data.address);
        if (data.addressUrl) setAddressUrl(data.addressUrl);
        if (data.phone) setPhone(data.phone);
        if (data.email) setEmail(data.email);
        if (data.copyrightText) setCopyrightText(data.copyrightText);
      }
    };
    loadSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaveSuccess(false);
    setSaveError(null);

    const payload = {
      tickerText,
      tickerEnabled,
      facebookUrl,
      instagramUrl,
      linkedInUrl,
      youtubeUrl,
      address,
      addressUrl,
      phone,
      email,
      copyrightText,
    };

    const res = await cmsService.saveSetting('header_footer_content', payload, 'Header & Footer Settings');
    setSaving(false);

    if (res.success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } else {
      setSaveError(res.error || 'Failed to save settings.');
    }
  };

  return (
    <div className="space-y-6 text-left max-w-[1200px]">
      <AdminPageHeader
        title="Header & Footer Settings"
        subtitle="Update top news ticker text, official campus contact numbers, social media profiles, and footer details."
        action={
          <AdminButton variant="primary" onClick={handleSave} loading={saving} icon={<Save className="w-4 h-4" />}>
            Save Settings
          </AdminButton>
        }
      />

      {saveSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-3 text-emerald-800 text-sm font-medium">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>Header and footer settings saved successfully.</span>
        </div>
      )}

      {saveError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-800 text-sm font-medium">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <span>We couldn't save your settings. Please try again.</span>
        </div>
      )}

      {/* Header & Ticker Section */}
      <AdminSection title="Top Header & Live Ticker Settings" description="Configure marquee ticker text and official social links.">
        <AdminCard className="space-y-4">
          <AdminFormGroup label="Live Scrolling News Ticker Text">
            <AdminInput value={tickerText} onChange={(e) => setTickerText(e.target.value)} placeholder="Orientation Ceremony — 16 August 2026" />
          </AdminFormGroup>

          <AdminToggle
            label="Enable Live News Ticker"
            checked={tickerEnabled}
            onChange={(checked) => setTickerEnabled(checked)}
            description="Display scrolling ticker banner below top social bar."
          />

          <div className="pt-2 border-t border-[#F3F4F6]">
            <h4 className="text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-3">Social Media URLs</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AdminFormGroup label="Facebook URL">
                <AdminInput value={facebookUrl} onChange={(e) => setFacebookUrl(e.target.value)} />
              </AdminFormGroup>
              <AdminFormGroup label="Instagram URL">
                <AdminInput value={instagramUrl} onChange={(e) => setInstagramUrl(e.target.value)} />
              </AdminFormGroup>
              <AdminFormGroup label="LinkedIn URL">
                <AdminInput value={linkedInUrl} onChange={(e) => setLinkedInUrl(e.target.value)} />
              </AdminFormGroup>
              <AdminFormGroup label="YouTube URL">
                <AdminInput value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} />
              </AdminFormGroup>
            </div>
          </div>
        </AdminCard>
      </AdminSection>

      {/* Footer Section */}
      <AdminSection title="Footer Contact & Location Details" description="Multan campus physical address, contact numbers, and copyright statement.">
        <AdminCard className="space-y-4">
          <AdminFormGroup label="Campus Address">
            <AdminInput value={address} onChange={(e) => setAddress(e.target.value)} />
          </AdminFormGroup>

          <AdminFormGroup label="Google Maps Location URL">
            <AdminInput value={addressUrl} onChange={(e) => setAddressUrl(e.target.value)} />
          </AdminFormGroup>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AdminFormGroup label="Contact Phone Number">
              <AdminInput value={phone} onChange={(e) => setPhone(e.target.value)} />
            </AdminFormGroup>

            <AdminFormGroup label="Official Email Address">
              <AdminInput value={email} onChange={(e) => setEmail(e.target.value)} />
            </AdminFormGroup>
          </div>

          <AdminFormGroup label="Footer Copyright Notice">
            <AdminInput value={copyrightText} onChange={(e) => setCopyrightText(e.target.value)} />
          </AdminFormGroup>
        </AdminCard>
      </AdminSection>

      <div className="pt-4 border-t border-[#E5E7EB] flex justify-end">
        <AdminButton variant="primary" onClick={handleSave} loading={saving} icon={<Save className="w-4 h-4" />}>
          Save Settings
        </AdminButton>
      </div>
    </div>
  );
}
