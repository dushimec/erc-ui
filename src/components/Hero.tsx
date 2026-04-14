import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

const Hero: React.FC = () => {
  const { t } = useTranslation();
  const images = ["/resto1.jpg", "/resto2.webp"];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative h-[60vh] sm:h-[70vh] lg:h-screen overflow-hidden">
      {/* Carousel Images */}
      {images.map((img, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
            idx === currentIndex ? "opacity-100 z-10 scale-105" : "opacity-0 z-0 scale-100"
          }`}
        >
          <img
            src={img}
            alt={`Slide ${idx + 1}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60"></div>
        </div>
      ))}

      {/* Content */}
      <div className="absolute inset-0 z-20 flex flex-col justify-center text-center px-3 sm:px-6 lg:px-8 pt-14">
        <div className={`max-w-4xl mx-auto transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight sm:mb-6 px-2">
            {t('hero.title')}
          </h1>

          <div className="w-16 sm:w-20 h-1 bg-redVar mx-auto mb-4 sm:mb-6 rounded-full"></div>

          <p className="text-white/90 max-w-2xl mx-auto font-medium text-sm sm:text-base leading-relaxed mb-6 sm:mb-8 px-4">
            {t('hero.subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-4">
            <a
              href="#get-started"
              className="inline-block px-6 sm:px-8 py-2.5 sm:py-3 bg-redVar text-white font-semibold rounded-sm shadow-lg hover:bg-red-700 transition-all duration-300 hover:scale-105 hover:shadow-xl text-sm sm:text-base"
            >
              {t('hero.joinUsToday')}
            </a>
          </div>
        </div>
      </div>

      {/* Scroll Indicator - Hidden on mobile */}
      <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 z-20 animate-soft-float hidden sm:block">
        <div className="flex flex-col items-center text-white/70 text-xs">
          <span className="mb-2 tracking-widest">{t('hero.scroll')}</span>
          <div className="w-px h-8 bg-gradient-to-b from-white/70 to-transparent"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
