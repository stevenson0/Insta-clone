
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Video, Comment, VideoInsights } from '../types';
import { getVideoComments, getVideoInsights, searchVideos } from '../services/geminiService';
import { ThumbsUp, ThumbsDown, Share2, Download, MoreHorizontal, Send, BrainCircuit, Sparkles, Loader2, ChevronDown, ChevronUp, Check } from 'lucide-react';
import VideoCard from '../components/VideoCard';

const CommentItem: React.FC<{ 
  comment: Comment, 
  isReply?: boolean,
  onReplyAdded?: (parentId: string, newReply: Comment) => void 
}> = ({ comment, isReply = false, onReplyAdded }) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [showReplies, setShowReplies] = useState(false);

  const handlePostReply = () => {
    if (!replyText.trim() || !onReplyAdded) return;
    
    const newReply: Comment = {
      id: `local-reply-${Date.now()}`,
      author: "Gemini User",
      avatar: "https://picsum.photos/seed/user/100/100",
      text: replyText,
      likes: "0",
      time: "Just now"
    };
    
    onReplyAdded(comment.id, newReply);
    setReplyText('');
    setIsReplying(false);
    setShowReplies(true);
  };

  return (
    <div className={`flex gap-4 ${isReply ? 'mt-2' : ''}`}>
      <img src={comment.avatar} className={`${isReply ? 'w-6 h-6' : 'w-10 h-10'} rounded-full flex-shrink-0`} alt="" />
      <div className="flex flex-col gap-1 flex-1">
        <div className="flex items-center gap-2 text-[#0f0f0f] dark:text-white">
          <span className={`${isReply ? 'text-xs' : 'text-sm'} font-bold`}>@{comment.author.toLowerCase().replace(/\s/g, '')}</span>
          <span className="text-xs text-[#606060] dark:text-[#aaaaaa]">{comment.time}</span>
        </div>
        <p className={`${isReply ? 'text-xs' : 'text-sm'} text-[#0f0f0f] dark:text-[#f1f1f1]`}>{comment.text}</p>
        
        <div className="flex items-center gap-4 mt-1">
          <button className="flex items-center gap-1.5 hover:bg-[#f2f2f2] dark:hover:bg-[#272727] p-1.5 rounded-full group transition-colors">
            <ThumbsUp size={isReply ? 14 : 16} className="group-hover:text-blue-600 dark:group-hover:text-blue-400" />
            <span className="text-xs text-[#606060] dark:text-[#aaaaaa]">{comment.likes}</span>
          </button>
          <button className="hover:bg-[#f2f2f2] dark:hover:bg-[#272727] p-1.5 rounded-full transition-colors">
            <ThumbsDown size={isReply ? 14 : 16} />
          </button>
          {!isReply && (
            <button 
              onClick={() => setIsReplying(!isReplying)}
              className="text-xs font-bold hover:bg-[#f2f2f2] dark:hover:bg-[#272727] px-3 py-1.5 rounded-full transition-colors"
            >
              Reply
            </button>
          )}
        </div>

        {isReplying && (
          <div className="mt-3 flex gap-3">
            <div className="w-8 h-8 bg-[#FF0000] rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-white">G</div>
            <div className="flex-1">
              <input 
                autoFocus
                type="text" 
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Add a reply..." 
                className="w-full bg-transparent border-b border-[#cccccc] dark:border-[#303030] focus:border-[#0f0f0f] dark:focus:border-white py-1 text-sm outline-none transition-colors"
              />
              <div className="flex justify-end gap-3 mt-2">
                <button 
                  onClick={() => setIsReplying(false)}
                  className="px-3 py-1.5 text-xs font-medium hover:bg-[#f2f2f2] dark:hover:bg-[#272727] rounded-full"
                >
                  Cancel
                </button>
                <button 
                  onClick={handlePostReply}
                  disabled={!replyText.trim()}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full ${replyText.trim() ? 'bg-blue-600 text-white' : 'bg-[#f2f2f2] dark:bg-[#3f3f3f] text-[#888888] cursor-not-allowed'}`}
                >
                  Reply
                </button>
              </div>
            </div>
          </div>
        )}

        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-1">
            <button 
              onClick={() => setShowReplies(!showReplies)}
              className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-sm font-bold hover:bg-blue-400/10 px-3 py-1.5 rounded-full transition-colors"
            >
              {showReplies ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
            </button>
            
            {showReplies && (
              <div className="mt-2 flex flex-col gap-4">
                {comment.replies.map((reply) => (
                  <CommentItem key={reply.id} comment={reply} isReply={true} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const Watch: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [video, setVideo] = useState<Video | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [insights, setInsights] = useState<VideoInsights | null>(null);
  const [relatedVideos, setRelatedVideos] = useState<Video[]>([]);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [showInsights, setShowInsights] = useState(true);
  const [showCopiedToast, setShowCopiedToast] = useState(false);

  useEffect(() => {
    const loadVideoData = async () => {
      if (!id) return;
      
      const results = await searchVideos(id);
      const currentVideo = results[0] || {
        id,
        title: "Mastering Gemini API with React and TypeScript",
        channelName: "DevMasters",
        channelAvatar: `https://picsum.photos/seed/${id}/100/100`,
        views: "250K views",
        postedAt: "1 day ago",
        description: "In this comprehensive guide, we explore how to integrate the latest Google Gemini API into your React applications. From real-time streaming to advanced grounding, we cover everything you need to build intelligent AI-powered UI components.",
        thumbnail: `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`,
      };
      
      setVideo(currentVideo);
      
      getVideoComments(currentVideo.title).then(setComments);
      searchVideos("related and trending programming videos").then(setRelatedVideos);
      
      setLoadingInsights(true);
      getVideoInsights(currentVideo).then(data => {
        setInsights(data);
        setLoadingInsights(false);
      });
    };

    loadVideoData();
    window.scrollTo(0, 0);
  }, [id]);

  const handleShare = () => {
    // FORCE HASH-BASED URL FOR SHARING TO PREVENT 404s
    const shareUrl = `${window.location.origin}/#/watch/${id}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setShowCopiedToast(true);
      setTimeout(() => setShowCopiedToast(false), 3000);
    });
  };

  const handleReplyAdded = (parentId: string, newReply: Comment) => {
    setComments(prev => prev.map(c => {
      if (c.id === parentId) {
        return {
          ...c,
          replies: [...(c.replies || []), newReply]
        };
      }
      return c;
    }));
  };

  if (!video) return <div className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-red-600" size={40} /></div>;

  return (
    <div className="px-0 lg:px-14 pt-0 lg:pt-4 flex flex-col lg:flex-row gap-6 relative">
      <div className="flex-1 max-w-[1280px]">
        {/* Video Player */}
        <div className="w-full aspect-video bg-black rounded-none lg:rounded-xl overflow-hidden shadow-2xl">
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${id}?autoplay=1`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </div>

        {/* Video Content */}
        <div className="px-4 lg:px-0">
          <h1 className="text-xl font-bold mt-4 leading-tight text-[#0f0f0f] dark:text-white line-clamp-2">{video.title}</h1>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-3 gap-4">
            <div className="flex items-center gap-3">
              <img src={video.channelAvatar} className="w-10 h-10 rounded-full" alt="" />
              <div className="flex flex-col min-w-0">
                <span className="font-bold text-base leading-none text-[#0f0f0f] dark:text-white truncate">{video.channelName}</span>
                <span className="text-[#606060] dark:text-[#aaaaaa] text-xs">1.2M subscribers</span>
              </div>
              <button className="ml-4 bg-[#0f0f0f] dark:bg-white text-white dark:text-black px-4 py-2 rounded-full font-medium text-sm hover:opacity-90 transition-all shrink-0">
                Subscribe
              </button>
            </div>
            
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
              <div className="flex bg-[#f2f2f2] dark:bg-[#272727] rounded-full transition-colors shrink-0">
                <button className="flex items-center gap-2 px-4 py-2 hover:bg-[#e5e5e5] dark:hover:bg-[#3f3f3f] rounded-l-full border-r border-[#e5e5e5] dark:border-[#3f3f3f]">
                  <ThumbsUp size={18} /> <span className="text-sm font-medium">4.2K</span>
                </button>
                <button className="px-4 py-2 hover:bg-[#e5e5e5] dark:hover:bg-[#3f3f3f] rounded-r-full">
                  <ThumbsDown size={18} />
                </button>
              </div>
              <button 
                onClick={handleShare}
                className="flex items-center gap-2 bg-[#f2f2f2] dark:bg-[#272727] px-4 py-2 hover:bg-[#e5e5e5] dark:hover:bg-[#3f3f3f] rounded-full transition-colors shrink-0"
              >
                <Share2 size={18} /> <span className="text-sm font-medium">Share</span>
              </button>
              <button className="flex items-center gap-2 bg-[#f2f2f2] dark:bg-[#272727] px-4 py-2 hover:bg-[#e5e5e5] dark:hover:bg-[#3f3f3f] rounded-full transition-colors shrink-0">
                <Download size={18} /> <span className="text-sm font-medium">Download</span>
              </button>
            </div>
          </div>

          <div className="mt-4 bg-[#f2f2f2] dark:bg-[#272727] rounded-xl p-4 border border-purple-500/20">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                <BrainCircuit size={20} />
                <span className="font-bold text-sm uppercase tracking-wider">AI Analysis</span>
              </div>
              <button onClick={() => setShowInsights(!showInsights)} className="text-[#606060] dark:text-[#aaaaaa] text-xs font-medium underline">
                {showInsights ? 'Hide' : 'Show'}
              </button>
            </div>
            {loadingInsights ? (
              <div className="flex items-center gap-3 py-2 text-[#606060] dark:text-[#aaaaaa]">
                <Loader2 className="animate-spin text-purple-500" size={16} />
                <span className="text-xs">Analyzing...</span>
              </div>
            ) : insights && showInsights ? (
              <div className="space-y-3">
                <p className="text-sm text-[#0f0f0f] dark:text-[#f1f1f1]">{insights.summary}</p>
                <div className="flex flex-wrap gap-2">
                  {insights.keyTakeaways.map((takeaway, i) => (
                    <span key={i} className="flex items-center gap-1.5 bg-white/50 dark:bg-black/20 px-3 py-1 rounded-full text-[10px] font-bold">
                      <Sparkles size={10} className="text-yellow-500" /> {takeaway}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <div className="mt-6 mb-20">
            <h3 className="text-lg font-bold mb-4">{comments.length} Comments</h3>
            <div className="flex flex-col gap-6">
              {comments.map((comment) => (
                <CommentItem key={comment.id} comment={comment} onReplyAdded={handleReplyAdded} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="lg:w-[400px] flex flex-col gap-4 px-4 lg:px-0 mb-10">
        {relatedVideos.map((v) => (
          <VideoCard key={v.id} video={v} compact />
        ))}
      </div>

      {showCopiedToast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-[#0f0f0f] dark:bg-white text-white dark:text-black px-6 py-3 rounded-full flex items-center gap-3 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300 z-[100] border border-white/10">
          <Check size={18} className="text-green-500" />
          <span className="text-sm font-bold">Link copied to clipboard</span>
        </div>
      )}
    </div>
  );
};

export default Watch;
