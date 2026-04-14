import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { communityApi } from "../api/community";
import { servicesApi } from "../api/services";
import { toast } from "react-toastify";
import type { Service, Event } from "../types/api";
import Skeleton from "../components/Skeleton";

const EventCard: React.FC<{ event: any; index: number; onRegister: (e: any) => void }> = ({ event, index, onRegister }) => {
  const { t } = useTranslation();
  const date = event.startTime || event.date;
  return (
    <div 
      className="bg-white rounded-sm shadow-md overflow-hidden hover:shadow-xl transition-all duration-500 hover:-translate-y-1 flex flex-col h-full border border-gray-100 animate-gentle-fade"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="relative h-40 sm:h-48 overflow-hidden bg-gray-100">
        <img src={event.imageUrl || "/logo.jpg"} alt={event.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
      </div>

      <div className="p-4 sm:p-6 text-left flex flex-col flex-1">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 line-clamp-1">{event.title}</h3>
        <p className="text-xs sm:text-sm text-redVar font-medium mt-1">
          {new Date(date).toLocaleDateString("en-US", {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
        <div className="flex items-center gap-2 mt-2 text-gray-500 text-xs">
          <span className="text-redVar">◉</span>
          <span>{event.location}</span>
        </div>
        <p className="text-gray-600 mt-3 sm:mt-4 leading-relaxed line-clamp-3 text-sm flex-1">
          {event.description || t('events.defaultDescription')}
        </p>
        <button
          onClick={() => onRegister(event)}
          className="inline-block mt-4 sm:mt-6 text-white px-6 sm:px-8 py-2 text-xs rounded-sm font-medium bg-redVar hover:bg-red-700 transition-all duration-300 hover:scale-[1.02] self-start"
        >
          {t('common.readMore')}
        </button>
      </div>
    </div>
  );
};

const RegisterModal: React.FC<{ isOpen: boolean; onClose: () => void; event: any }> = ({ isOpen, onClose, event }) => {
  const { t } = useTranslation();
  if (!isOpen || !event) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-md rounded-sm shadow-2xl overflow-hidden animate-gentle-fade">
        <div className="p-5 sm:p-6">
          <button onClick={onClose} className="absolute top-3 sm:top-4 right-3 sm:right-4 p-2 bg-slate-50 rounded-sm text-slate-400 hover:text-slate-900 transition-colors text-xl font-light">
            ×
          </button>

          <div className="mb-5">
            <div className="w-10 h-10 bg-red-50 rounded-sm flex items-center justify-center mb-3">
              <span className="text-redVar text-xl">✦</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">{t('events.eventDetails')}</h2>
            <p className="text-sm text-slate-500 mt-1 font-medium">{t('events.joinUsFor')} <span className="text-redVar">{event.title}</span></p>
          </div>

          <div className="mb-5 bg-slate-50 p-4 rounded-sm max-h-40 overflow-y-auto">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{t('events.aboutThisEvent')}</h4>
            <p className="text-gray-700 text-sm leading-relaxed">{event.description || t('events.noDescription')}</p>
          </div>

          <div className="flex justify-end mt-5">
            <button
              onClick={onClose}
              className="px-5 py-2 bg-slate-100 text-slate-600 rounded-sm font-medium text-sm hover:bg-slate-200 transition"
            >
              {t('common.close')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const EventsPage: React.FC = () => {
  const { t } = useTranslation();
  const [fellowships, setFellowships] = useState<Service[]>([]);
  const [generalEvents, setGeneralEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVisible, setIsVisible] = useState({ fellowship: false, events: false });

  useEffect(() => {
    const handleScroll = () => {
      const fellowship = document.getElementById('fellowship-section');
      const events = document.getElementById('events-section');
      const newVisible = { ...isVisible };
      
      if (fellowship) {
        const rect = fellowship.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.8) newVisible.fellowship = true;
      }
      if (events) {
        const rect = events.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.8) newVisible.events = true;
      }
      setIsVisible(newVisible);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [fellowshipRes, eventRes] = await Promise.all([
          servicesApi.getAllServices(),
          communityApi.getAllEvents()
        ]);
        if (fellowshipRes.success) setFellowships(fellowshipRes.data);
        if (eventRes.success) setGeneralEvents(eventRes.data);
      } catch (error) {
        toast.error(t('events.loadFailed'));
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const renderSkeletons = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3].map(i => (
        <div key={i} className="bg-white rounded-sm shadow-md overflow-hidden p-0 h-[400px]">
          <Skeleton height={180} className="w-full" variant="rectangular" />
          <div className="p-5 space-y-3">
            <Skeleton variant="text" height={24} width="80%" />
            <Skeleton variant="text" height={18} width="60%" />
            <Skeleton variant="text" height={14} width="40%" />
            <div className="pt-3 space-y-2">
              <Skeleton variant="text" />
              <Skeleton variant="text" />
              <Skeleton variant="text" width="70%" />
            </div>
            <div className="pt-3">
              <Skeleton width={100} height={32} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[50vh] sm:h-[60vh] min-h-[300px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/resto1.jpg"
            alt="Events Hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60"></div>
        </div>

        <div className="absolute inset-0 z-20 flex flex-col justify-center text-center px-3 sm:px-6 pt-14">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4 sm:mb-6">
              {t('events.heroTitle')}
            </h1>
            <div className="w-16 sm:w-20 h-1 bg-redVar mx-auto mb-4 sm:mb-6 rounded-full"></div>
            <p className="text-white/90 max-w-2xl mx-auto font-medium text-sm sm:text-base leading-relaxed px-4">
              {t('events.heroSubtitle')}
            </p>
          </div>
        </div>
      </section>

      <div className="py-12 sm:py-16 px-3 sm:px-6 bg-gray-50 flex flex-col gap-12 sm:gap-16">

        {/* Fellowship Section */}
        <div id="fellowship-section" className="max-w-6xl mx-auto w-full">
          <div className={`text-center mb-8 sm:mb-10 transition-all duration-700 ${isVisible.fellowship ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
              {t('events.fellowshipEvents')}
            </h2>
            <div className="w-12 sm:w-16 h-1 bg-redVar mx-auto mt-3 sm:mt-4 rounded-full"></div>
          </div>
          {isLoading ? renderSkeletons() : fellowships.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {fellowships.map((f, idx) => (
                <EventCard key={f.id} event={f} index={idx} onRegister={(e) => { setSelectedEvent(e); setIsModalOpen(true); }} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-white rounded-sm border border-dashed border-gray-200">
              <p className="text-gray-500 text-sm">{t('events.noFellowshipEvents')}</p>
            </div>
          )}
        </div>

        {/* General Events Section */}
        <div id="events-section" className="max-w-6xl mx-auto w-full">
          <div className={`text-center mb-8 sm:mb-10 transition-all duration-700 ${isVisible.events ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
              {t('events.otherChurchEvents')}
            </h2>
            <div className="w-12 sm:w-16 h-1 bg-redVar mx-auto mt-3 sm:mt-4 rounded-full"></div>
          </div>
          {isLoading ? renderSkeletons() : generalEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {generalEvents.map((e, idx) => (
                <EventCard key={e.id} event={e} index={idx} onRegister={(ev) => { setSelectedEvent(ev); setIsModalOpen(true); }} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-white rounded-sm border border-dashed border-gray-200">
              <p className="text-gray-500 text-sm">{t('events.noOtherEvents')}</p>
            </div>
          )}
        </div>
      </div>

      {/* Registration Modal */}
      <RegisterModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        event={selectedEvent}
      />
    </div>
  );
};

export default EventsPage;
