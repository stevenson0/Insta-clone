
import React, { useEffect, useState } from 'react';
import { Video } from '../types';
import { searchVideos } from '../services/geminiService';
import VideoCard from '../components/VideoCard';
import { Loader2 } from 'lucide-react';

const Home: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  const filters = ['All', 'Music', 'Gaming', 'Live', 'News', 'Tech', 'Nature', 'Cooking'];

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await searchVideos(filter === 'All' ? "popular trending videos" : `popular ${filter} videos`);
      setVideos(data);
      setLoading(false);
    };
    loadData();
  }, [filter]);

  return (
    <div className="flex flex-col w-full">
      {/* Horizontal Filters */}
      <div className="flex gap-2 overflow-x-auto p-3 sticky top-14 bg-white/95 dark:bg-[#0f0f0f]/95 backdrop-blur-md z-20 no-scrollbar border-b border-[#efefef] dark:border-[#262626]">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              filter === f 
                ? 'bg-[#0f0f0f] dark:bg-white text-white dark:text-black' 
                : 'bg-[#f2f2f2] dark:bg-[#272727] text-[#0f0f0f] dark:text-white hover:bg-[#e5e5e5] dark:hover:bg-[#3f3f3f]'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
          <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-bold text-[#8e8e8e] tracking-widest uppercase">Fetching recommendations</p>
        </div>
      ) : (
        <div className="flex flex-col p-4 gap-8">
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      )}
      <div className="h-4" /> {/* Bottom spacer */}
    </div>
  );
};

export default Home;
