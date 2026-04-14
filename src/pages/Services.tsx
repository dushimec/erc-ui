import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import MarriageRequestForm from '../components/forms/MarriageRequestForm';
import BaptismRequestForm from '../components/forms/BaptismRequestForm';
import YouthForm from '../components/forms/YouthForm';
import CellRecommendationForm from '../components/forms/CellRecommendationForm';
import ChurchRecommendationForm from '../components/forms/ChurchRecommendationForm';
import BaptismCertificationForm from '../components/forms/BaptismCertificationForm';
import MarriageCertificateForm from '../components/forms/MarriageCertificateForm';
import WeddingRequestForm from '../components/forms/WeddingRequestForm';
import ChildDedicationForm from '../components/forms/ChildDedicationForm';
import PrayerRequestForm from '../components/forms/PrayerRequestForm';
import AppointmentForm from '../components/forms/AppointmentForm';

const Services: React.FC = () => {
  const { t } = useTranslation();
  const [activeForm, setActiveForm] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['certifications', 'church-forms', 'certificates', 'pastoral-requests'];
      const newVisible: { [key: string]: boolean } = {};
      sections.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top < window.innerHeight * 0.8) {
            newVisible[id] = true;
          }
        }
      });
      setIsVisible(newVisible);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const certificationServices = [
    {
      title: t('services.marriageRequest'),
      description: t('services.marriageRequestDesc'),
      symbol: '♥',
      formType: 'marriage-request',
    },
    {
      title: t('services.baptismRequest'),
      description: t('services.baptismRequestDesc'),
      symbol: '✟',
      formType: 'baptism-request',
    },
  ];

  const churchForms = [
    {
      title: t('services.youthForm'),
      description: t('services.youthFormDesc'),
      symbol: '✦',
      formType: 'youth-form',
    },
    {
      title: t('services.cellRecommendation'),
      description: t('services.cellRecommendationDesc'),
      symbol: '∘',
      formType: 'cell-recommendation',
    },
    {
      title: t('services.churchRecommendation'),
      description: t('services.churchRecommendationDesc'),
      symbol: '◎',
      formType: 'church-recommendation',
    },
  ];

  const certificatesAndRequests = [
    {
      title: t('services.baptismCertificate'),
      description: t('services.baptismCertificateDesc'),
      symbol: '✧',
      formType: 'baptism-certification',
    },
    {
      title: t('services.marriageCertificate'),
      description: t('services.marriageCertificateDesc'),
      symbol: '❤',
      formType: 'marriage-certificate',
    },
    {
      title: t('services.weddingService'),
      description: t('services.weddingServiceDesc'),
      symbol: '♦',
      formType: 'wedding-request',
    },
    {
      title: t('services.childDedication'),
      description: t('services.childDedicationDesc'),
      symbol: '☀',
      formType: 'child-dedication',
    },
  ];

  const pastoralRequests = [
    {
      title: t('services.prayerRequest'),
      description: t('services.prayerRequestDesc'),
      symbol: '✝',
      formType: 'prayer-request',
    },
    {
      title: t('services.pastoralAppointment'),
      description: t('services.pastoralAppointmentDesc'),
      symbol: '☎',
      formType: 'appointment-request',
    },
  ];

  const openForm = (formType: string) => {
    setActiveForm(formType);
  };

  const closeForm = () => {
    setActiveForm(null);
  };

  return (
    <div className="mt-28 sm:mt-32">
      {/* Certification Requests Section */}
      <section id="certifications" className="py-12 sm:py-16 bg-gray-50">
        <div className="max-w-screen-xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className={`text-center mb-10 sm:mb-12 transition-all duration-700 ${isVisible['certifications'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
              {t('services.certificationRequests')}
            </h2>
            <div className="w-12 sm:w-16 h-1 bg-redVar mx-auto mt-3 sm:mt-4 rounded-full"></div>
            <p className="mt-3 sm:mt-4 text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
              {t('services.certificationRequestsDesc')}
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {certificationServices.map((service, idx) => (
              <div
                key={idx}
                className={`bg-white rounded-sm shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-1 p-6 sm:p-8 text-center flex flex-col items-center h-full animate-gentle-fade`}
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full bg-red-50 mb-4 sm:mb-6">
                  <span className="text-redVar text-xl sm:text-2xl">{service.symbol}</span>
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-5 sm:mb-6 leading-relaxed flex-1 text-sm">{service.description}</p>
                <button
                  onClick={() => openForm(service.formType)}
                  className="inline-block px-5 sm:px-6 py-2 sm:py-2.5 bg-redVar text-white rounded-sm shadow hover:bg-red-700 transition-all duration-300 hover:scale-[1.02] mt-auto text-sm"
                >
                  {t('common.submit')}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Church Forms Section */}
      <section id="church-forms" className="py-12 sm:py-16 bg-white">
        <div className="max-w-screen-xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className={`text-center mb-10 sm:mb-12 transition-all duration-700 ${isVisible['church-forms'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
              {t('services.churchForms')}
            </h2>
            <div className="w-12 sm:w-16 h-1 bg-redVar mx-auto mt-3 sm:mt-4 rounded-full"></div>
            <p className="mt-3 sm:mt-4 text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
              {t('services.churchFormsDesc')}
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {churchForms.map((form, idx) => (
              <div
                key={idx}
                className={`bg-gray-50 rounded-sm shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-1 p-5 sm:p-6 flex flex-col items-center text-center h-full animate-gentle-fade`}
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-red-50 mb-3 sm:mb-4">
                  <span className="text-redVar text-lg sm:text-xl">{form.symbol}</span>
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                  {form.title}
                </h3>
                <p className="text-gray-600 mb-4 sm:mb-5 leading-relaxed flex-1 text-sm">{form.description}</p>
                <button
                  onClick={() => openForm(form.formType)}
                  className="inline-block px-5 sm:px-6 py-2 sm:py-2.5 bg-redVar text-white rounded-sm shadow hover:bg-red-700 transition-all duration-300 hover:scale-[1.02] mt-auto text-sm"
                >
                  {t('services.fillForm')}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certificates and Requests Section */}
      <section id="certificates" className="py-12 sm:py-16 bg-gray-50">
        <div className="max-w-screen-xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className={`text-center mb-10 sm:mb-12 transition-all duration-700 ${isVisible['certificates'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
              {t('services.certificatesAndRequests')}
            </h2>
            <div className="w-12 sm:w-16 h-1 bg-redVar mx-auto mt-3 sm:mt-4 rounded-full"></div>
            <p className="mt-3 sm:mt-4 text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
              {t('services.certificatesAndRequestsDesc')}
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {certificatesAndRequests.map((item, idx) => (
              <div
                key={idx}
                className={`bg-white rounded-sm shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-1 p-5 sm:p-6 flex flex-col items-center text-center h-full animate-gentle-fade`}
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-red-50 mb-3 sm:mb-4">
                  <span className="text-redVar text-lg sm:text-xl">{item.symbol}</span>
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 mb-4 sm:mb-5 leading-relaxed flex-1 text-sm">{item.description}</p>
                <button
                  onClick={() => openForm(item.formType)}
                  className="inline-block px-5 sm:px-6 py-2 sm:py-2.5 bg-redVar text-white rounded-sm shadow hover:bg-red-700 transition-all duration-300 hover:scale-[1.02] mt-auto text-sm"
                >
                  {t('common.requestNow')}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pastoral Requests Section */}
      <section id="pastoral-requests" className="py-12 sm:py-16 bg-white">
        <div className="max-w-screen-xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className={`text-center mb-10 sm:mb-12 transition-all duration-700 ${isVisible['pastoral-requests'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
              {t('services.pastoralRequests')}
            </h2>
            <div className="w-12 sm:w-16 h-1 bg-redVar mx-auto mt-3 sm:mt-4 rounded-full"></div>
            <p className="mt-3 sm:mt-4 text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
              {t('services.pastoralRequestsDesc')}
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {pastoralRequests.map((item, idx) => (
              <div
                key={idx}
                className={`bg-gray-50 rounded-sm shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-1 p-6 sm:p-8 text-center flex flex-col items-center h-full animate-gentle-fade`}
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full bg-red-50 mb-4 sm:mb-6">
                  <span className="text-redVar text-xl sm:text-2xl">{item.symbol}</span>
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600 mb-5 sm:mb-6 leading-relaxed flex-1 text-sm">{item.description}</p>
                <button
                  onClick={() => openForm(item.formType)}
                  className="inline-block px-5 sm:px-6 py-2 sm:py-2.5 bg-redVar text-white rounded-sm shadow hover:bg-red-700 transition-all duration-300 hover:scale-[1.02] mt-auto text-sm"
                >
                  {item.formType === 'prayer-request' ? t('services.submitPrayer') : t('services.scheduleNow')}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form Modals */}
      <MarriageRequestForm isOpen={activeForm === 'marriage-request'} onClose={closeForm} />
      <BaptismRequestForm isOpen={activeForm === 'baptism-request'} onClose={closeForm} />
      <YouthForm isOpen={activeForm === 'youth-form'} onClose={closeForm} />
      <CellRecommendationForm isOpen={activeForm === 'cell-recommendation'} onClose={closeForm} />
      <ChurchRecommendationForm isOpen={activeForm === 'church-recommendation'} onClose={closeForm} />
      <BaptismCertificationForm isOpen={activeForm === 'baptism-certification'} onClose={closeForm} />
      <MarriageCertificateForm isOpen={activeForm === 'marriage-certificate'} onClose={closeForm} />
      <WeddingRequestForm isOpen={activeForm === 'wedding-request'} onClose={closeForm} />
      <ChildDedicationForm isOpen={activeForm === 'child-dedication'} onClose={closeForm} />
      <PrayerRequestForm isOpen={activeForm === 'prayer-request'} onClose={closeForm} />
      <AppointmentForm isOpen={activeForm === 'appointment-request'} onClose={closeForm} />
    </div>
  );
};

export default Services;
