
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Post } from '../types';
import { fetchFeedPosts } from '../services/geminiService';
// Added Film to the imports from lucide-react
import { Loader2, Search as SearchIcon, Film } from 'lucide-react';

const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      // For search, we simulate by fetching feed posts (in a real app, we'd query)
      const results = await fetchFeedPosts();
      setPosts(results);
      setLoading(false);
    };
    fetchResults();
  }, [query]);

  return (
    <div className="w-full">
      {/* Search Input Box */}
      <div className="px-4 py-2 sticky top-0 bg-white/80 dark:bg-black/80 backdrop-blur-md z-10 border-b border-[#efefef] dark:border-[#262626]">
        <div className="flex items-center bg-[#efefef] dark:bg-[#262626] rounded-lg px-3 py-1.5 w-full">
          <SearchIcon size={16} className="text-[#8e8e8e]" />
          <input
            type="text"
            placeholder="Search"
            value={query}
            onChange={(e) => setSearchParams({ q: e.target.value })}
            className="bg-transparent border-none outline-none w-full ml-2 text-sm text-[#0f0f0f] dark:text-white"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
          <Loader2 className="animate-spin text-[#aaaaaa]" size={24} />
          <p className="text-xs text-[#8e8e8e]">Exploring the GeminiGram grid...</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-[2px]">
          {posts.map((post) => (
            <div key={post.id} className="aspect-square bg-[#f2f2f2] dark:bg-[#121212] relative group">
              <img 
                src={post.mediaUrl} 
                alt="" 
                className="w-full h-full object-cover" 
              />
              {/* Overlay for reels/video simulation */}
              <div className="absolute top-2 right-2 opacity-70">
                <Film size={14} className="text-white fill-white" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
