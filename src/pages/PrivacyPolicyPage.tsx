import AboutPageHero from '../components/about/AboutPageHero';
import '../styles/legal-contact-pages.css';

export default function PrivacyPolicyPage() {
  return (
    <div className="w-full bg-white text-left">
      {/* Shared Hero */}
      <AboutPageHero title="Privacy Policy" />

      {/* Main Content Area */}
      <div className="legal-contact-wrapper">
        <div className="legal-content-column">
          {/* Header */}
          <h1 className="text-[24px] min-[700px]:text-[28px] font-bold text-[#333333] mb-[8px]">
            Privacy Policy
          </h1>
          <p className="text-[14px] font-medium text-[#666666] mb-[16px]">
            PLACEHOLDER: Last updated date
          </p>
          <p className="text-[15px] leading-[1.75] text-[#444444] mb-[36px]">
            PLACEHOLDER: The official privacy policy for the FAST-NUCES Multan Campus website will be placed here outlining general procedures regarding digital information handling, visitor privacy rights, and institutional compliance standards.
          </p>

          {/* Sections Flow */}
          <div className="space-y-[32px]">
            {/* 1. Interpretation and Definitions */}
            <div>
              <h2 className="text-[20px] font-bold text-[#333333] mb-[10px]">
                1. Interpretation and Definitions
              </h2>
              <p className="text-[15px] leading-[1.75] text-[#444444]">
                PLACEHOLDER: General definitions for terms used within this privacy document including University, Service, User, and Personal Data will be specified here upon formal policy approval.
              </p>
            </div>

            {/* 2. Information We Collect */}
            <div>
              <h2 className="text-[20px] font-bold text-[#333333] mb-[10px]">
                2. Information We Collect
              </h2>
              <p className="text-[15px] leading-[1.75] text-[#444444] mb-[10px]">
                PLACEHOLDER: The website may collect general technical usage logs, form submissions, and academic query details as specified below:
              </p>
              <ul className="list-disc list-inside space-y-[6px] text-[15px] leading-[1.7] text-[#444444] pl-[10px]">
                <li>PLACEHOLDER: Technical data including IP address, browser type, and device diagnostics.</li>
                <li>PLACEHOLDER: Contact information provided voluntarily through online query forms.</li>
                <li>PLACEHOLDER: Academic application data processed via official institutional portals.</li>
              </ul>
            </div>

            {/* 3. How We Use Information */}
            <div>
              <h2 className="text-[20px] font-bold text-[#333333] mb-[10px]">
                3. How We Use Information
              </h2>
              <p className="text-[15px] leading-[1.75] text-[#444444]">
                PLACEHOLDER: Collected information is utilized exclusively for institutional administrative purposes, academic services delivery, campus communication, website performance optimization, and regulatory compliance.
              </p>
            </div>

            {/* 4. Cookies and Tracking Technologies */}
            <div>
              <h2 className="text-[20px] font-bold text-[#333333] mb-[10px]">
                4. Cookies and Tracking Technologies
              </h2>
              <p className="text-[15px] leading-[1.75] text-[#444444]">
                PLACEHOLDER: Essential session cookies and security cookies may be utilized to preserve portal functionality, user session state, and navigational performance.
              </p>
            </div>

            {/* 5. Data Retention */}
            <div>
              <h2 className="text-[20px] font-bold text-[#333333] mb-[10px]">
                5. Data Retention
              </h2>
              <p className="text-[15px] leading-[1.75] text-[#444444]">
                PLACEHOLDER: Personal data and academic query records will be retained only for as long as necessary to fulfill statutory academic purposes and institutional reporting requirements.
              </p>
            </div>

            {/* 6. Data Security */}
            <div>
              <h2 className="text-[20px] font-bold text-[#333333] mb-[10px]">
                6. Data Security
              </h2>
              <p className="text-[15px] leading-[1.75] text-[#444444]">
                PLACEHOLDER: FAST-NUCES Multan employs reasonable administrative and technical safeguards to prevent unauthorized access, data loss, or disclosure of user information.
              </p>
            </div>

            {/* 7. Third-Party Links */}
            <div>
              <h2 className="text-[20px] font-bold text-[#333333] mb-[10px]">
                7. Third-Party Links
              </h2>
              <p className="text-[15px] leading-[1.75] text-[#444444]">
                PLACEHOLDER: The site may contain links to official external university domains or government portals. FAST-NUCES Multan is not responsible for third-party privacy policies.
              </p>
            </div>

            {/* 8. Children's Privacy */}
            <div>
              <h2 className="text-[20px] font-bold text-[#333333] mb-[10px]">
                8. Children's Privacy
              </h2>
              <p className="text-[15px] leading-[1.75] text-[#444444]">
                PLACEHOLDER: Our web services are intended for higher education applicants, university students, and faculty. We do not knowingly collect personal data from minors.
              </p>
            </div>

            {/* 9. Changes to This Privacy Policy */}
            <div>
              <h2 className="text-[20px] font-bold text-[#333333] mb-[10px]">
                9. Changes to This Privacy Policy
              </h2>
              <p className="text-[15px] leading-[1.75] text-[#444444]">
                PLACEHOLDER: The university reserves the right to update this privacy policy periodically. Revised policy revisions will be posted on this page with an updated revision date.
              </p>
            </div>

            {/* 10. Contact Us */}
            <div>
              <h2 className="text-[20px] font-bold text-[#333333] mb-[10px]">
                10. Contact Us
              </h2>
              <p className="text-[15px] leading-[1.75] text-[#444444]">
                PLACEHOLDER: If you have any inquiries regarding this privacy policy or data handling practices, please contact the FAST-NUCES Multan administration office.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
