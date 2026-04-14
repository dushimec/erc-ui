import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import RegistrationModal from "./RegistrationModal";
import VerificationModal from "./VerificationModal";
import SearchModal from "./SearchModal";

const Navbar: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLangDropdownOpen, setLangDropdownOpen] = useState(false);
  const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isVerificationModalOpen, setVerificationModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [verificationEmail] = useState("");
  const [verificationType] = useState<'email' | '2fa'>('email');
  const location = useLocation();

  const languages = [
    { code: 'en', name: 'English', short: 'EN' },
    { code: 'rw', name: 'Kinyarwanda', short: 'RW' },
    { code: 'fr', name: 'Français', short: 'FR' },
  ];

  const currentLang = languages.find(l => l.code === i18n.language) || languages[0];

  const changeLanguage = (langCode: string) => {
    i18n.changeLanguage(langCode);
    setLangDropdownOpen(false);
  };

  const navItems = [
    { key: 'common.home', path: '/' },
    { key: 'common.about', path: '/about' },
    { key: 'common.services', path: '/services' },
    { key: 'common.events', path: '/events' },
    { key: 'common.contact', path: '/contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  return (
    <header className="w-full fixed top-0 left-0 z-50">
      {/* Top Bar - Compact on mobile */}
      <div className="bg-redVar text-white text-[10px] sm:text-xs">
        <div className="max-w-7xl mx-auto flex justify-between items-center py-1 px-3 sm:px-6 lg:px-16">
          {/* Contact Info - Hidden on very small mobile, shown on sm+ */}
          <div className="hidden sm:flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="tracking-wide whitespace-nowrap">Kimisagara, Kigali, Rwanda</span>
            <span className="text-gray-400">|</span>
            <span className="whitespace-nowrap">info@erckimisagara.org</span>
            <span className="text-gray-400">|</span>
            <span className="whitespace-nowrap">(+250) 788405507</span>
          </div>
          
          {/* Mobile: Just location + Donate button inline */}
          <div className="flex items-center justify-between w-full sm:hidden">
            <span className="truncate text-[10px]">Kimisagara, Kigali, Rwanda, </span>
            <span className="truncate text-[10px]">(+250) 788405507</span>
            <Link
              to="/donate"
              className="bg-white text-redVar px-2 py-1 rounded-sm font-medium hover:bg-gray-100 transition text-[10px]"
            >
              {t('common.donate')}
            </Link>
          </div>

          {/* Donate Button - Desktop */}
          <div className="hidden sm:block">
            <Link
              to="/donate"
              className="bg-white text-redVar px-3 py-1 sm:px-4 sm:py-1.5 rounded-sm font-medium hover:bg-gray-100 transition-all duration-300 hover:scale-105 text-xs sm:text-sm"
            >
              {t('common.donateNow')}
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className={`transition-all duration-500 ${scrolled ? 'bg-white shadow-lg' : 'bg-white shadow-md'}`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-16">
          <div className="flex justify-between items-center h-11 sm:h-14">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 sm:space-x-3 group">
              <div className="relative overflow-hidden rounded-full border-2 border-redVar">
                <img
                  src="/logo.jpg"
                  alt="Church Logo"
                  className="h-7 w-7 sm:h-8 sm:w-8 object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <span className="text-xs sm:text-sm font-semibold tracking-wide group-hover:text-redVar transition-colors duration-300 hidden xs:block">ERC Kimisagara Parish</span>
              <span className="text-xs sm:text-sm font-semibold tracking-wide group-hover:text-redVar transition-colors duration-300 xs:hidden">ERC</span>
            </Link>

            {/* Desktop Menu - Hidden on mobile */}
            <div className="hidden lg:flex items-center space-x-5">
              <ul className="flex space-x-5 font-medium text-sm">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <li key={item.key} className="relative">
                      <Link
                        to={item.path}
                        className={`relative py-2 transition-all duration-300 ${
                          isActive 
                            ? "text-redVar font-semibold" 
                            : "text-gray-700 hover:text-redVar"
                        }`}
                      >
                        <span className="relative z-10">{t(item.key)}</span>
                        {isActive && (
                          <span className="absolute bottom-0 left-0 w-full h-0.5 bg-redVar animate-gentle-scale"></span>
                        )}
                        <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-redVar scale-x-0 transition-transform duration-300 hover:scale-x-100 ${!isActive ? 'origin-left' : ''}`}></span>
                      </Link>
                    </li>
                  );
                })}
              </ul>

              {/* Language Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setLangDropdownOpen(!isLangDropdownOpen)}
                  className="flex items-center gap-1 px-2 py-1.5 text-sm bg-transparent text-gray-700 rounded-sm font-medium hover:bg-gray-50 transition"
                >
                  {currentLang.short}
                  <span className={`transform transition-transform duration-300 text-[8px] ${isLangDropdownOpen ? "rotate-180" : ""}`}>▼</span>
                </button>

                {isLangDropdownOpen && (
                  <ul className="absolute right-0 mt-1 w-32 bg-white text-gray-800 rounded-sm shadow-lg py-1 z-50 animate-gentle-fade">
                    {languages.map((lang) => (
                      <li key={lang.code}>
                        <button
                          onClick={() => changeLanguage(lang.code)}
                          className={`block w-full text-left px-3 py-1.5 text-sm hover:bg-gray-50 transition-colors duration-200 ${
                            i18n.language === lang.code ? 'text-redVar font-semibold' : ''
                          }`}
                        >
                          {lang.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsSearchModalOpen(true)}
                  className="p-2 text-gray-500 hover:text-redVar transition-all duration-300 hover:scale-110 rounded-sm text-sm"
                  aria-label="Search"
                >
                  Search
                </button>

                <a
                  href="https://youtube.com/@evangelicalrestorationchur8955?si=6JDx78yxCpZHmSqb"
                  target="_blank"
                  rel="noreferrer"
                  className="bg-redVar text-white rounded-sm py-1.5 px-4 text-sm font-medium hover:bg-red-700 transition-all duration-300 hover:shadow-lg"
                >
                  Live
                </a>

                <button
                  onClick={() => setRegisterModalOpen(true)}
                  className="bg-transparent text-redVar border border-redVar rounded-sm py-1.5 px-4 text-sm font-medium hover:bg-redVar hover:text-white transition-all duration-300"
                >
                  {t('common.register')}
                </button>
              </div>
            </div>

            {/* Tablet Menu - Medium screens */}
            <div className="hidden md:flex lg:hidden items-center space-x-3">
              <ul className="flex space-x-3 font-medium text-xs">
                {navItems.slice(0, 4).map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <li key={item.key}>
                      <Link
                        to={item.path}
                        className={`transition-all duration-300 ${
                          isActive ? "text-redVar font-semibold" : "text-gray-700 hover:text-redVar"
                        }`}
                      >
                        {t(item.key)}
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <button
                onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
                className="text-redVar p-2 rounded-sm focus:outline-none"
              >
                {isMobileMenuOpen ? <span className="text-xl font-light">✕</span> : <span className="text-xl">☰</span>}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden items-center gap-1">
              <a
                href="https://youtube.com/@evangelicalrestorationchur8955?si=6JDx78yxCpZHmSqb"
                target="_blank"
                rel="noreferrer"
                className="bg-redVar text-white rounded-sm py-1 px-2 text-[10px] font-medium hover:bg-red-700 transition mr-1"
              >
                Live
              </a>
              <button
                onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
                className="text-redVar p-2 rounded-sm focus:outline-none"
              >
                {isMobileMenuOpen ? <span className="text-xl font-light">✕</span> : <span className="text-xl">☰</span>}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t animate-gentle-fade">
            <ul className="flex flex-col space-y-0 py-2 px-3 sm:px-6 font-medium text-sm">
              {navItems.map((item) => {
                return (
                  <li key={item.key} className="border-b border-gray-100">
                    <Link
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block py-2.5 transition-colors duration-200 ${
                        location.pathname === item.path
                          ? "text-redVar font-semibold"
                          : "text-gray-700 hover:text-redVar"
                      }`}
                    >
                      {t(item.key)}
                    </Link>
                  </li>
                );
              })}

              <li className="pt-3 mt-1">
                <Link
                  to="/donate"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2.5 text-redVar font-semibold hover:underline"
                >
                  {t('common.donateNow')}
                </Link>
              </li>
              <li>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setRegisterModalOpen(true);
                  }}
                  className="w-full text-left py-2.5 text-redVar font-semibold"
                >
                  {t('common.register')}
                </button>
              </li>

              <li className="mt-2 pt-2 border-t border-gray-100">
                <label className="block text-[10px] font-medium mb-1.5 text-gray-500 uppercase tracking-wide">
                  {t('common.language')}
                </label>
                <select
                  className="w-full border border-gray-200 rounded-sm px-3 py-2 text-sm"
                  value={i18n.language}
                  onChange={(e) => changeLanguage(e.target.value)}
                >
                  {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </li>
            </ul>
          </div>
        )}
      </nav>

      {/* Registration Modal */}
      <RegistrationModal
        isOpen={isRegisterModalOpen}
        onClose={() => setRegisterModalOpen(false)}
      />

      {/* Global Search Modal */}
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
      />

      {/* Verification Modal */}
      <VerificationModal
        isOpen={isVerificationModalOpen}
        onClose={() => setVerificationModalOpen(false)}
        email={verificationEmail}
        type={verificationType}
        onSuccess={() => {
          window.location.href = '/dashboard';
        }}
      />
    </header>
  );
};

export default Navbar;
