
import React, { useEffect, useState } from 'react';
import { Video } from '../types';
import { fetchUserReels } from '../services/geminiService';
import { Loader2, Heart, MessageCircle, Share2, MoreVertical, Music2, UserPlus } from 'lucide-react';

const ReelItem: React.FC<{ reel: Video }> = ({ reel }) => {
  const [liked, setLiked] = useState(false);

  return (
    <div className="relative w-full h-[calc(100vh-112px)] snap-start bg-black flex flex-col justify-end overflow-hidden">
      {/* Video Content Placeholder */}
      <img 
        src={reel.thumbnail} 
        className="absolute inset-0 w-full h-full object-cover opacity-80" 
        alt="" 
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80" />

      {/* Side Actions */}
      <div className="absolute right-4 bottom-24 flex flex-col items-center gap-6 z-10">
        <div className="flex flex-col items-center gap-1 group">
          <button 
            onClick={() => setLiked(!liked)}
            className={`p-3 rounded-full bg-white/10 backdrop-blur-md transition-all active:scale-75 ${liked ? 'text-red-500' : 'text-white'}`}
          >
            <Heart size={28} fill={liked ? 'currentColor' : 'none'} />
          </button>
          <span className="text-[10px] font-bold text-white shadow-sm">{liked ? '1.3M' : '1.2M'}</span>
        </div>

        <div className="flex flex-col items-center gap-1">
          <button className="p-3 rounded-full bg-white/10 backdrop-blur-md text-white active:scale-75 transition-transform">
            <MessageCircle size={28} />
          </button>
          <span className="text-[10px] font-bold text-white shadow-sm">42K</span>
        </div>

        <div className="flex flex-col items-center gap-1">
          <button className="p-3 rounded-full bg-white/10 backdrop-blur-md text-white active:scale-75 transition-transform">
            <Share2 size={28} />
          </button>
          <span className="text-[10px] font-bold text-white shadow-sm">Share</span>
        </div>

        <button className="p-3 rounded-full bg-white/10 backdrop-blur-md text-white">
          <MoreVertical size={24} />
        </button>

        <div className="w-10 h-10 rounded-lg border-2 border-white overflow-hidden animate-pulse">
          <img src={reel.thumbnail} className="w-full h-full object-cover" alt="" />
        </div>
      </div>

      {/* Bottom Info */}
      <div className="p-4 relative z-10 w-full pr-20">
        <div className="flex items-center gap-3 mb-3">
          <div className="relative">
            <img src={reel.channelAvatar} className="w-9 h-9 rounded-full border border-white" alt="" />
            <button className="absolute -bottom-1 -right-1 bg-red-600 text-white rounded-full p-0.5 border border-black">
              <UserPlus size={10} />
            </button>
          </div>
          <span className="font-bold text-white text-sm">@{reel.channelName.toLowerCase()}</span>
          <button className="text-xs font-bold border border-white/40 px-3 py-1 rounded-md text-white hover:bg-white/10 transition-colors">
            Subscribe
          </button>
        </div>
        
        <p className="text-sm text-white line-clamp-2 mb-3 leading-snug">
          {reel.title} #gemini #viral #shorts #trending
        </p>

        <div className="flex items-center gap-2 bg-white/10 w-fit px-3 py-1.5 rounded-full backdrop-blur-sm">
          <Music2 size={14} className="text-white animate-spin-slow" style={{ animationDuration: '4s' }} />
          <span className="text-[10px] text-white font-medium truncate max-w-[120px]">
            Original Sound - {reel.channelName}
          </span>
        </div>
      </div>
    </div>
  );
};

const Reels: React.FC = () => {
  const [shorts, setShorts] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadShorts = async () => {
      setLoading(true);
      const data = await fetchUserReels("TrendingShorts");
      setShorts(data);
      setLoading(false);
    };
    loadShorts();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] gap-4 bg-black">
        <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-bold text-white tracking-widest uppercase">Loading Shorts</p>
      </div>
    );
  }

  return (
    <div className="w-full h-[calc(100vh-112px)] overflow-y-auto snap-y snap-mandatory no-scrollbar bg-black">
      {shorts.map((reel) => (
        <ReelItem key={reel.id} reel={reel} />
      ))}
    </div>
  );
};

export default Reels;
