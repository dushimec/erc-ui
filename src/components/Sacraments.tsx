import React from "react";
import { Droplet, CupSoda, BookOpen } from "lucide-react";

const Sacraments: React.FC = () => {
  const sacraments = [
    {
      title: "Baptism",
      description:
        "Register for baptism and learn about the significance of this sacred ordinance in the Christian faith.",
      icon: <Droplet className="w-10 h-10 text-red-600" />,
      link: "#baptism",
      button: "Register Now",
    },
    {
      title: "Holy Communion",
      description:
        "Stay updated with our Holy Communion schedule and prepare your heart for this meaningful fellowship.",
      icon: <CupSoda className="w-10 h-10 text-red-600" />,
      link: "#communion",
      button: "View Schedule",
    },
    {
      title: "Confirmation / Catechism",
      description:
        "Enroll in catechism classes and confirmation to deepen your understanding of the faith.",
      icon: <BookOpen className="w-10 h-10 text-red-600" />,
      link: "#catechism",
      button: "Join Classes",
    },
  ];

  return (
    <section id="sacraments" className="py-16 max-w-7xl mx-auto bg-gray-50">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Sacraments
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Participate in the holy sacraments as part of your spiritual growth
            and journey with Christ.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-8 md:grid-cols-3">
          {sacraments.map((sacrament, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl shadow-md hover:shadow-lg transition transform hover:-translate-y-1 p-8 text-center flex flex-col items-center"
            >
              <div className="mb-6">{sacrament.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {sacrament.title}
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">{sacrament.description}</p>
              <a
                href={sacrament.link}
                className="inline-block px-5 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition"
              >
                {sacrament.button}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Sacraments;
