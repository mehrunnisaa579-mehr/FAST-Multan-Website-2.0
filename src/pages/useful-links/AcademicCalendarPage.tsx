import { useEffect, useState } from 'react';
import AboutPageHero from '../../components/about/AboutPageHero';
import { cmsService } from '../../services/cmsService';
import '../../styles/edc-pages.css';

export interface CalendarSection {
  type: 'text' | 'table';
  content?: string;
  tableData?: string[][];
}

export default function AcademicCalendarPage() {

  const [sections, setSections] = useState<CalendarSection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCmsData = async () => {
      const data = await cmsService.getSetting<any>('academic_calendar_content', null);
      if (data) {
        if (data.sections && Array.isArray(data.sections)) setSections(data.sections);
      }
      setLoading(false);
    };
    fetchCmsData();
  }, []);

  return (
    <div className="bg-[#F9FAFB] min-h-screen pb-20">
      <AboutPageHero title="Academic Calendar" />

      {/* Main Container */}
      <div className="w-full max-w-[1160px] mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-10 flex flex-col items-start justify-start">

        {/* Dynamic Spreadsheet Content */}
        {loading ? (
          <div className="w-full flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-[#0093DD] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : sections.length > 0 ? (
          <div className="w-full space-y-8">
            {sections.map((section, secIdx) => {
              if (section.type === 'text') {
                return (
                  <h3 
                    key={secIdx} 
                    className="text-[18px] sm:text-[20px] font-bold text-[#0C71C3] tracking-tight border-b border-[#E2E8F0] pb-2 mb-4 w-full"
                  >
                    {section.content}
                  </h3>
                );
              } else if (section.type === 'table' && section.tableData && section.tableData.length > 0) {
                return (
                  <div key={secIdx} className="w-full overflow-x-auto rounded-lg shadow-sm border border-[#E2E8F0] mb-4">
                    <table className="w-full text-[13px] sm:text-[14px] text-left border-collapse min-w-[600px] bg-white">
                      <thead>
                        <tr>
                          {section.tableData[0]?.map((cell, colIdx) => (
                            <th 
                              key={colIdx} 
                              className="px-4 py-2.5 bg-[#0C71C3] text-white font-semibold border-b border-r border-[#095A9D] whitespace-nowrap first:rounded-tl-lg last:rounded-tr-lg last:border-r-0"
                            >
                              {cell}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {section.tableData.slice(1).map((row, rowIdx) => (
                          <tr key={rowIdx} className="even:bg-[#F8FAFC] hover:bg-[#F1F5F9] transition-colors">
                            {row.map((cell, colIdx) => (
                              <td 
                                key={colIdx} 
                                className={`px-4 py-2 border-b border-r border-[#E2E8F0] text-[#334155] last:border-r-0 ${
                                  colIdx === 0 ? 'font-semibold text-[#1E293B]' : ''
                                }`}
                              >
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              }
              return null;
            })}
          </div>
        ) : (
          <div className="w-full text-center py-16 text-[#6B7280]">
            No academic calendar data available at the moment.
          </div>
        )}
      </div>
    </div>
  );
}
