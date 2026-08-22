import React, { useState, useEffect } from 'react';
import AdminPageHeader from '../components/ui/AdminPageHeader';
import AdminCard from '../components/ui/AdminCard';
import AdminSection from '../components/ui/AdminSection';
import AdminButton from '../components/ui/AdminButton';
import AdminFormGroup from '../components/ui/AdminFormGroup';
import AdminInput from '../components/ui/AdminInput';
import AdminToggle from '../components/ui/AdminToggle';
import ImageCropModal from '../components/ui/ImageCropModal';
import { useImageCropper } from '../hooks/useImageCropper';
import { cmsService } from '../../services/cmsService';
import { footerContent } from '../../data/footer';
import { Save, CheckCircle2, AlertCircle, Upload, ImageIcon } from 'lucide-react';

export default function AdminHeaderFooterEditor() {
  // Global Banner / Hero Image (All Non-Homepage Pages)
  const [globalHeroImageUrl, setGlobalHeroImageUrl] = useState('');
  const [uploadingGlobalHero, setUploadingGlobalHero] = useState(false);

  // Logos
  const [headerLogoUrl, setHeaderLogoUrl] = useState('');
  const [footerLogoUrl, setFooterLogoUrl] = useState('');

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
  const [uploadingHeaderLogo, setUploadingHeaderLogo] = useState(false);
  const [uploadingFooterLogo, setUploadingFooterLogo] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    const loadSettings = async () => {
      const data = await cmsService.getSetting<any>('header_footer_content', null);
      if (data) {
        if (data.globalHeroImageUrl !== undefined) setGlobalHeroImageUrl(data.globalHeroImageUrl);
        if (data.headerLogoUrl !== undefined) setHeaderLogoUrl(data.headerLogoUrl);
        if (data.footerLogoUrl !== undefined) setFooterLogoUrl(data.footerLogoUrl);
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

  const { cropperProps, openCropper } = useImageCropper();

  const handleGlobalHeroUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    openCropper(
      e,
      async (croppedFile) => {
        setUploadingGlobalHero(true);
        const res = await cmsService.uploadMedia(croppedFile);
        setUploadingGlobalHero(false);
        if (res.success && res.publicUrl) {
          setGlobalHeroImageUrl(res.publicUrl);
        } else {
          alert(`Global hero image upload failed: ${res.error || 'Unknown error'}`);
        }
      },
      { aspectRatio: 16 / 9, title: 'Crop Global Hero Banner Image (16:9 Wide)' }
    );
  };

  const handleHeaderLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    openCropper(
      e,
      async (croppedFile) => {
        setUploadingHeaderLogo(true);
        const res = await cmsService.uploadMedia(croppedFile);
        setUploadingHeaderLogo(false);
        if (res.success && res.publicUrl) {
          setHeaderLogoUrl(res.publicUrl);
        } else {
          alert(`Header logo upload failed: ${res.error || 'Unknown error'}`);
        }
      },
      { aspectRatio: 3 / 1, title: 'Crop Header Navigation Logo (3:1 Wide)' }
    );
  };

  const handleFooterLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    openCropper(
      e,
      async (croppedFile) => {
        setUploadingFooterLogo(true);
        const res = await cmsService.uploadMedia(croppedFile);
        setUploadingFooterLogo(false);
        if (res.success && res.publicUrl) {
          setFooterLogoUrl(res.publicUrl);
        } else {
          alert(`Footer logo upload failed: ${res.error || 'Unknown error'}`);
        }
      },
      { aspectRatio: 3 / 1, title: 'Crop Footer Navigation Logo (3:1 Wide)' }
    );
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveSuccess(false);
    setSaveError(null);

    const payload = {
      globalHeroImageUrl,
      headerLogoUrl,
      footerLogoUrl,
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
      updated_at: new Date().toISOString(),
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
        title="Global Hero & Header / Footer Settings"
        subtitle="Manage Global Hero Image for all non-homepage pages, official logos, news ticker text, and contact details."
        action={
          <AdminButton variant="primary" onClick={handleSave} loading={saving || uploadingGlobalHero || uploadingHeaderLogo || uploadingFooterLogo} icon={<Save className="w-4 h-4" />}>
            Save Settings
          </AdminButton>
        }
      />

      {saveSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-3 text-emerald-800 text-sm font-medium">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>Global Hero and Header/Footer settings saved successfully.</span>
        </div>
      )}

      {saveError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-800 text-sm font-medium">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <span>{saveError}</span>
        </div>
      )}

      {/* 0. Global Hero Image Upload Section */}
      <AdminSection
        title="Global Hero / Banner Image Upload"
        description="Upload a single Global Hero Image used across ALL non-homepage pages on the website. (Homepage 3-hero carousel remains untouched)."
      >
        <AdminCard className="space-y-4">
          <AdminFormGroup label="Global Hero Image (Preview / Upload / Replace / Remove)">
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-4">
              <div className="w-48 h-24 bg-[#F3F4F6] border border-[#E5E7EB] rounded-md overflow-hidden flex items-center justify-center p-1 flex-shrink-0">
                {globalHeroImageUrl ? (
                  <img src={globalHeroImageUrl} alt="Global Hero Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center gap-2 text-[#6B7280]">
                    <ImageIcon className="w-5 h-5" />
                    <span className="text-xs font-semibold uppercase">Default Hero</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <label className="px-3.5 py-2 bg-[#0093DD] hover:bg-[#0C71C3] text-white text-xs font-semibold rounded-md cursor-pointer flex items-center gap-1.5 shadow-xs">
                  <Upload className="w-4 h-4" />
                  <span>
                    {uploadingGlobalHero
                      ? 'Uploading...'
                      : globalHeroImageUrl
                      ? 'Replace Global Hero'
                      : 'Upload Global Hero'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploadingGlobalHero}
                    onChange={handleGlobalHeroUpload}
                  />
                </label>

                {globalHeroImageUrl && (
                  <button
                    type="button"
                    onClick={() => setGlobalHeroImageUrl('')}
                    className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-[#DC2626] text-xs font-semibold rounded-md border border-red-200 cursor-pointer"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          </AdminFormGroup>
        </AdminCard>
      </AdminSection>

      {saveError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-800 text-sm font-medium">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <span>{saveError}</span>
        </div>
      )}

      {/* 1. Header Logo Section */}
      <AdminSection title="Header Logo Upload" description="Manage the official university logo displayed in the top website navigation bar.">
        <AdminCard className="space-y-4">
          <AdminFormGroup label="Header Navigation Logo (Preview / Upload / Replace / Remove)">
            <div className="flex items-center gap-4">
              <div className="w-48 h-16 bg-[#F3F4F6] border border-[#E5E7EB] rounded-md overflow-hidden flex items-center justify-center p-2 flex-shrink-0">
                {headerLogoUrl ? (
                  <img src={headerLogoUrl} alt="Header Logo Preview" className="w-full h-full object-contain" />
                ) : (
                  <div className="flex items-center gap-2 text-[#6B7280]">
                    <ImageIcon className="w-5 h-5" />
                    <span className="text-xs font-semibold uppercase">Default Seal</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <label className="px-3.5 py-2 bg-[#0093DD] hover:bg-[#0C71C3] text-white text-xs font-semibold rounded-md cursor-pointer flex items-center gap-1.5 shadow-xs">
                  <Upload className="w-4 h-4" />
                  <span>
                    {uploadingHeaderLogo
                      ? 'Uploading...'
                      : headerLogoUrl
                      ? 'Replace Header Logo'
                      : 'Upload Header Logo'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploadingHeaderLogo}
                    onChange={handleHeaderLogoUpload}
                  />
                </label>

                {headerLogoUrl && (
                  <button
                    type="button"
                    onClick={() => setHeaderLogoUrl('')}
                    className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-[#DC2626] text-xs font-semibold rounded-md border border-red-200 cursor-pointer"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          </AdminFormGroup>
        </AdminCard>
      </AdminSection>

      {/* 2. Top Header & Live Ticker Section */}
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

      {/* 3. Footer Logo Section */}
      <AdminSection title="Footer Logo Upload" description="Manage the logo displayed inside the white oval container on the left side of the website footer.">
        <AdminCard className="space-y-4">
          <AdminFormGroup label="Footer Branding Logo (Preview / Upload / Replace / Remove)">
            <div className="flex items-center gap-4">
              <div className="w-56 h-16 bg-[#0093DD] border border-[#0093DD] rounded-lg p-2 flex items-center justify-center flex-shrink-0">
                <div className="w-full h-full bg-white rounded-full px-4 flex items-center justify-center">
                  {footerLogoUrl ? (
                    <img src={footerLogoUrl} alt="Footer Logo Preview" className="w-full h-full object-contain" />
                  ) : (
                    <div className="flex items-center gap-2 text-[#0093DD]">
                      <ImageIcon className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase">Default Seal</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <label className="px-3.5 py-2 bg-[#0093DD] hover:bg-[#0C71C3] text-white text-xs font-semibold rounded-md cursor-pointer flex items-center gap-1.5 shadow-xs">
                  <Upload className="w-4 h-4" />
                  <span>
                    {uploadingFooterLogo
                      ? 'Uploading...'
                      : footerLogoUrl
                      ? 'Replace Footer Logo'
                      : 'Upload Footer Logo'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploadingFooterLogo}
                    onChange={handleFooterLogoUpload}
                  />
                </label>

                {footerLogoUrl && (
                  <button
                    type="button"
                    onClick={() => setFooterLogoUrl('')}
                    className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-[#DC2626] text-xs font-semibold rounded-md border border-red-200 cursor-pointer"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          </AdminFormGroup>
        </AdminCard>
      </AdminSection>

      {/* 4. Footer Contact & Location Details */}
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
        <AdminButton variant="primary" onClick={handleSave} loading={saving || uploadingHeaderLogo || uploadingFooterLogo} icon={<Save className="w-4 h-4" />}>
          Save Settings
        </AdminButton>
      </div>

      <ImageCropModal {...cropperProps} />
    </div>
  );
}
