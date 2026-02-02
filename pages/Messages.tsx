
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Conversation } from '../types';
import { fetchConversations } from '../services/geminiService';
import { Loader2, Search, ArrowLeft, MoreVertical, Edit3 } from 'lucide-react';

const Messages: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      const data = await fetchConversations();
      setConversations(data);
      setLoading(false);
    };
    load();
  }, []);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-black transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#efefef] dark:border-[#262626] sticky top-0 bg-white dark:bg-black z-10">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="hover:opacity-60">
            <ArrowLeft size={24} />
          </button>
          <h2 className="text-xl font-bold dark:text-white">Messages</h2>
        </div>
        <div className="flex items-center gap-4">
          <Edit3 size={24} className="cursor-pointer" />
        </div>
      </div>

      {/* Search */}
      <div className="p-4">
        <div className="flex items-center bg-[#efefef] dark:bg-[#262626] rounded-xl px-4 py-2">
          <Search size={18} className="text-[#8e8e8e]" />
          <input 
            type="text" 
            placeholder="Search" 
            className="bg-transparent border-none outline-none w-full ml-3 text-sm dark:text-white"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="animate-spin text-purple-500" size={24} />
            <p className="text-xs text-[#8e8e8e]">Connecting your DMs...</p>
          </div>
        ) : conversations.length === 0 ? (
          <div className="text-center py-20 text-[#8e8e8e]">No messages yet.</div>
        ) : (
          <div className="flex flex-col">
            {conversations.map((chat) => (
              <Link 
                key={chat.id} 
                to={`/messages/${chat.username}`}
                className="flex items-center gap-4 px-4 py-3 hover:bg-[#fafafa] dark:hover:bg-[#1a1a1a] transition-colors active:scale-[0.98]"
              >
                <div className="relative">
                  <img src={chat.userAvatar} className="w-14 h-14 rounded-full object-cover" alt="" />
                  {chat.isOnline && (
                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white dark:border-black rounded-full" />
                  )}
                </div>
                <div className="flex-1 flex flex-col justify-center min-w-0">
                  <div className="flex justify-between items-center">
                    <span className={`text-sm font-bold ${chat.unread ? 'dark:text-white' : 'text-[#262626] dark:text-[#efefef]'}`}>
                      {chat.username}
                    </span>
                    <span className="text-[10px] text-[#8e8e8e]">{chat.timestamp}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className={`text-xs truncate ${chat.unread ? 'font-bold dark:text-white' : 'text-[#8e8e8e]'}`}>
                      {chat.lastMessage}
                    </p>
                    {chat.unread && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
