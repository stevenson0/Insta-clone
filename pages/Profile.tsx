
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Post, Video } from '../types';
import { fetchUserPosts, fetchUserProfile, fetchFollowers, fetchUserReels } from '../services/geminiService';
import { Loader2, Grid, UserSquare2, Bookmark, Film, X, Play, PlaySquare, Share2, Check } from 'lucide-react';

type TabType = 'posts' | 'reels' | 'shorts' | 'bookmarks' | 'tagged';

const FollowersModal: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void; 
  followers: { username: string; fullName: string; avatar: string }[];
  loading: boolean;
}> = ({ isOpen, onClose, followers, loading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={onClose}
      />
      <div className="relative w-full max-w-[400px] bg-white dark:bg-[#262626] rounded-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-3 border-b border-[#efefef] dark:border-[#363636]">
          <div className="w-8" />
          <h3 className="text-base font-bold dark:text-white">Followers</h3>
          <button onClick={onClose} className="p-1 hover:bg-[#f2f2f2] dark:hover:bg-[#363636] rounded-full transition-colors">
            <X size={20} className="dark:text-white" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto no-scrollbar py-2">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <Loader2 className="animate-spin text-purple-500" size={24} />
              <p className="text-xs text-[#8e8e8e]">Finding followers...</p>
            </div>
          ) : followers.length === 0 ? (
            <div className="py-12 text-center text-[#8e8e8e] text-sm italic">No followers found.</div>
          ) : (
            followers.map((user) => (
              <div key={user.username} className="flex items-center justify-between px-4 py-3 hover:bg-[#fafafa] dark:hover:bg-[#1a1a1a] transition-colors">
                <div className="flex items-center gap-3">
                  <Link to={`/profile/${user.username}`} onClick={onClose}>
                    <img src={user.avatar} className="w-11 h-11 rounded-full object-cover" alt="" />
                  </Link>
                  <div className="flex flex-col">
                    <Link to={`/profile/${user.username}`} onClick={onClose} className="text-sm font-bold leading-none dark:text-white hover:opacity-70 transition-opacity">
                      {user.username}
                    </Link>
                    <span className="text-xs text-[#8e8e8e] mt-0.5">{user.fullName}</span>
                  </div>
                </div>
                <button className="bg-[#efefef] dark:bg-[#363636] text-[#0f0f0f] dark:text-white text-xs font-bold px-4 py-1.5 rounded-lg hover:opacity-80 transition-opacity">
                  Remove
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const Profile: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [posts, setPosts] = useState<Post[]>([]);
  const [reels, setReels] = useState<Video[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('posts');
  const [showCopiedToast, setShowCopiedToast] = useState(false);
  
  const [isFollowersOpen, setIsFollowersOpen] = useState(false);
  const [followers, setFollowers] = useState<{ username: string; fullName: string; avatar: string }[]>([]);
  const [loadingFollowers, setLoadingFollowers] = useState(false);

  useEffect(() => {
    const loadProfileData = async () => {
      if (!username) return;
      setLoading(true);
      const [userPosts, userProfile, userReels] = await Promise.all([
        fetchUserPosts(username),
        fetchUserProfile(username),
        fetchUserReels(username)
      ]);
      setPosts(userPosts);
      setProfile(userProfile);
      setReels(userReels);
      setLoading(false);
    };
    loadProfileData();
    window.scrollTo(0, 0);
  }, [username]);

  const handleOpenFollowers = async () => {
    if (!username) return;
    setIsFollowersOpen(true);
    setLoadingFollowers(true);
    const data = await fetchFollowers(username);
    setFollowers(data);
    setLoadingFollowers(false);
  };

  const handleShareChannel = () => {
    const shareUrl = `${window.location.origin}/#/profile/${username}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setShowCopiedToast(true);
      setTimeout(() => setShowCopiedToast(false), 3000);
    });
  };

  const TabButton: React.FC<{ type: TabType; icon: React.ReactNode }> = ({ type, icon }) => (
    <button 
      onClick={() => setActiveTab(type)}
      className={`flex-1 flex justify-center py-3 transition-colors ${
        activeTab === type 
          ? 'border-b-2 border-black dark:border-white text-black dark:text-white' 
          : 'text-[#8e8e8e]'
      }`}
    >
      {icon}
    </button>
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] gap-4">
        <Loader2 className="animate-spin text-[#aaaaaa]" size={24} />
        <p className="text-xs text-[#8e8e8e]">Fetching @{username}...</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="px-4 pt-6 pb-6">
        <div className="flex items-center gap-6 mb-4">
          <img 
            src={`https://picsum.photos/seed/${username}/200/200`} 
            className="w-20 h-20 rounded-full object-cover shadow-md" 
            alt="" 
          />
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold dark:text-white truncate">{username}</h2>
            <p className="text-xs text-[#8e8e8e] mt-1">@{username.toLowerCase()}</p>
          </div>
        </div>

        <div className="mt-4 text-sm leading-relaxed">
          <p className="text-[#262626] dark:text-[#efefef]">{profile?.bio}</p>
        </div>

        <div className="flex gap-2 mt-6">
          <button className="flex-1 bg-[#efefef] dark:bg-[#262626] py-2 rounded-full text-sm font-bold hover:opacity-80 transition-opacity">
            Subscribe
          </button>
          <button 
            onClick={handleShareChannel}
            className="p-2 bg-[#efefef] dark:bg-[#262626] rounded-full hover:opacity-80 transition-opacity"
            title="Share Channel"
          >
            <Share2 size={18} />
          </button>
        </div>

        <div className="flex justify-between mt-6 pt-4 border-t border-[#efefef] dark:border-[#262626]">
          <div className="flex flex-col items-center flex-1">
            <span className="font-bold text-sm">{profile?.postCount || posts.length}</span>
            <span className="text-[10px] text-[#8e8e8e] uppercase font-medium">videos</span>
          </div>
          <div className="flex flex-col items-center flex-1 cursor-pointer" onClick={handleOpenFollowers}>
            <span className="font-bold text-sm">{profile?.followers}</span>
            <span className="text-[10px] text-[#8e8e8e] uppercase font-medium">subscribers</span>
          </div>
          <div className="flex flex-col items-center flex-1">
            <span className="font-bold text-sm">{profile?.following}</span>
            <span className="text-[10px] text-[#8e8e8e] uppercase font-medium">following</span>
          </div>
        </div>
      </div>

      <div className="flex border-b border-[#efefef] dark:border-[#262626] sticky top-14 bg-white dark:bg-[#0f0f0f] z-10">
        <TabButton type="posts" icon={<Grid size={20} />} />
        <TabButton type="reels" icon={<Film size={20} />} />
        <TabButton type="shorts" icon={<PlaySquare size={20} />} />
        <TabButton type="bookmarks" icon={<Bookmark size={20} />} />
      </div>

      <div className="grid grid-cols-3 gap-[2px] mt-[1px]">
        {(activeTab === 'reels' || activeTab === 'shorts' ? reels : posts).map((item: any) => (
          <div key={item.id} className="aspect-[9/16] bg-[#f2f2f2] dark:bg-[#121212] overflow-hidden cursor-pointer relative group">
            <img src={item.thumbnail || item.mediaUrl} className="w-full h-full object-cover" alt="" />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Play size={30} fill="white" className="text-white" />
            </div>
            {item.views && (
              <div className="absolute bottom-2 left-2 text-[10px] font-bold text-white drop-shadow-md">
                {item.views}
              </div>
            )}
          </div>
        ))}
      </div>

      <FollowersModal 
        isOpen={isFollowersOpen} 
        onClose={() => setIsFollowersOpen(false)} 
        followers={followers}
        loading={loadingFollowers}
      />

      {showCopiedToast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-[#0f0f0f] dark:bg-white text-white dark:text-black px-6 py-3 rounded-full flex items-center gap-3 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300 z-[100] border border-white/10">
          <Check size={18} className="text-green-500" />
          <span className="text-sm font-bold">Channel link copied!</span>
        </div>
      )}
    </div>
  );
};

export default Profile;
