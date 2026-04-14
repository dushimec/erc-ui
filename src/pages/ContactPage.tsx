import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { contactApi } from "../api/contact";
import { websiteApi } from "../api/website";
import { toast } from "react-toastify";
import Skeleton from "../components/Skeleton";

const ContactPage: React.FC = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    location: "",
    message: "",
  });
  const [contactInfo, setContactInfo] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [expandMain, setExpandMain] = useState(false);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        setIsLoading(true);
        const res = await websiteApi.getContactInfo();
        if (res.success) setContactInfo(res.data);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInfo();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const truncateText = (text: string, limit: number, isExpanded: boolean, setter: (v: boolean) => void) => {
    if (!text) return null;
    if (text.length <= limit) return <span>{text}</span>;

    return (
      <>
        {isExpanded ? text : `${text.substring(0, limit)}...`}
        <button
          onClick={() => setter(!isExpanded)}
          className="ml-2 text-red-600 font-bold hover:underline focus:outline-none"
        >
          {isExpanded ? t('common.readLess') : t('common.readMore')}
        </button>
      </>
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const res = await contactApi.submitMessage(formData);
      if (res.success) {
        toast.success(t('contact.sentSuccess'));
        setFormData({ firstName: "", lastName: "", phone: "", location: "", message: "" });
      }
    } catch (error) {
      toast.error(t('contact.sentError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const mainDesc = contactInfo?.description || t('contact.churchDescription');

  return (
    <div className=" mt-32 md:mt-32 bg-white text-black min-h-screen flex items-center justify-center px-6 py-16">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Left Form Section */}
        <div>
          <h2 className="text-3xl font-bold mb-8">
            {isLoading ? <Skeleton width={200} height={36} /> : (contactInfo?.helpTitle || t('contact.howCanWeHelp'))}
          </h2>

          <form
            onSubmit={handleSubmit}
            className="space-y-6 bg-whiteVar p-6 rounded-xl shadow-xl border border-gray-100"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-2">{t('contact.firstName')}</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-md bg-white text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all font-secondary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-2">{t('contact.lastName')}</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-md bg-white text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all font-secondary"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-2">{t('common.phone')}</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-md bg-white text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all font-secondary"
                />
              </div>
              <div>
                <label className="block text-sm mb-2">{t('contact.location')}</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-md bg-white text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all font-secondary"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm mb-2">{t('common.message')}</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 rounded-md bg-white text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all font-secondary"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-red-600 hover:bg-red-700 text-white transition-colors px-4 py-2 rounded-md font-bold shadow-lg disabled:opacity-50"
            >
              {isSubmitting ? t('contact.sending') : t('contact.sendBtn')}
            </button>

            <p className="text-xs text-gray-500">
              {t('contact.privacyConsent')}
              <a href="#" className="text-red-600 hover:underline">
                {t('footer.privacyPolicy')}
              </a>
              .
            </p>
          </form>
        </div>

        {/* Right Section */}
        <div className="flex flex-col justify-center space-y-6 text-black">
          <div>
            <h3 className="text-red-600 font-bold text-xl uppercase tracking-wider">{t('contact.churchName')}</h3>
            <div className="mt-4 text-gray-700 leading-relaxed text-sm md:text-base">
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton variant="text" />
                  <Skeleton variant="text" />
                  <Skeleton variant="text" width="60%" />
                </div>
              ) : truncateText(mainDesc, 300, expandMain, setExpandMain)}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-xl border border-gray-100 transition-all hover:shadow-md">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-600 shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('contact.ourLocation')}</p>
                <div className="font-bold text-slate-900">
                  {isLoading ? <Skeleton width={150} height={20} /> : (contactInfo?.address || t('contact.defaultAddress'))}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-xl border border-gray-100 transition-all hover:shadow-md">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-600 shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('contact.phoneNumber')}</p>
                <div className="font-bold text-slate-900">
                  {isLoading ? <Skeleton width={120} height={20} /> : (contactInfo?.phone || t('contact.defaultPhone'))}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-xl border border-gray-100 transition-all hover:shadow-md">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-600 shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('contact.emailAddress')}</p>
                <div className="font-bold text-slate-900">
                  {isLoading ? <Skeleton width={180} height={20} /> : (contactInfo?.email || t('contact.defaultEmail'))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
