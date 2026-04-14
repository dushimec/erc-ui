import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { websiteApi } from '../api/website';
import { Mail, Phone } from 'lucide-react';
import Skeleton from '../components/Skeleton';

const AboutUs: React.FC = () => {
  const { t } = useTranslation();
  const [sections, setSections] = useState<any[]>([]);
  const [leadership, setLeadership] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [secRes, leadRes] = await Promise.all([
          websiteApi.getAboutSections(),
          websiteApi.getLeadership()
        ]);
        if (secRes.success) setSections(secRes.data || []);
        if (leadRes.success) setLeadership(leadRes.data || []);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const getSection = (type: string, defaultTitle: string, defaultContent: string) => {
    const s = sections.find(sec => sec.type === type);
    return {
      title: s?.title || defaultTitle,
      content: s?.content || defaultContent
    };
  };

  const whoWeAre = getSection('WHO_WE_ARE', t('about.whoWeAre'), t('about.whoWeAreDesc'));
  const mission = getSection('MISSION', t('about.ourMission'), t('about.missionText'));
  const vision = getSection('VISION', t('about.ourVision'), t('about.visionText'));
  const history = getSection('HISTORY', t('about.ourHistory'), t('about.historyText'));

  return (
    <div className="mt-40 bg-gray-50 text-black font-[Verdana] md:mt-20">
      {/* ... previous sections ... */}
      <section className="max-w-7xl mx-auto py-10 px-6 grid md:grid-cols-2 gap-10 items-center">
        <img
          src="/church.jpg"
          alt="Church"
          className="rounded-md w-full h-auto object-cover mx-auto shadow-md"
        />
        <div className="text-center md:text-left shadow-sm p-6 bg-white rounded-lg border border-gray-100">
          <h2 className="text-2xl font-bold mb-3 text-red-600 uppercase tracking-tight">
            {isLoading ? <Skeleton width={150} height={32} /> : t('about.whoWeAre')}
          </h2>
          <div className="text-gray-800 leading-relaxed text-sm">
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton variant="text" />
                <Skeleton variant="text" />
                <Skeleton variant="text" width="80%" />
              </div>
            ) : whoWeAre.content}
          </div>
        </div>
      </section>

      {/* ... mission etc ... */}
      <section className="md:py-8">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-6 text-center leading-relaxed">
          {isLoading ? (
            [1, 2, 3].map(i => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <Skeleton width={120} height={24} className="mx-auto mb-4" />
                <Skeleton variant="text" />
                <Skeleton variant="text" />
                <Skeleton variant="text" width="60%" className="mx-auto" />
              </div>
            ))
          ) : [
            { title: mission.title, text: mission.content },
            { title: vision.title, text: vision.content },
            { title: history.title, text: history.content },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md hover:border-red-100 transition duration-300"
            >
              <h3 className="text-lg font-bold mb-3 text-red-600 uppercase tracking-widest">{item.title}</h3>
              <p className="text-gray-700 text-sm leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Leadership */}
      <section className="max-w-7xl mx-auto py-16 px-6 text-center">
        <h2 className="text-xl font-bold mb-2 text-red-600 uppercase tracking-tight">{t('about.ourLeadership')}</h2>
        <div className="w-20 h-1 bg-red-600 mx-auto mb-12"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {isLoading ? (
            [1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100">
                <Skeleton variant="circular" width={128} height={128} className="mx-auto mb-4" />
                <Skeleton width={100} height={20} className="mx-auto mb-2" />
                <Skeleton width={80} height={16} className="mx-auto mb-4" />
                <div className="pt-4 border-t border-gray-50 space-y-2">
                  <Skeleton width="100%" height={12} />
                  <Skeleton width="100%" height={12} />
                </div>
              </div>
            ))
          ) : leadership.length > 0 ? leadership.map((leader, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100 hover:shadow-md transition duration-300 group">
              <div className="w-32 h-32 rounded-2xl bg-gray-100 mx-auto mb-4 overflow-hidden border-2 border-white shadow-lg group-hover:border-red-500/20 transition duration-300">
                <img
                  src={leader.imageUrl || "/passport.jpeg"}
                  alt={leader.name}
                  className="w-full h-full object-cover transition duration-500"
                />
              </div>
              <h4 className="font-bold text-gray-900 text-base uppercase tracking-tight">{leader.name}</h4>
              <p className="text-red-600 text-[10px] font-bold uppercase tracking-widest mt-1 mb-4">{leader.role}</p>

              <div className="space-y-2 pt-4 border-t border-gray-50">
                {leader.email && (
                  <div className="flex items-center justify-center text-gray-500 hover:text-red-600 transition-colors">
                    <Mail size={14} className="mr-2" />
                    <span className="text-sm font-medium truncate max-w-[180px]">{leader.email}</span>
                  </div>
                )}
                {leader.phone && (
                  <div className="flex items-center justify-center text-gray-500 hover:text-red-600 transition-colors">
                    <Phone size={14} className="mr-2" />
                    <span className="text-sm font-medium">{leader.phone}</span>
                  </div>
                )}
              </div>
            </div>
          )) : (
            <div className="col-span-full py-20 text-gray-400 italic">
              Loading our leadership team...
            </div>
          )}
        </div>
      </section>

      {/* Ministries */}
      <section className="bg-gray-100 py-10">
        <h2 className="text-2xl font-bold text-red-600 mb-8 text-center">{t('about.ourMinistries')}</h2>
        <div className="max-w-7xl mx-auto grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 px-6 text-center">
          {["Youth Ministry", "Choir", "Sunday School", "Women's Fellowship", "Men's Fellowship"].map((ministry, idx) => (
            <div
              key={idx}
              className="bg-white p-5 rounded-lg hover:bg-red-100 transition shadow-sm"
            >
              <h4 className="font-semibold text-black text-sm">{t(`about.ministries.${ministry.replace(/\s+/g, '').toLowerCase()}`)}</h4>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Links */}
      <section className="bg-gradient-to-r from-gray-50 to-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold text-black mb-2">{t('about.navigation')}</h2>
          <div className="w-16 h-1 bg-red-600 mx-auto mb-2"></div>
          <p className="text-gray-600 text-sm mb-6">{t('about.exploreWebsite')}</p>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { name: t('common.home'), link: "/" },
              { name: t('common.about'), link: "/about" },
              { name: t('about.ministries'), link: "/ministries" },
              { name: t('common.contact'), link: "/contact" },
            ].map((linkItem, idx) => (
              <a key={idx} href={linkItem.link} className="block">
                <div className="bg-white rounded-lg p-6 hover:bg-red-50 transition shadow-sm">
                  <h3 className="text-lg font-bold text-black mb-2">{linkItem.name}</h3>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Location & Service Times */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold mb-2 text-black">{t('about.visitUs')}</h2>
          <div className="w-16 h-1 bg-red-600 mx-auto mb-2"></div>
          <p className="text-gray-700 text-sm mb-6">{t('about.joinWorship')}</p>
          <div className="grid md:grid-cols-3 gap-6 justify-items-center">
            {[
              { title: t('about.ourLocation'), desc: ["Kimisagara", "Kigali, Rwanda"] },
              { title: t('about.sundayServices'), desc: ["9:00 AM", "11:00 AM"] },
              { title: t('about.bibleStudy'), desc: [t('common.wednesday'), "6:30 PM"] },
            ].map((item, idx) => (
              <div key={idx} className="bg-gray-800 p-6 rounded-lg text-center text-white w-full max-w-xs shadow-xl">
                <h3 className="text-lg font-bold text-red-600 mb-2">{item.title}</h3>
                {item.desc.map((line, i) => (
                  <p key={i} className="text-sm">{line}</p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold text-black mb-2">{t('about.getInTouch')}</h2>
          <div className="w-16 h-1 bg-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm mb-6 max-w-xl mx-auto">
            {t('about.contactMessage')}
          </p>
        </div>
      </section>

    </div>
  );
};

export default AboutUs;
