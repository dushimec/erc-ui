import React, { useState, useEffect } from "react";
import { sermonsApi } from "../api/sermons";
import type { Sermon } from "../types/api";

const SermonsGallery: React.FC = () => {
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    fetchSermons();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const element = document.getElementById('sermons-section');
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

  const fetchSermons = async () => {
    try {
      const response = await sermonsApi.getAllSermons();
      if (response.success) {
        setSermons(response.data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      }
    } catch (error) {
      console.error("Failed to fetch sermons:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getEmbedUrl = (url?: string) => {
    if (!url) return "";
    if (url.includes("youtube.com/embed/")) return url;
    if (url.includes("youtu.be/")) return `https://www.youtube.com/embed/${url.split("/").pop()}`;
    if (url.includes("youtube.com/watch?v=")) return `https://www.youtube.com/embed/${new URLSearchParams(new URL(url).search).get("v")}`;
    return url;
  };

  if (isLoading) {
    return (
      <section id="sermons-section" className="bg-white py-12 sm:py-16 px-3 sm:px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Latest Sermons</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="rounded-sm h-72 sm:h-80 bg-gray-50 animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="sermons-section" className="bg-white py-12 sm:py-16 px-3 sm:px-6">
      <div className="max-w-6xl mx-auto text-center">
        <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">Latest Sermons</h2>
          <div className="w-12 sm:w-16 h-1 bg-redVar mx-auto mb-4 rounded-full"></div>
          <p className="text-gray-600 mb-8 sm:mb-10 text-sm">
            Be encouraged and grow in your faith through our recent sermons.
          </p>
        </div>

        {/* Video Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sermons.length > 0 ? (
            (showAll ? sermons : sermons.slice(0, 8)).map((sermon, index) => (
              <div
                key={sermon.id}
                className={`rounded-sm overflow-hidden shadow-lg cursor-pointer hover:shadow-xl transition-all duration-500 hover:-translate-y-1 flex flex-col h-full bg-white animate-gentle-fade`}
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => setSelectedVideo(getEmbedUrl(sermon.videoUrl) || null)}
              >
                <div className="relative aspect-video bg-slate-900 flex items-center justify-center">
                  {sermon.videoUrl ? (
                    <iframe
                      className="w-full h-full pointer-events-none"
                      src={getEmbedUrl(sermon.videoUrl)}
                      title={sermon.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <div className="text-white text-sm font-medium px-3 text-center">No Video Preview</div>
                  )}
                  <div className="absolute inset-0 z-10"></div>
                </div>
                <div className="p-3 sm:p-4 text-left flex-grow">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 line-clamp-1">
                    {sermon.title}
                  </h3>
                  <p className="text-xs text-red-500 mt-1">
                    {new Date(sermon.date).toLocaleDateString()} · {(sermon as any).preacher?.firstName ? `${(sermon as any).preacher.firstName} ${(sermon as any).preacher.lastName}` : "Preacher"}
                  </p>
                  <p className="text-gray-600 mt-2 line-clamp-2 text-sm">{sermon.theme || "No summary available"}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-12 text-gray-400">
              No sermons available at the moment.
            </div>
          )}
        </div>

        {sermons.length > 8 && (
          <div className="mt-8 sm:mt-10">
            <button
              onClick={() => setShowAll(!showAll)}
              className="px-5 sm:px-6 py-2 sm:py-2.5 rounded-sm bg-red-600 text-white font-semibold shadow-md hover:bg-red-700 transition-all duration-300 hover:scale-105 text-sm"
            >
              {showAll ? "Show Less" : "Watch More Sermons"}
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm animate-gentle-fade p-3 sm:p-4">
          <div className="relative w-full max-w-3xl">
            <button
              className="absolute top-1 sm:top-2 right-1 sm:right-2 text-white text-2xl sm:text-3xl font-light hover:text-redVar transition-colors duration-300 z-10"
              onClick={() => setSelectedVideo(null)}
            >
              ×
            </button>
            <div className="aspect-video">
              <iframe
                className="w-full h-full"
                src={selectedVideo}
                title="Sermon Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default SermonsGallery;
