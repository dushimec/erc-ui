import React from "react";
import { CalendarDays, Users, Book, Cross } from "lucide-react";

const Events: React.FC = () => {
  const events = [
    {
      title: "Crusade of Hope",
      date: "Sept 22, 2025",
      description: "Join us for a city-wide crusade filled with worship, prayer, and the Word of God.",
      icon: <Cross className="w-10 h-10 text-redVar" />,
      link: "#crusade",
      button: "Learn More",
    },
    {
      title: "Annual Church Convention",
      date: "Oct 10 - Oct 14, 2025",
      description: "Celebrate with us during our annual convention filled with preaching, teaching, and fellowship.",
      icon: <Users className="w-10 h-10 text-redVar" />,
      link: "#convention",
      button: "Register Now",
    },
    {
      title: "Bible Study",
      date: "Every Wednesday, 6:00 PM",
      description: "Join our weekly Bible study to grow deeper in God’s Word and fellowship with believers.",
      icon: <Book className="w-10 h-10 text-redVar" />,
      link: "#biblestudy",
      button: "Join Study",
    },
    {
      title: "Retreat & Conference",
      date: "Nov 3 - Nov 6, 2025",
      description: "A time to retreat, reflect, and be renewed in God’s presence through teaching and worship.",
      icon: <CalendarDays className="w-10 h-10 text-redVar" />,
      link: "#retreat",
      button: "Reserve Spot",
    },
  ];

  return (
    <section id="events" className="py-16 bg-white">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Events and Programs
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Stay connected with upcoming  conventions, and
            Bible studies. Mark your calendar and be part of what God is doing.
          </p>
        </div>

        {/* Events Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {events.map((event, idx) => (
            <div
              key={idx}
              className="bg-gray-50 rounded-2xl shadow-md hover:shadow-lg transition transform hover:-translate-y-1 p-6 flex flex-col items-center text-center"
            >
              <div className="mb-4">{event.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {event.title}
              </h3>
              <p className="text-sm text-redVar font-medium mb-3">
                {event.date}
              </p>
              <p className="text-gray-600 mb-5 leading-relaxed">{event.description}</p>
              <a
                href={event.link}
                className="inline-block px-5 py-2 bg-redVar text-white rounded-lg shadow hover:bg-red-700 transition"
              >
                {event.button}
              </a>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <a
            href="#calendar"
            className="inline-block px-8 py-3 bg-redVar text-white font-medium rounded-lg shadow hover:bg-red-700 transition"
          >
            View More
          </a>
        </div>
      </div>
    </section>
  );
};

export default Events;
