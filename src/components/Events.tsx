import React, { useEffect, useState } from "react";
import { communityApi } from "../api/community";
import type { Event } from "../types/api";

const UpcomingEvents: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const element = document.getElementById('events-section');
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

  const fetchEvents = async () => {
    try {
      const response = await communityApi.getAllEvents();
      if (response.success) {
        const upcoming = response.data
          .filter(e => new Date(e.date) >= new Date())
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
          .slice(0, 3);
        setEvents(upcoming);
      }
    } catch (error) {
      console.error("Failed to fetch events:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <section id="events-section" className="bg-gray-50 py-12 sm:py-16 px-3 sm:px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Upcoming Events</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-sm shadow-md h-80 sm:h-96 animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="events-section" className="bg-gray-50 py-12 sm:py-16 px-3 sm:px-6">
      <div className="max-w-6xl mx-auto text-center">
        <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">Upcoming Events</h2>
          <div className="w-12 sm:w-16 h-1 bg-redVar mx-auto mb-4 rounded-full"></div>
          <p className="text-gray-600 mb-8 sm:mb-10 text-sm">
            Stay connected and join us for worship, fellowship, and community events.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.length > 0 ? (
            events.map((event, index) => (
              <div
                key={event.id}
                className={`bg-white rounded-sm shadow-md overflow-hidden hover:shadow-xl transition-all duration-500 hover:-translate-y-1 h-full flex flex-col animate-gentle-fade`}
                style={{ animationDelay: `${(index + 1) * 100}ms` }}
              >
                <img src={event.imageUrl || "/logo.jpg"} alt={event.title} className="w-full h-36 sm:h-44 object-cover hover:scale-105 transition-transform duration-500" />

                <div className="p-4 sm:p-5 text-left flex flex-col flex-1">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 line-clamp-1">{event.title}</h3>
                  <p className="text-xs text-redVar font-medium mt-1">
                    {new Date(event.date).toLocaleDateString("en-US", {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                  <p className="text-gray-600 mt-2 sm:mt-3 leading-relaxed line-clamp-2 flex-1 text-sm">{event.description}</p>
                  <a
                    href="/events"
                    className="inline-block mt-3 sm:mt-4 text-white px-6 sm:px-8 py-1.5 sm:py-2 text-xs rounded-sm font-medium bg-redVar self-start text-center hover:bg-red-700 transition-all duration-300"
                  >
                    Learn More
                  </a>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-12 text-gray-400">
              No upcoming events at the moment.
            </div>
          )}
        </div>

        <div className="mt-10 sm:mt-12">
          <a
            href="/events"
            className="px-5 sm:px-6 py-2 sm:py-2.5 rounded-sm bg-redVar text-white font-semibold shadow-md hover:bg-red-700 transition-all duration-300 hover:scale-105 text-sm"
          >
            View All Events
          </a>
        </div>
      </div>
    </section>
  );
};

export default UpcomingEvents;
