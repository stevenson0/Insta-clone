import React from 'react';
import { MoreVertical } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Video } from '../types';

const VideoCard: React.FC<{ video: Video, compact?: boolean }> = ({ video, compact }) => {
  if (compact) {
    return (
      <Link to={`/watch/${video.id}`} className="flex gap-2 group">
        <div className="relative w-40 h-24 flex-shrink-0">
          <img 
            src={video.thumbnail} 
            alt={video.title} 
            className="w-full h-full object-cover rounded-xl" 
          />
          <div className="absolute bottom-1 right-1 bg-black bg-opacity-80 text-white text-[10px] px-1 font-bold rounded">
            {video.duration || '10:00'}
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-1">
          <h3 className="text-sm font-bold line-clamp-2 leading-tight dark:group-hover:text-blue-400 group-hover:text-blue-600 transition-colors">
            {video.title}
          </h3>
          <p className="text-[#606060] dark:text-[#aaaaaa] text-xs hover:text-[#0f0f0f] dark:hover:text-white transition-colors">{video.channelName}</p>
          <div className="text-[#606060] dark:text-[#aaaaaa] text-[10px] flex items-center gap-1">
            <span>{video.views}</span>
            <span>•</span>
            <span>{video.postedAt}</span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <div className="flex flex-col gap-3 group">
      <Link to={`/watch/${video.id}`} className="relative aspect-video overflow-hidden rounded-xl bg-[#f2f2f2] dark:bg-[#1a1a1a]">
        <img 
          src={video.thumbnail} 
          alt={video.title} 
          className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105" 
        />
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-1 font-bold rounded">
          {video.duration || '12:45'}
        </div>
      </Link>
      
      <div className="flex gap-3 pr-2">
        <Link to="#" className="flex-shrink-0">
          <img src={video.channelAvatar} className="w-9 h-9 rounded-full" alt={video.channelName} />
        </Link>
        <div className="flex flex-col flex-1 gap-1 min-w-0">
          <Link to={`/watch/${video.id}`}>
            <h3 className="text-sm font-bold line-clamp-2 leading-5 text-[#0f0f0f] dark:text-white">
              {video.title}
            </h3>
          </Link>
          <div className="flex flex-col text-sm text-[#606060] dark:text-[#aaaaaa]">
            <Link to="#" className="hover:text-[#0f0f0f] dark:hover:text-white transition-colors truncate">{video.channelName}</Link>
            <div className="flex items-center gap-1">
              <span>{video.views}</span>
              <span className="text-[10px]">•</span>
              <span>{video.postedAt}</span>
            </div>
          </div>
        </div>
        <button className="self-start p-1 hover:bg-[#f2f2f2] dark:hover:bg-[#272727] rounded-full transition-colors">
          <MoreVertical size={16} />
        </button>
      </div>
    </div>
  );
};

export default VideoCard;
