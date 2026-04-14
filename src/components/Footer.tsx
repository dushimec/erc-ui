import React from "react";
import { useTranslation } from "react-i18next";

const Footer: React.FC = () => {
  const { t } = useTranslation();
  return (
    <footer className="bg-gray-900 text-gray-200 py-12 px-4 sm:px-6 lg:px-16">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
        {/* About */}
        <div className="animate-gentle-fade">
          <h3 className="text-lg sm:text-xl font-bold text-white mb-4">{t('footer.about')}</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            {t('footer.aboutText')}
          </p>
          <div className="flex flex-wrap gap-4 mt-4">
            <a href="#" className="hover:text-white transition-all duration-300 hover:scale-110 text-xs sm:text-sm">{t('footer.facebook')}</a>
            <a href="#" className="hover:text-white transition-all duration-300 hover:scale-110 text-xs sm:text-sm">{t('footer.instagram')}</a>
            <a href="#" className="hover:text-white transition-all duration-300 hover:scale-110 text-xs sm:text-sm">{t('footer.twitter')}</a>
            <a href="#" className="hover:text-white transition-all duration-300 hover:scale-110 text-xs sm:text-sm">{t('footer.youtube')}</a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="animate-gentle-fade delay-100">
          <h3 className="text-lg sm:text-xl font-bold text-white mb-4">{t('footer.quickLinks')}</h3>
          <ul className="space-y-2">
            <li>
              <a href="#home" className="hover:text-white transition-colors duration-300 text-sm">
                {t('common.home')}
              </a>
            </li>
            <li>
              <a href="#about" className="hover:text-white transition-colors duration-300 text-sm">
                {t('common.about')}
              </a>
            </li>
            <li>
              <a href="#sermons" className="hover:text-white transition-colors duration-300 text-sm">
                {t('common.sermons')}
              </a>
            </li>
            <li>
              <a href="#events" className="hover:text-white transition-colors duration-300 text-sm">
                {t('common.events')}
              </a>
            </li>
            <li>
              <a href="#contact" className="hover:text-white transition-colors duration-300 text-sm">
                {t('common.contact')}
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="animate-gentle-fade delay-200">
          <h3 className="text-lg sm:text-xl font-bold text-white mb-4">{t('footer.contactUs')}</h3>
          <p className="text-gray-400 text-sm">{t('footer.contactInfo')}</p>
          <p className="text-gray-400 mt-3 text-sm">{t('footer.email')}: {t('footer.emailInfo')}</p>
          <p className="text-gray-400 mt-1 text-sm">{t('footer.phone')}: {t('footer.phoneInfo')}</p>
        </div>

        {/* Newsletter */}
        <div className="animate-gentle-fade delay-300">
          <h3 className="text-lg sm:text-xl font-bold text-white mb-4">{t('footer.newsletter')}</h3>
          <p className="text-gray-400 text-sm mb-4">
            {t('footer.newsletterText')}
          </p>
          <form className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              placeholder={t('footer.yourEmail')}
              className="px-3 py-2 rounded-sm text-gray-900 focus:outline-none w-full text-sm"
            />
            <button
              type="submit"
              className="bg-red-600 px-4 py-2 rounded-sm text-white font-semibold hover:bg-red-700 transition-all duration-300 hover:shadow-lg text-sm whitespace-nowrap"
            >
              {t('footer.subscribe')}
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-gray-800 mt-10 pt-6 text-center text-gray-500 text-xs sm:text-sm">
        &copy; {new Date().getFullYear()} Evangelical Restoration Church. {t('footer.allRights')}
      </div>
    </footer>
  );
};

export default Footer;
