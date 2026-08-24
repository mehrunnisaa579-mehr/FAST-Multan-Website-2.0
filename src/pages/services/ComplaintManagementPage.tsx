import { useEffect } from 'react';
import { cmsService } from '../../services/cmsService';

export default function ComplaintManagementPage() {
  useEffect(() => {
    const fetchAndRedirect = async () => {
      const data = await cmsService.getSetting<any>('complaint_management_content', null);
      const redirectUrl = data && (data.buttonUrl || data.url) ? data.buttonUrl || data.url : 'https://flexstudent.nu.edu.pk/';
      window.location.href = redirectUrl;
    };
    fetchAndRedirect();
  }, []);

  return (
    <div className="w-full py-20 text-center select-none">
      <div className="inline-block w-8 h-8 border-4 border-[#0093DD] border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-sm font-semibold text-[#666666]">Redirecting to Complaint Management System...</p>
    </div>
  );
}

