import React from "react";
import { WhoWeAre, Vision, Mission, History, StartUp, Community } from "./Data.tsx";
import type { CommunityItem } from "./Data.tsx"; // 👈 import type for safety

const About: React.FC = () => {
  return (
    <div className="flex flex-col w-full max-w-7xl sm:w-full lg:gap-16">
      {/* WHO ARE WE */}
      <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-2">
        <div>
          <img
            src="/church.jpg"
            alt="Church Photo"
            className="rounded-md"
          />
        </div>
        <div className="flex flex-col py-2 gap-2 lg:gap-2 lg:py-24">
          <h1 className="text-lg whitespace-nowrap font-bold text-red-700 text-left lg:px-4 lg:text-3xl">
            WHO ARE WE?
          </h1>
          <p className="sm:text-lg leading-relaxed lg:px-4 py-2 md:text-lg text-left lg:py-2">
            {WhoWeAre.content}
          </p>
        </div>
      </div>

      {/* Vision / Mission / History */}
      <div className="grid sm:grid-cols-1 gap-1 md:grid-cols-2 lg:grid-cols-3 lg:gap-4">
        <div className="bg-gray-200 bg-opacity-50 rounded-lg">
          <h1 className="text-xl whitespace-nowrap font-bold text-left px-4 text-red-700 mt-2">
            Vision
          </h1>
          <p className="sm:text-lg leading-relaxed px-4 py-2 md:text-lg text-start lg:py-2">
            {Vision.Content}
          </p>
        </div>

        <div className="bg-gray-200 bg-opacity-50 rounded-lg">
          <h1 className="text-xl whitespace-nowrap font-bold text-left text-red-700 px-4">
            Mission
          </h1>
          <p className="sm:text-lg leading-relaxed px-4 py-2 md:text-lg text-start lg:py-2">
            {Mission.Content}
          </p>
        </div>

        <div className="bg-gray-200 bg-opacity-50 rounded-lg">
          <h1 className="text-xl whitespace-nowrap font-bold text-left px-4 text-red-700">
            History
          </h1>
          <p className="sm:text-lg leading-relaxed px-4 py-2 md:text-lg text-left lg:py-2">
            {History.Content}
          </p>
        </div>
      </div>

      {/* Start Up & Community */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div className="grid grid-cols-1 w-full">
          <h1 className="text-lg whitespace-nowrap font-bold text-red-700 text-left px-4 md:text-3xl lg:text-3xl sm:mt-5">
            Start Up
          </h1>
          <p className="sm:text-lg leading-relaxed px-4 py-2 md:text-lg text-left lg:py-2">
            {StartUp.content}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 mt-5 gap-4">
            {Community.Data.map((data: CommunityItem) => (
              <div key={data.id}>
                <h1 className="text-xl whitespace-nowrap font-bold text-left text-red-700 px-4">
                  {data.total}+
                </h1>
                <p className="sm:text-lg leading-relaxed text-justify px-4 py-2 md:text-lg text-left lg:py-2 whitespace-nowrap">
                  {data.title} {data.content}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full">
          <img
            src="/community.jpg"
            alt="Community"
            className="w-full h-full object-cover rounded-md"
          />
        </div>
      </div>
    </div>
  );
};

export default About;
