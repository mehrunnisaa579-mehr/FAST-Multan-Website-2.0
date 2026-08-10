import AboutPageHero from '../components/about/AboutPageHero';
import '../styles/legal-contact-pages.css';

export default function TermsOfUsePage() {
  return (
    <div className="legal-contact-bg">
      {/* Shared Hero */}
      <AboutPageHero title="Terms Of Use" />

      {/* Main Content Area */}
      <div className="legal-contact-wrapper">
        <div className="legal-content-column">
          {/* Header */}
          <h1 className="text-[24px] min-[700px]:text-[28px] font-bold text-[#333333] mb-[8px]">
            Terms and Conditions
          </h1>
          <p className="text-[14px] font-medium text-[#666666] mb-[16px]">
            PLACEHOLDER: Last updated date
          </p>
          <p className="text-[15px] leading-[1.75] text-[#444444] mb-[36px]">
            PLACEHOLDER: The official Terms of Use for the FAST-NUCES Multan Campus website will be placed here outlining conditions of access, intellectual property governance, and web service usage rules.
          </p>

          {/* Sections Flow */}
          <div className="space-y-[32px]">
            {/* 1. Interpretation and Definitions */}
            <div>
              <h2 className="text-[20px] font-bold text-[#333333] mb-[10px]">
                1. Interpretation and Definitions
              </h2>
              <p className="text-[15px] leading-[1.75] text-[#444444]">
                PLACEHOLDER: General definitions for terms including University, Content, Service, and User will be specified here upon formal institutional governance approval.
              </p>
            </div>

            {/* 2. Acceptance of Terms */}
            <div>
              <h2 className="text-[20px] font-bold text-[#333333] mb-[10px]">
                2. Acceptance of Terms
              </h2>
              <p className="text-[15px] leading-[1.75] text-[#444444]">
                PLACEHOLDER: By accessing or browsing the FAST-NUCES Multan website, visitors agree to abide by all university regulations, digital usage policies, and statutory terms.
              </p>
            </div>

            {/* 3. Website Use */}
            <div>
              <h2 className="text-[20px] font-bold text-[#333333] mb-[10px]">
                3. Website Use
              </h2>
              <p className="text-[15px] leading-[1.75] text-[#444444]">
                PLACEHOLDER: Users must utilize website resources solely for lawful educational, informational, and academic purposes without attempting unauthorized system access.
              </p>
            </div>

            {/* 4. Intellectual Property */}
            <div>
              <h2 className="text-[20px] font-bold text-[#333333] mb-[10px]">
                4. Intellectual Property
              </h2>
              <p className="text-[15px] leading-[1.75] text-[#444444]">
                PLACEHOLDER: All website content, institutional logos, academic prospectuses, and design elements are the intellectual property of FAST-NUCES.
              </p>
            </div>

            {/* 5. Links to Other Websites */}
            <div>
              <h2 className="text-[20px] font-bold text-[#333333] mb-[10px]">
                5. Links to Other Websites
              </h2>
              <p className="text-[15px] leading-[1.75] text-[#444444]">
                PLACEHOLDER: Links to external web pages or third-party educational tools are provided for convenience only. The university assumes no liability for external site content.
              </p>
            </div>

            {/* 6. Limitation of Liability */}
            <div>
              <h2 className="text-[20px] font-bold text-[#333333] mb-[10px]">
                6. Limitation of Liability
              </h2>
              <p className="text-[15px] leading-[1.75] text-[#444444]">
                PLACEHOLDER: FAST-NUCES Multan shall not be held liable for any indirect or consequential damages arising from website access, technical interruptions, or informational delays.
              </p>
            </div>

            {/* 7. Disclaimer */}
            <div>
              <h2 className="text-[20px] font-bold text-[#333333] mb-[10px]">
                7. Disclaimer
              </h2>
              <p className="text-[15px] leading-[1.75] text-[#444444]">
                PLACEHOLDER: Web content and program descriptions are provided on an "as is" basis for informational guidance. Official academic regulations remain authoritative.
              </p>
            </div>

            {/* 8. Governing Terms */}
            <div>
              <h2 className="text-[20px] font-bold text-[#333333] mb-[10px]">
                8. Governing Terms
              </h2>
              <p className="text-[15px] leading-[1.75] text-[#444444]">
                PLACEHOLDER: These terms shall be governed by and interpreted in accordance with applicable federal university charters and national higher education standards.
              </p>
            </div>

            {/* 9. Termination */}
            <div>
              <h2 className="text-[20px] font-bold text-[#333333] mb-[10px]">
                9. Termination
              </h2>
              <p className="text-[15px] leading-[1.75] text-[#444444]">
                PLACEHOLDER: The university reserves the right to restrict or terminate access to online portals in cases of policy violation or unauthorized system activity.
              </p>
            </div>

            {/* 10. Changes to These Terms */}
            <div>
              <h2 className="text-[20px] font-bold text-[#333333] mb-[10px]">
                10. Changes to These Terms
              </h2>
              <p className="text-[15px] leading-[1.75] text-[#444444]">
                PLACEHOLDER: Terms of use may be modified periodically. Continued use of the website following published updates constitutes acceptance of modified terms.
              </p>
            </div>

            {/* 11. Contact Us */}
            <div>
              <h2 className="text-[20px] font-bold text-[#333333] mb-[10px]">
                11. Contact Us
              </h2>
              <p className="text-[15px] leading-[1.75] text-[#444444]">
                PLACEHOLDER: For questions regarding website terms or institutional policies, please contact the FAST-NUCES Multan administration office.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
