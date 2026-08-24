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
import { Save, CheckCircle2, AlertCircle, Upload, ImageIcon, ArrowLeft, BookOpen, Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import bootcampPoster from '../../assets/images/bootcamp_course_poster.png';

export default function AdminEDCSummerBootcampEditor() {
  const [heroTitle, setHeroTitle] = useState('Summer Bootcamp 2026');
  const [heroImage, setHeroImage] = useState('');
  const [title, setTitle] = useState('Summer Bootcamp 2026');
  const [subtitle, setSubtitle] = useState('Executive Development Centre — FAST-NUCES Multan Campus');
  const [overview, setOverview] = useState(
    'The Summer Bootcamp 2026 is an intensive executive training program organized by the Executive Development Centre (EDC) at FAST-NUCES Multan Campus to enhance leadership, analytical, and digital skills.\n\nDesigned for corporate professionals, entrepreneurs, and advanced students, the bootcamp combines interactive lectures, practical case studies, and hands-on group project mentorship.'
  );

  const [promoImage, setPromoImage] = useState(bootcampPoster);
  const [courseTitle, setCourseTitle] = useState('Full Stack Web Development & Freelancing Bootcamp');
  const [objectives, setObjectives] = useState<string[]>([
    'Master modern front-end & back-end technologies (React, Node.js, Express, MongoDB/SQL).',
    'Build production-ready full stack web applications from scratch.',
    'Learn professional freelancing strategies, client acquisition, and proposal writing on platforms like Upwork and Fiverr.',
    'Gain hands-on experience through real-world capstone projects and industry-standard workflows.',
  ]);
  const [learningOutcomes, setLearningOutcomes] = useState<string[]>([
    'Develop responsive, dynamic web applications using React and modern JavaScript.',
    'Design and deploy RESTful APIs and secure database architectures.',
    'Utilize Git and GitHub for version control and team collaboration.',
    'Launch and optimize freelancing profiles to secure high-paying global clients.',
    'Deliver end-to-end web development solutions from client requirements to production deployment.',
  ]);

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const data = await cmsService.getSetting<any>('edc_bootcamp_content', null);
      if (data) {
        if (data.heroTitle) setHeroTitle(data.heroTitle);
        if (data.heroImage) setHeroImage(data.heroImage);
        if (data.title) setTitle(data.title);
        if (data.subtitle) setSubtitle(data.subtitle);
        if (data.overview) setOverview(data.overview);
        
        if (data.promoImage) setPromoImage(data.promoImage);
        if (data.courseTitle) setCourseTitle(data.courseTitle);
        if (data.objectives && Array.isArray(data.objectives)) setObjectives(data.objectives);
        if (data.learningOutcomes && Array.isArray(data.learningOutcomes)) setLearningOutcomes(data.learningOutcomes);
      }
    };
    loadData();
  }, []);

  const { cropperProps, openCropper } = useImageCropper();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, setUrlFn: (url: string) => void, aspect: number, cropTitle: string) => {
    openCropper(
      e,
      async (croppedFile) => {
        const res = await cmsService.uploadMedia(croppedFile);
        if (res.success && res.publicUrl) {
          setUrlFn(res.publicUrl);
        } else {
          alert(`Upload failed: ${res.error}`);
        }
      },
      { aspectRatio: aspect, title: cropTitle }
    );
  };

  const handleArrayMove = (arr: string[], setArr: (val: string[]) => void, idx: number, dir: 'up' | 'down') => {
    const targetIdx = dir === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= arr.length) return;
    const next = [...arr];
    const temp = next[idx];
    next[idx] = next[targetIdx];
    next[targetIdx] = temp;
    setArr(next);
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    const payload = {
      heroTitle,
      heroImage,
      title,
      subtitle,
      overview,
      promoImage,
      courseTitle,
      objectives,
      learningOutcomes,
      updated_at: new Date().toISOString(),
    };

    const res = await cmsService.saveSetting('edc_bootcamp_content', payload, 'Summer Bootcamp 2026 Content');
    setSaving(false);

    if (res.success) {
      setMessage({ type: 'success', text: 'Summer Bootcamp 2026 saved successfully.' });
      setTimeout(() => setMessage(null), 4000);
    } else {
      setMessage({ type: 'error', text: res.error || 'Failed to save changes.' });
    }
  };

  return (
    <div className="space-y-6 text-left max-w-[1250px]">
      <div className="flex items-center gap-4 mb-2">
        <Link
          to="/admin-panel5463/edc/workshops-hub"
          className="p-2 bg-white border border-[#E5E7EB] rounded-md text-[#4B5563] hover:text-[#0093DD] transition-colors"
          title="Back to Workshops Hub"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <AdminPageHeader
          title="Summer Bootcamp 2026 Settings"
          subtitle="Manage the basic information and the specific content structure for the Summer Bootcamp 2026 page."
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

      {/* Basic Information */}
      <AdminCard className="space-y-4">
        <h3 className="text-base font-bold text-[#1F2937] border-b border-[#F3F4F6] pb-2 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-[#0093DD]" />
          <span>Basic Information</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AdminFormGroup label="Hero Page Title">
            <AdminInput value={heroTitle} onChange={(e) => setHeroTitle(e.target.value)} />
          </AdminFormGroup>

          <AdminFormGroup label="Workshop Title">
            <AdminInput value={title} onChange={(e) => setTitle(e.target.value)} />
          </AdminFormGroup>
        </div>

        <AdminFormGroup label="Organization / Subtitle">
          <AdminInput value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
        </AdminFormGroup>

        <AdminFormGroup label="Hero Background Image">
          <div className="flex items-center gap-4">
            <div className="w-24 h-14 bg-[#F3F4F6] border border-[#E5E7EB] rounded-md overflow-hidden flex items-center justify-center flex-shrink-0">
              {heroImage ? (
                <img src={heroImage} alt="Hero Preview" className="w-full h-full object-cover" />
              ) : (
                <ImageIcon className="w-6 h-6 text-[#9CA3AF]" />
              )}
            </div>
            <div className="flex gap-2">
              <label className="px-3.5 py-2 bg-[#0093DD] hover:bg-[#0C71C3] text-white text-xs font-semibold rounded-md cursor-pointer flex items-center gap-1.5 shadow-xs">
                <Upload className="w-4 h-4" />
                <span>{heroImage ? 'Replace Image' : 'Upload Image'}</span>
                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, setHeroImage, 16 / 9, 'Crop Bootcamp Hero Image')} />
              </label>
              {heroImage && (
                <button
                  type="button"
                  onClick={() => setHeroImage('')}
                  className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-[#DC2626] text-xs font-semibold rounded-md border border-red-200 cursor-pointer"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        </AdminFormGroup>

        <AdminFormGroup label="Workshop Overview">
          <AdminTextarea rows={5} value={overview} onChange={(e) => setOverview(e.target.value)} />
        </AdminFormGroup>
      </AdminCard>

      {/* Workshop Content */}
      <AdminCard className="space-y-6">
        <h3 className="text-base font-bold text-[#1F2937] border-b border-[#F3F4F6] pb-2 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-[#0093DD]" />
          <span>Workshop Content</span>
        </h3>

        <AdminFormGroup label="Promotional Image (Left Side Banner)">
          <div className="flex items-start gap-4">
            <div className="w-32 h-40 bg-[#F3F4F6] border border-[#E5E7EB] rounded-md overflow-hidden flex items-center justify-center flex-shrink-0 shadow-sm">
              {promoImage ? (
                <img src={promoImage} alt="Promo Preview" className="w-full h-full object-cover" />
              ) : (
                <ImageIcon className="w-8 h-8 text-[#9CA3AF]" />
              )}
            </div>
            <div className="flex flex-col gap-2 pt-2">
              <label className="px-3.5 py-2 w-max bg-[#0093DD] hover:bg-[#0C71C3] text-white text-xs font-semibold rounded-md cursor-pointer flex items-center gap-1.5 shadow-xs">
                <Upload className="w-4 h-4" />
                <span>{promoImage ? 'Replace Promotional Image' : 'Upload Promotional Image'}</span>
                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, setPromoImage, 3 / 4, 'Crop Promotional Image')} />
              </label>
              {promoImage && (
                <button
                  type="button"
                  onClick={() => setPromoImage('')}
                  className="px-3.5 py-2 w-max bg-red-50 hover:bg-red-100 text-[#DC2626] text-xs font-semibold rounded-md border border-red-200 cursor-pointer"
                >
                  Remove Image
                </button>
              )}
              <p className="text-xs text-gray-500 mt-2">Recommended size: Portrait or vertical flyer format.</p>
            </div>
          </div>
        </AdminFormGroup>

        <AdminFormGroup label="Course Title (Right Side Heading)">
          <AdminInput value={courseTitle} onChange={(e) => setCourseTitle(e.target.value)} />
        </AdminFormGroup>

        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-[#F3F4F6] pb-2">
            <h4 className="text-sm font-bold text-[#1F2937]">Objectives</h4>
            <AdminButton variant="secondary" onClick={() => setObjectives([...objectives, ''])} icon={<Plus className="w-3.5 h-3.5" />}>
              Add Objective
            </AdminButton>
          </div>
          <div className="space-y-2">
            {objectives.map((obj, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <div className="flex-1">
                  <AdminTextarea
                    rows={2}
                    value={obj}
                    onChange={(e) => {
                      const updated = [...objectives];
                      updated[idx] = e.target.value;
                      setObjectives(updated);
                    }}
                    placeholder={`Objective ${idx + 1}`}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <button type="button" onClick={() => handleArrayMove(objectives, setObjectives, idx, 'up')} disabled={idx === 0} className="p-1.5 border rounded bg-white text-gray-600 disabled:opacity-30">
                    <ArrowUp className="w-3 h-3" />
                  </button>
                  <button type="button" onClick={() => handleArrayMove(objectives, setObjectives, idx, 'down')} disabled={idx === objectives.length - 1} className="p-1.5 border rounded bg-white text-gray-600 disabled:opacity-30">
                    <ArrowDown className="w-3 h-3" />
                  </button>
                  <button type="button" onClick={() => setObjectives(objectives.filter((_, i) => i !== idx))} className="p-1.5 text-red-600 bg-red-50 border border-red-200 rounded mt-1">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
            {objectives.length === 0 && <p className="text-sm text-gray-500 italic">No objectives added.</p>}
          </div>
        </div>

        <div className="space-y-3 pt-4 border-t border-[#E5E7EB]">
          <div className="flex items-center justify-between border-b border-[#F3F4F6] pb-2">
            <h4 className="text-sm font-bold text-[#1F2937]">Learning Outcomes</h4>
            <AdminButton variant="secondary" onClick={() => setLearningOutcomes([...learningOutcomes, ''])} icon={<Plus className="w-3.5 h-3.5" />}>
              Add Learning Outcome
            </AdminButton>
          </div>
          <div className="space-y-2">
            {learningOutcomes.map((outcome, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <div className="flex-1">
                  <AdminTextarea
                    rows={2}
                    value={outcome}
                    onChange={(e) => {
                      const updated = [...learningOutcomes];
                      updated[idx] = e.target.value;
                      setLearningOutcomes(updated);
                    }}
                    placeholder={`Learning Outcome ${idx + 1}`}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <button type="button" onClick={() => handleArrayMove(learningOutcomes, setLearningOutcomes, idx, 'up')} disabled={idx === 0} className="p-1.5 border rounded bg-white text-gray-600 disabled:opacity-30">
                    <ArrowUp className="w-3 h-3" />
                  </button>
                  <button type="button" onClick={() => handleArrayMove(learningOutcomes, setLearningOutcomes, idx, 'down')} disabled={idx === learningOutcomes.length - 1} className="p-1.5 border rounded bg-white text-gray-600 disabled:opacity-30">
                    <ArrowDown className="w-3 h-3" />
                  </button>
                  <button type="button" onClick={() => setLearningOutcomes(learningOutcomes.filter((_, i) => i !== idx))} className="p-1.5 text-red-600 bg-red-50 border border-red-200 rounded mt-1">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
            {learningOutcomes.length === 0 && <p className="text-sm text-gray-500 italic">No learning outcomes added.</p>}
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
