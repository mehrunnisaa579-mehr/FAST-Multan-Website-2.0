import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AboutPageHero from '../../components/about/AboutPageHero';
import { cmsService } from '../../services/cmsService';
import { ShieldCheck, FileCheck, ArrowRight, PhoneCall, ArrowLeft } from 'lucide-react';
import '../../styles/about-pages.css';

interface GatepassStep {
  id: string;
  title: string;
  description: string;
  iconUrl?: string;
  visible: boolean;
}

export default function GatepassApplicationPage() {
  const [isVisible, setIsVisible] = useState(true);
  const [title, setTitle] = useState('Gatepass Application Service');
  const [heroImage, setHeroImage] = useState('');
  const [introText, setIntroText] = useState(
    'FAST-NUCES Multan Campus provides an online Gatepass registration service for student vehicles, visitor entries, and campus security access cards.'
  );
  const [mainDescription, setMainDescription] = useState(
    'Students and faculty members must register their motorbikes or cars to obtain official FAST RFID gatepass stickers for seamless campus entry.'
  );
  const [buttonText, setButtonText] = useState('Apply for Vehicle Gatepass');
  const [buttonUrl, setButtonUrl] = useState('https://flexstudent.nu.edu.pk/');
  const [contactInfo, setContactInfo] = useState('Security Office: +92 (61) 111-128-128 | Email: security.multan@nu.edu.pk');

  const [steps, setSteps] = useState<GatepassStep[]>([
    {
      id: 'step-1',
      title: '1. Prepare Required Documents',
      description: 'Copy of valid Driving License, CNIC/Student ID, and Vehicle Registration Book.',
      visible: true,
    },
    {
      id: 'step-2',
      title: '2. Submit Application Online',
      description: 'Fill out vehicle details and upload scanned copies on the campus portal.',
      visible: true,
    },
    {
      id: 'step-3',
      title: '3. Receive Gatepass RFID Sticker',
      description: 'Collect your verified RFID entry sticker from the Security Desk upon approval.',
      visible: true,
    },
  ]);

  useEffect(() => {
    const fetchGatepassData = async () => {
      const data = await cmsService.getSetting<any>('gatepass_application_content', null);
      if (data) {
        setIsVisible(data.isVisible ?? data.is_visible ?? true);
        if (data.title) setTitle(data.title);
        if (data.heroImage) setHeroImage(data.heroImage);
        if (data.introText) setIntroText(data.introText);
        if (data.mainDescription) setMainDescription(data.mainDescription);
        if (data.buttonText) setButtonText(data.buttonText);
        if (data.buttonUrl) setButtonUrl(data.buttonUrl);
        if (data.contactInfo) setContactInfo(data.contactInfo);
        if (Array.isArray(data.steps) && data.steps.length > 0) {
          const visible = data.steps.filter((s: any) => s.visible !== false);
          if (visible.length > 0) setSteps(visible);
        }
      } else {
        const oldData = await cmsService.getSetting<any>('services_content', null);
        if (oldData) {
          if (oldData.gatepassTitle) setTitle(oldData.gatepassTitle);
          if (oldData.gatepassText) setIntroText(oldData.gatepassText);
        }
      }
    };
    fetchGatepassData();
  }, []);

  if (!isVisible) {
    return (
      <div className="w-full bg-white select-none text-left">
        <AboutPageHero title={title || 'Service Unavailable'} backgroundImage={heroImage} />
        <div className="w-full max-w-[800px] mx-auto px-[20px] py-[60px] min-[700px]:py-[80px] text-center">
          <div className="bg-white p-[32px] sm:p-[48px] border border-[#EAEAEA] rounded-[8px] shadow-sm space-y-4">
            <h2 className="text-[22px] sm:text-[26px] font-bold text-[#333333]">Service Currently Unavailable</h2>
            <p className="text-[14px] sm:text-[15px] text-[#666666] leading-relaxed">
              The Gatepass Application service is currently disabled or undergoing scheduled maintenance. Please contact campus security or check back later.
            </p>
            <div className="pt-4">
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#0093DD] hover:bg-[#0C71C3] text-white text-sm font-bold rounded-md shadow-xs transition-colors no-underline"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Homepage</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white text-left">
      <AboutPageHero title={title} backgroundImage={heroImage} />

      <div className="w-full max-w-[1300px] mx-auto px-[16px] sm:px-[40px] py-[40px] min-[700px]:py-[50px] min-[1100px]:pt-[65px] min-[1100px]:pb-[85px] text-[#444444] text-[16px] leading-[1.75] font-normal space-y-[32px]">
        {/* Overview */}
        <div className="space-y-4">
          <p className="text-[18px] font-medium text-[#1F2937] leading-[1.8]">{introText}</p>
          <p className="text-[#4B5563]">{mainDescription}</p>
        </div>

        {/* Action Button Banner */}
        {buttonText && buttonUrl && (
          <div className="p-6 bg-[#F0F9FF] border border-[#B9E6FE] rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-[#0284C7]">Gatepass Application Portal</h3>
              <p className="text-xs text-[#0369A1] mt-0.5">Submit your vehicle registration and license for verification.</p>
            </div>
            <a
              href={buttonUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#0093DD] hover:bg-[#0C71C3] text-white text-sm font-bold rounded-md shadow-xs transition-colors no-underline flex-shrink-0"
            >
              <span>{buttonText}</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        )}

        {/* Gatepass Steps */}
        {steps.length > 0 && (
          <div className="space-y-4 pt-4">
            <h3 className="text-[20px] font-bold text-[#1F2937]">Gatepass Registration Process</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {steps.map((step) => (
                <div key={step.id} className="p-6 bg-white border border-[#E5E7EB] rounded-lg space-y-3 shadow-xs card-hover-lift">
                  {step.iconUrl ? (
                    <div className="w-12 h-12 rounded-md overflow-hidden bg-white border border-[#E5E7EB] p-2">
                      <img src={step.iconUrl} alt={step.title} className="w-full h-full object-contain" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-[#F0F9FF] text-[#0093DD] flex items-center justify-center font-bold">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                  )}
                  <h4 className="text-base font-bold text-[#1F2937]">{step.title}</h4>
                  <p className="text-xs text-[#6B7280] leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contact Info */}
        {contactInfo && (
          <div className="p-4 bg-gray-50 border border-[#E5E7EB] rounded-md text-xs font-semibold text-[#4B5563] flex items-center gap-2">
            <PhoneCall className="w-4 h-4 text-[#0093DD] flex-shrink-0" />
            <span>{contactInfo}</span>
          </div>
        )}
      </div>
    </div>
  );
}
