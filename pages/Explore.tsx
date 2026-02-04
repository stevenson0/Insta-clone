
import React, { useEffect, useState } from 'react';
import { Video } from '../types';
import { searchVideos } from '../services/geminiService';
import { Loader2, TrendingUp, Music2, Gamepad2, Trophy, Newspaper, Clapperboard, Flame } from 'lucide-react';
import VideoCard from '../components/VideoCard';

const Explore: React.FC = () => {
  const [trendingVideos, setTrendingVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    { name: 'Trending', icon: <Flame size={24} className="text-orange-500" /> },
    { name: 'Music', icon: <Music2 size={24} className="text-pink-500" /> },
    { name: 'Gaming', icon: <Gamepad2 size={24} className="text-purple-500" /> },
    { name: 'Sports', icon: <Trophy size={24} className="text-blue-500" /> },
    { name: 'News', icon: <Newspaper size={24} className="text-emerald-500" /> },
    { name: 'Movies', icon: <Clapperboard size={24} className="text-red-500" /> },
  ];

  useEffect(() => {
    const loadTrending = async () => {
      setLoading(true);
      const videos = await searchVideos("trending viral videos across all categories");
      setTrendingVideos(videos);
      setLoading(false);
    };
    loadTrending();
  }, []);

  return (
    <div className="flex flex-col w-full pb-10">
      {/* Categories Grid */}
      <div className="grid grid-cols-2 gap-3 p-4">
        {categories.map((cat) => (
          <button 
            key={cat.name}
            className="flex items-center gap-3 p-4 bg-[#f2f2f2] dark:bg-[#1a1a1a] rounded-xl hover:bg-[#e5e5e5] dark:hover:bg-[#272727] transition-all active:scale-95 text-left"
          >
            <div className="p-2 bg-white dark:bg-black rounded-lg shadow-sm">
              {cat.icon}
            </div>
            <span className="font-bold text-sm dark:text-white">{cat.name}</span>
          </button>
        ))}
      </div>

      <div className="px-4 py-2 border-t border-[#efefef] dark:border-[#262626] mt-2">
        <h2 className="text-lg font-bold flex items-center gap-2 py-4 dark:text-white">
          <TrendingUp className="text-red-500" /> Trending Videos
        </h2>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="animate-spin text-red-600" size={24} />
            <p className="text-xs text-[#8e8e8e]">Scanning the globe for trends...</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {trendingVideos.map((v) => (
              <VideoCard key={v.id} video={v} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;
