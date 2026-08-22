import React, { useState, useEffect } from 'react';
import AdminPageHeader from '../components/ui/AdminPageHeader';
import AdminCard from '../components/ui/AdminCard';
import AdminButton from '../components/ui/AdminButton';
import AdminFormGroup from '../components/ui/AdminFormGroup';
import AdminInput from '../components/ui/AdminInput';
import AdminTextarea from '../components/ui/AdminTextarea';
import ImageCropModal from '../components/ui/ImageCropModal';
import { useImageCropper } from '../hooks/useImageCropper';
import { cmsService } from '../../services/cmsService';
import { conferenceScheduleDay1, conferenceScheduleDay2 } from '../../data/edc';
import { Save, CheckCircle2, AlertCircle, Upload, ImageIcon, ArrowLeft, Plus, Trash2, ArrowUp, ArrowDown, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminEDCConferencesManager() {
  const [heroTitle, setHeroTitle] = useState('Conferences');
  const [heroImage, setHeroImage] = useState('');
  const [heading, setHeading] = useState('PLACEHOLDER: EDC Conference 2026');
  const [posterUrl, setPosterUrl] = useState('');
  const [description, setDescription] = useState(
    'PLACEHOLDER: Official conference details, thematic tracks, and institutional objectives for the FAST-NUCES Multan Executive Development Centre Conference will appear here.\n\nPLACEHOLDER: The conference brings together leading academic researchers, industry executives, and postgraduate scholars to exchange insights on modern technology trends and management practices.\n\nPLACEHOLDER: Key conference highlights include peer-reviewed technical sessions, executive keynotes, panel discussions on regional industrial growth, and paper award ceremonies.'
  );
  const [highlights, setHighlights] = useState<string[]>([
    'Keynote addresses by international academic & industry experts',
    'Parallel technical research paper presentation tracks',
    'Interactive panel discussions & delegate networking sessions',
  ]);

  const [day1Schedule, setDay1Schedule] = useState<{ time: string; topic: string }[]>(conferenceScheduleDay1);
  const [day2Schedule, setDay2Schedule] = useState<{ time: string; topic: string }[]>(conferenceScheduleDay2);

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const data = await cmsService.getSetting<any>('edc_conference_content', null);
      if (data) {
        if (data.heroTitle) setHeroTitle(data.heroTitle);
        if (data.heroImage) setHeroImage(data.heroImage);
        if (data.heading) setHeading(data.heading);
        if (data.posterUrl) setPosterUrl(data.posterUrl);
        if (data.description) setDescription(data.description);
        if (data.highlights && Array.isArray(data.highlights)) setHighlights(data.highlights);
        if (data.day1Schedule && Array.isArray(data.day1Schedule)) setDay1Schedule(data.day1Schedule);
        if (data.day2Schedule && Array.isArray(data.day2Schedule)) setDay2Schedule(data.day2Schedule);
      }
    };
    loadData();
  }, []);

  const { cropperProps, openCropper } = useImageCropper();

  const handleHeroUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    openCropper(
      e,
      async (croppedFile) => {
        const res = await cmsService.uploadMedia(croppedFile);
        if (res.success && res.publicUrl) {
          setHeroImage(res.publicUrl);
        } else {
          alert(`Upload failed: ${res.error}`);
        }
      },
      { aspectRatio: 16 / 9, title: 'Crop Conference Hero Image (16:9 Wide)' }
    );
  };

  const handlePosterUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    openCropper(
      e,
      async (croppedFile) => {
        const res = await cmsService.uploadMedia(croppedFile);
        if (res.success && res.publicUrl) {
          setPosterUrl(res.publicUrl);
        } else {
          alert(`Poster upload failed: ${res.error}`);
        }
      },
      { aspectRatio: 3 / 4, title: 'Crop Conference Poster (3:4 Rectangle)' }
    );
  };

  // Highlights handlers
  const handleAddHighlight = () => {
    setHighlights((prev) => [...prev, 'New conference highlight point...']);
  };
  const handleHighlightChange = (idx: number, val: string) => {
    setHighlights((prev) => prev.map((item, i) => (i === idx ? val : item)));
  };
  const handleDeleteHighlight = (idx: number) => {
    setHighlights((prev) => prev.filter((_, i) => i !== idx));
  };

  // Day 1 Schedule handlers
  const handleAddDay1Row = () => {
    setDay1Schedule((prev) => [...prev, { time: '09:00 AM - 10:00 AM', topic: 'New Session Topic' }]);
  };
  const handleDay1RowChange = (idx: number, field: 'time' | 'topic', val: string) => {
    setDay1Schedule((prev) => prev.map((r, i) => (i === idx ? { ...r, [field]: val } : r)));
  };
  const handleDeleteDay1Row = (idx: number) => {
    setDay1Schedule((prev) => prev.filter((_, i) => i !== idx));
  };
  const handleMoveDay1Row = (idx: number, dir: 'up' | 'down') => {
    const targetIdx = dir === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= day1Schedule.length) return;
    const next = [...day1Schedule];
    const temp = next[idx];
    next[idx] = next[targetIdx];
    next[targetIdx] = temp;
    setDay1Schedule(next);
  };

  // Day 2 Schedule handlers
  const handleAddDay2Row = () => {
    setDay2Schedule((prev) => [...prev, { time: '09:00 AM - 10:00 AM', topic: 'New Session Topic' }]);
  };
  const handleDay2RowChange = (idx: number, field: 'time' | 'topic', val: string) => {
    setDay2Schedule((prev) => prev.map((r, i) => (i === idx ? { ...r, [field]: val } : r)));
  };
  const handleDeleteDay2Row = (idx: number) => {
    setDay2Schedule((prev) => prev.filter((_, i) => i !== idx));
  };
  const handleMoveDay2Row = (idx: number, dir: 'up' | 'down') => {
    const targetIdx = dir === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= day2Schedule.length) return;
    const next = [...day2Schedule];
    const temp = next[idx];
    next[idx] = next[targetIdx];
    next[targetIdx] = temp;
    setDay2Schedule(next);
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    const payload = {
      heroTitle,
      heroImage,
      heading,
      posterUrl,
      description,
      highlights,
      day1Schedule,
      day2Schedule,
      updated_at: new Date().toISOString(),
    };

    const res = await cmsService.saveSetting('edc_conference_content', payload, 'EDC Conferences Page Content');
    setSaving(false);

    if (res.success) {
      setMessage({ type: 'success', text: 'Conference content saved successfully.' });
      setTimeout(() => setMessage(null), 4000);
    } else {
      setMessage({ type: 'error', text: res.error || 'Failed to save changes.' });
    }
  };

  return (
    <div className="space-y-6 text-left max-w-[1250px]">
      <div className="flex items-center gap-4 mb-2">
        <Link
          to="/admin-panel5463/edc/conferences-hub"
          className="p-2 bg-white border border-[#E5E7EB] rounded-md text-[#4B5563] hover:text-[#0093DD] transition-colors"
          title="Back to Conferences Hub"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <AdminPageHeader
          title="Manage EDC Conferences"
          subtitle="Manage conference title, poster image, description paragraphs, overview highlights, and Day 1 / Day 2 schedule sessions."
          action={
            <AdminButton variant="primary" onClick={handleSave} loading={saving} icon={<Save className="w-4 h-4" />}>
              Save Page Changes
            </AdminButton>
          }
        />
      </div>

      {message && (
        <div
          className={`p-4 rounded-lg border text-sm font-medium flex items-center gap-3 ${
            message.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Hero & Poster */}
      <AdminCard className="space-y-4">
        <h3 className="text-base font-bold text-[#1F2937] border-b border-[#F3F4F6] pb-2 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[#0093DD]" />
          <span>1. Conference Hero & Poster Media</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AdminFormGroup label="Hero Banner Title">
            <AdminInput value={heroTitle} onChange={(e) => setHeroTitle(e.target.value)} />
          </AdminFormGroup>

          <AdminFormGroup label="Conference Heading Title">
            <AdminInput value={heading} onChange={(e) => setHeading(e.target.value)} />
          </AdminFormGroup>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <AdminFormGroup label="Hero Background Image Upload">
            <div className="flex items-center gap-3">
              <div className="w-20 h-14 bg-[#F3F4F6] border border-[#E5E7EB] rounded overflow-hidden flex items-center justify-center flex-shrink-0">
                {heroImage ? (
                  <img src={heroImage} alt="Hero" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-5 h-5 text-[#9CA3AF]" />
                )}
              </div>
              <div className="flex gap-2">
                <label className="px-3 py-1.5 bg-[#0093DD] text-white text-xs font-semibold rounded cursor-pointer">
                  <span>{heroImage ? 'Replace' : 'Upload'}</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleHeroUpload} />
                </label>
                {heroImage && (
                  <button type="button" onClick={() => setHeroImage('')} className="px-3 py-1.5 bg-red-50 text-red-600 text-xs font-semibold rounded border border-red-200">
                    Remove
                  </button>
                )}
              </div>
            </div>
          </AdminFormGroup>

          <AdminFormGroup label="Conference Poster Image Upload (Preview / Replace / Remove)">
            <div className="flex items-center gap-3">
              <div className="w-20 h-24 bg-[#F3F4F6] border border-[#E5E7EB] rounded overflow-hidden flex items-center justify-center flex-shrink-0">
                {posterUrl ? (
                  <img src={posterUrl} alt="Poster" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-5 h-5 text-[#9CA3AF]" />
                )}
              </div>
              <div className="flex gap-2">
                <label className="px-3 py-1.5 bg-[#0093DD] text-white text-xs font-semibold rounded cursor-pointer">
                  <span>{posterUrl ? 'Replace Poster' : 'Upload Poster'}</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handlePosterUpload} />
                </label>
                {posterUrl && (
                  <button type="button" onClick={() => setPosterUrl('')} className="px-3 py-1.5 bg-red-50 text-red-600 text-xs font-semibold rounded border border-red-200">
                    Remove
                  </button>
                )}
              </div>
            </div>
          </AdminFormGroup>
        </div>
      </AdminCard>

      {/* Description & Highlights */}
      <AdminCard className="space-y-4">
        <h3 className="text-base font-bold text-[#1F2937] border-b border-[#F3F4F6] pb-2">
          2. Conference Overview & Highlights
        </h3>

        <AdminFormGroup label="Conference Detailed Description (Use double linebreaks between paragraphs)">
          <AdminTextarea rows={5} value={description} onChange={(e) => setDescription(e.target.value)} />
        </AdminFormGroup>

        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-[#1F2937]">Overview Highlight Points</h4>
            <AdminButton variant="secondary" onClick={handleAddHighlight} icon={<Plus className="w-3.5 h-3.5" />}>
              Add Highlight
            </AdminButton>
          </div>

          {highlights.map((hl, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <AdminInput value={hl} onChange={(e) => handleHighlightChange(idx, e.target.value)} />
              <button
                type="button"
                onClick={() => handleDeleteHighlight(idx)}
                className="p-2.5 text-red-600 hover:bg-red-50 rounded border border-red-200 cursor-pointer"
                title="Delete highlight"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </AdminCard>

      {/* Conference Schedule Day 1 & Day 2 */}
      <AdminCard className="space-y-6">
        <h3 className="text-base font-bold text-[#1F2937] border-b border-[#F3F4F6] pb-2">
          3. Conference Schedule Sessions
        </h3>

        {/* Day 1 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-[#0093DD]">Conference Day 1 Schedule</h4>
            <AdminButton variant="secondary" onClick={handleAddDay1Row} icon={<Plus className="w-3.5 h-3.5" />}>
              Add Day 1 Session
            </AdminButton>
          </div>

          <div className="space-y-2">
            {day1Schedule.map((row, idx) => (
              <div key={idx} className="p-3 border border-[#E5E7EB] rounded-md bg-[#F9FAFB] flex flex-col sm:flex-row items-center gap-3">
                <div className="w-full sm:w-1/3">
                  <AdminInput value={row.time} onChange={(e) => handleDay1RowChange(idx, 'time', e.target.value)} placeholder="Time (e.g. 09:00 AM - 10:00 AM)" />
                </div>
                <div className="w-full sm:w-2/3 flex items-center gap-2">
                  <AdminInput value={row.topic} onChange={(e) => handleDay1RowChange(idx, 'topic', e.target.value)} placeholder="Session Topic" />
                  <button type="button" onClick={() => handleMoveDay1Row(idx, 'up')} disabled={idx === 0} className="p-2 border rounded bg-white text-gray-600 disabled:opacity-30">
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button type="button" onClick={() => handleMoveDay1Row(idx, 'down')} disabled={idx === day1Schedule.length - 1} className="p-2 border rounded bg-white text-gray-600 disabled:opacity-30">
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button type="button" onClick={() => handleDeleteDay1Row(idx)} className="p-2 text-red-600 bg-red-50 border border-red-200 rounded">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Day 2 */}
        <div className="space-y-3 pt-4 border-t border-[#E5E7EB]">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-[#0093DD]">Conference Day 2 Schedule</h4>
            <AdminButton variant="secondary" onClick={handleAddDay2Row} icon={<Plus className="w-3.5 h-3.5" />}>
              Add Day 2 Session
            </AdminButton>
          </div>

          <div className="space-y-2">
            {day2Schedule.map((row, idx) => (
              <div key={idx} className="p-3 border border-[#E5E7EB] rounded-md bg-[#F9FAFB] flex flex-col sm:flex-row items-center gap-3">
                <div className="w-full sm:w-1/3">
                  <AdminInput value={row.time} onChange={(e) => handleDay2RowChange(idx, 'time', e.target.value)} placeholder="Time (e.g. 09:00 AM - 10:00 AM)" />
                </div>
                <div className="w-full sm:w-2/3 flex items-center gap-2">
                  <AdminInput value={row.topic} onChange={(e) => handleDay2RowChange(idx, 'topic', e.target.value)} placeholder="Session Topic" />
                  <button type="button" onClick={() => handleMoveDay2Row(idx, 'up')} disabled={idx === 0} className="p-2 border rounded bg-white text-gray-600 disabled:opacity-30">
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button type="button" onClick={() => handleMoveDay2Row(idx, 'down')} disabled={idx === day2Schedule.length - 1} className="p-2 border rounded bg-white text-gray-600 disabled:opacity-30">
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button type="button" onClick={() => handleDeleteDay2Row(idx)} className="p-2 text-red-600 bg-red-50 border border-red-200 rounded">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </AdminCard>

      <div className="flex justify-end pt-2">
        <AdminButton variant="primary" onClick={handleSave} loading={saving} icon={<Save className="w-4 h-4" />}>
          Save Page Changes
        </AdminButton>
      </div>

      <ImageCropModal {...cropperProps} />
    </div>
  );
}
