import { homepageContent } from '../../data/homepage';

export default function WhyChooseUs() {
  const items = homepageContent.whyChooseUs;

  return (
    <section className="py-[60px] w-full bg-white select-none">
      <div className="w-full max-w-[1300px] mx-auto px-[16px] sm:px-[40px]">
        {/* Section Heading & Subheading */}
        <h2 className="text-[28px] font-bold text-[#16498C] text-center mb-2">
          Why Choose Us
        </h2>
        <p className="text-[15px] text-[#666666] text-center mb-[40px] font-medium">
          We are committed to academic excellence
        </p>

        {/* 2x2 Grid / Stacking on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[32px] max-w-[1000px] mx-auto">
          {items.map((item, index) => {
            const hasIcon = !!item.icon;
            return (
              <div key={index} className="flex flex-row gap-[16px] items-start text-left w-full">
                {/* Left Side: Icon / Placeholder */}
                <div className="w-[60px] h-[60px] flex-shrink-0 flex items-center justify-center bg-[#E5E5E5] rounded-[4px]">
                  {hasIcon ? (
                    <img 
                      src={item.icon} 
                      alt={item.title} 
                      className="w-full h-full object-contain" 
                    />
                  ) : (
                    <span className="text-[10px] font-bold text-[#999999] tracking-wider">
                      ICON
                    </span>
                  )}
                </div>

                {/* Right Side: Title & Description */}
                <div>
                  <h3 className="text-[17px] font-bold text-[#16498C] mb-[8px] leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-[14px] leading-[1.6] text-[#555555]">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
