import { homepageContent } from '../../data/homepage';

export default function OurSchools() {
  const schools = homepageContent.ourSchools;

  return (
    <section className="py-[60px] w-full bg-[#F7F9FC] select-none">
      <div className="w-full max-w-[1300px] mx-auto px-[16px] sm:px-[40px]">
        {/* Section Heading & Subheading */}
        <h2 className="text-[28px] font-bold text-[#16498C] text-center mb-2">
          Our Schools
        </h2>
        <p className="text-[15px] text-[#666666] text-center mb-[40px] font-medium">
          Explore the program that matches your interests
        </p>

        {/* Cards Wrapper */}
        <div className="flex flex-col md:flex-row gap-[24px] justify-center items-stretch">
          {schools.map((school, index) => {
            const hasIcon = !!school.icon;
            return (
              <div 
                key={index}
                className="w-full max-w-[320px] md:w-[300px] bg-white rounded-[8px] shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-[32px] text-center flex flex-col items-center transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_6px_16px_rgba(0,0,0,0.12)] cursor-pointer"
              >
                {/* Icon Area Placeholder */}
                <div className="w-[70px] h-[70px] mb-[16px] flex-shrink-0 flex items-center justify-center">
                  {hasIcon ? (
                    <img 
                      src={school.icon} 
                      alt={school.name} 
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#E5E5E5] rounded-full flex items-center justify-center">
                      <span className="text-[10px] font-bold text-[#999999] tracking-wider">
                        ICON
                      </span>
                    </div>
                  )}
                </div>

                {/* School Name */}
                <h3 className="text-[15px] font-bold text-[#333333] uppercase leading-snug mt-auto">
                  {school.name}
                </h3>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
