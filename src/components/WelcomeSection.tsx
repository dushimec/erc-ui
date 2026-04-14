import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const WelcomeSection: React.FC = () => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const element = document.getElementById('welcome-section');
      if (element) {
        const rect = element.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.8) {
          setIsVisible(true);
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section id="welcome-section" className="bg-white py-12 sm:py-16 px-3 sm:px-6 lg:px-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-stretch">
        {/* Left Side - Image */}
        <div className={`flex justify-center transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12}'}`}>
          <img
            src="/aaron.jpeg"
            alt="Church Leaders"
            className="rounded-sm shadow-lg object-cover w-full max-w-sm sm:max-w-lg lg:max-w-[480px] h-auto hover:scale-[1.02] transition-transform duration-500"
          />
        </div>

        {/* Right Side - Content */}
        <div className={`flex flex-col justify-center transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12}'}`}>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 leading-snug">
            {t('welcome.title')}
          </h2>

          <div className="w-12 sm:w-16 h-1 bg-redVar my-3 sm:my-4 rounded-full"></div>

          <p className="text-gray-700 leading-relaxed mb-3 sm:mb-4 text-sm">
            {t('welcome.description1')}
          </p>

          <p className="text-gray-700 leading-relaxed mb-3 sm:mb-4 text-sm">
            {t('welcome.description2')}
          </p>

          <p className="text-gray-700 leading-relaxed mb-4 sm:mb-6 text-sm">
            {t('welcome.description3')}
          </p>

          <p className="italic font-medium text-gray-800 text-sm">
            {t('welcome.seniorPastor')} {t('welcome.pastorName')}
          </p>

          <a href="/aboutus" className="px-4 sm:px-5 py-2 sm:py-2.5 bg-redVar text-white rounded-sm shadow-md hover:bg-red-700 transition-all duration-300 hover:scale-[1.02] mt-4 sm:mt-5 w-auto self-start text-center text-sm">
            {t('welcome.readMore')}
          </a>
        </div>
      </div>
    </section>
  );
};

export default WelcomeSection;
