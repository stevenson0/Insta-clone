import React, { useState } from 'react';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Sparkles } from 'lucide-react';
import { Post, PostInsights } from '../types';
import { getPostInsights } from '../services/geminiService';
import { Link } from 'react-router-dom';

const PostCard: React.FC<{ post: Post }> = ({ post }) => {
  const [liked, setLiked] = useState(false);
  const [insights, setInsights] = useState<PostInsights | null>(null);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [showCopiedToast, setShowCopiedToast] = useState(false);

  const fetchInsights = async () => {
    if (insights) return;
    setLoadingInsights(true);
    const res = await getPostInsights(post);
    setInsights(res);
    setLoadingInsights(false);
  };

  const handleShare = () => {
    // Construct sharing URL for a post
    const shareUrl = `${window.location.origin}/#/profile/${post.username}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setShowCopiedToast(true);
      setTimeout(() => setShowCopiedToast(false), 2000);
    });
  };

  return (
    <div className="bg-white dark:bg-black w-full transition-colors pb-4 relative">
      {/* Header */}
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${post.username}`} className="p-[1.5px] rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600">
            <div className="p-[1.5px] bg-white dark:bg-black rounded-full">
              <img src={post.userAvatar} className="w-8 h-8 rounded-full object-cover" alt="" />
            </div>
          </Link>
          <div className="flex flex-col">
            <Link to={`/profile/${post.username}`} className="text-sm font-bold text-[#0f0f0f] dark:text-white cursor-pointer active:opacity-60">{post.username}</Link>
            <span className="text-[10px] text-[#606060] dark:text-[#aaaaaa] leading-none">{post.location}</span>
          </div>
        </div>
        <MoreHorizontal size={18} className="cursor-pointer" />
      </div>

      {/* Media */}
      <div className="aspect-square bg-[#f2f2f2] dark:bg-[#121212] overflow-hidden" onDoubleClick={() => setLiked(true)}>
        <img src={post.mediaUrl} className="w-full h-full object-cover" alt="" />
      </div>

      {/* Actions */}
      <div className="px-3 pt-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <Heart 
              size={26} 
              className={`cursor-pointer transition-transform ${liked ? 'fill-red-500 text-red-500 scale-110' : 'hover:opacity-60 active:scale-90'}`}
              onClick={() => setLiked(!liked)} 
            />
            <MessageCircle size={26} className="cursor-pointer hover:opacity-60 active:scale-90" />
            <div className="relative">
              <Send 
                size={26} 
                className="cursor-pointer hover:opacity-60 active:scale-90" 
                onClick={handleShare}
              />
              {showCopiedToast && (
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black dark:bg-white text-white dark:text-black text-[10px] font-bold px-2 py-1 rounded-md whitespace-nowrap shadow-xl animate-in fade-in zoom-in duration-200">
                  Link Copied!
                </div>
              )}
            </div>
          </div>
          <Bookmark size={26} className="cursor-pointer hover:opacity-60 active:scale-90" />
        </div>

        <span className="text-sm font-bold mb-1 block">{post.likes} likes</span>
        
        <div className="text-sm leading-tight">
          <Link to={`/profile/${post.username}`} className="font-bold mr-2 hover:opacity-80">{post.username}</Link>
          <span>{post.caption}</span>
        </div>

        {/* AI Insight Trigger */}
        <button 
          onClick={fetchInsights}
          className="mt-2 text-xs font-bold text-purple-500 flex items-center gap-1 hover:text-purple-600 active:scale-95 transition-transform"
        >
          <Sparkles size={12} />
          {loadingInsights ? 'AI is thinking...' : insights ? 'AI Vibe Check' : 'Gemini AI Insights'}
        </button>

        {insights && (
          <div className="mt-2 p-3 bg-[#f8f8f8] dark:bg-[#1a1a1a] rounded-lg text-xs border border-purple-500/10 animate-in fade-in slide-in-from-top-1">
            <p className="italic text-[#606060] dark:text-[#aaaaaa] mb-2 leading-relaxed">"{insights.vibe}"</p>
            <div className="flex flex-wrap gap-1.5">
              {insights.hashtags.map(tag => (
                <span key={tag} className="text-blue-500 font-medium">#{tag.replace('#','')}</span>
              ))}
            </div>
            <div className="mt-2 flex items-center justify-between border-t border-purple-500/10 pt-2">
              <span className="text-[10px] text-[#8e8e8e] uppercase font-bold tracking-widest">Viral Potential</span>
              <span className="font-bold text-purple-400">{insights.engagementPrediction}</span>
            </div>
          </div>
        )}

        <div className="mt-2 text-[#8e8e8e] text-[10px] uppercase tracking-wider font-medium">
          {post.timeAgo}
        </div>
      </div>
    </div>
  );
};

export default PostCard;
