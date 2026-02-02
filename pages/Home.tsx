
import React, { useEffect, useState } from 'react';
import { Post, Story } from '../types';
import { fetchFeedPosts, fetchStories } from '../services/geminiService';
import PostCard from '../components/PostCard';
import { Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const StoriesBar: React.FC<{ stories: Story[] }> = ({ stories }) => (
  <div className="flex gap-4 overflow-x-auto p-4 mb-2 bg-white dark:bg-black no-scrollbar border-b border-[#efefef] dark:border-[#262626]">
    {stories.map((story) => (
      <Link key={story.id} to={`/profile/${story.username}`} className="flex flex-col items-center gap-1 min-w-[64px]">
        <div className="p-[2px] rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 cursor-pointer transition-transform active:scale-95">
          <div className="p-[2px] bg-white dark:bg-black rounded-full">
            <img src={story.avatar} className="w-14 h-14 rounded-full object-cover" alt="" />
          </div>
        </div>
        <span className="text-[10px] truncate w-full text-center text-[#606060] dark:text-[#efefef] font-medium">{story.username}</span>
      </Link>
    ))}
  </div>
);

const Home: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const [p, s] = await Promise.all([fetchFeedPosts(), fetchStories()]);
      setPosts(p);
      setStories(s);
      setLoading(false);
    };
    loadData();
  }, []);

  return (
    <div className="flex flex-col w-full">
      {loading ? (
        <div className="flex flex-col items-center justify-center h-[70vh] gap-4">
          <div className="w-12 h-12 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 rounded-2xl animate-spin-slow shadow-lg" style={{ animation: 'spin 3s linear infinite' }} />
          <Loader2 className="animate-spin text-[#aaaaaa]" size={20} />
          <p className="text-xs font-semibold text-[#8e8e8e] tracking-tight text-center">GEMINI IS BREWING YOUR FEED</p>
        </div>
      ) : (
        <>
          <StoriesBar stories={stories} />
          <div className="flex flex-col divide-y divide-[#efefef] dark:divide-[#262626]">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
          <div className="h-4" /> {/* Bottom spacer */}
        </>
      )}
    </div>
  );
};

export default Home;
