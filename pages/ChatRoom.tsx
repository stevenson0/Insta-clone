import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Message } from '../types';
import { fetchChatHistory } from '../services/geminiService';
import { Loader2, ArrowLeft, Info, Phone, Video, Image as ImageIcon, Heart, Mic, Smile } from 'lucide-react';

const ChatRoom: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadHistory = async () => {
      if (!username) return;
      setLoading(true);
      const data = await fetchChatHistory(username);
      setMessages(data);
      setLoading(false);
    };
    loadHistory();
  }, [username]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim() || !username) return;
    
    const newMessage: Message = {
      id: `m-${Date.now()}`,
      sender: "GeminiUser",
      text: inputText,
      timestamp: "Just now",
      isMe: true
    };
    
    setMessages(prev => [...prev, newMessage]);
    setInputText('');

    // Simulate AI reply
    setTimeout(() => {
      const reply: Message = {
        id: `r-${Date.now()}`,
        sender: username,
        text: "That sounds awesome! Let's talk more about it later. 😊",
        timestamp: "Just now",
        isMe: false
      };
      setMessages(prev => [...prev, reply]);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-black transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-[#efefef] dark:border-[#262626] sticky top-0 bg-white dark:bg-black z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="hover:opacity-60 transition-opacity">
            <ArrowLeft size={24} />
          </button>
          <div className="flex items-center gap-2 cursor-pointer active:opacity-60" onClick={() => navigate(`/profile/${username}`)}>
            <img src={`https://picsum.photos/seed/${username}/100/100`} className="w-8 h-8 rounded-full object-cover" alt="" />
            <div className="flex flex-col">
              <span className="text-sm font-bold leading-none dark:text-white">{username}</span>
              <span className="text-[10px] text-green-500 font-medium">Active now</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Phone size={22} className="cursor-pointer" />
          <Video size={24} className="cursor-pointer" />
          <Info size={24} className="cursor-pointer" />
        </div>
      </div>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 no-scrollbar"
      >
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <Loader2 className="animate-spin text-purple-500" size={24} />
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center py-6 gap-2">
              <img src={`https://picsum.photos/seed/${username}/200/200`} className="w-20 h-20 rounded-full object-cover shadow-lg" alt="" />
              <h3 className="text-lg font-bold dark:text-white">{username}</h3>
              <p className="text-xs text-[#8e8e8e]">Instagram • GeminiGram</p>
              <button 
                onClick={() => navigate(`/profile/${username}`)}
                className="bg-[#efefef] dark:bg-[#262626] px-4 py-1.5 rounded-lg text-xs font-bold mt-2 hover:opacity-80 transition-opacity"
              >
                View Profile
              </button>
            </div>

            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}
              >
                <div 
                  className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                    msg.isMe 
                      ? 'bg-blue-500 text-white rounded-tr-none' 
                      : 'bg-[#efefef] dark:bg-[#262626] text-[#262626] dark:text-[#efefef] rounded-tl-none'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[9px] text-[#8e8e8e] mt-1 px-1">{msg.timestamp}</span>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white dark:bg-black">
        <div className="flex items-center bg-[#efefef] dark:bg-[#262626] rounded-3xl px-4 py-2 gap-3 border border-[#efefef] dark:border-transparent">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shrink-0">
             <Mic size={18} className="text-white" />
          </div>
          <input 
            type="text" 
            placeholder="Message..." 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 bg-transparent border-none outline-none text-sm dark:text-white"
          />
          {inputText.trim() ? (
            <button 
              onClick={handleSend}
              className="text-blue-500 font-bold text-sm hover:opacity-70 transition-opacity"
            >
              Send
            </button>
          ) : (
            <div className="flex items-center gap-3 text-[#262626] dark:text-[#efefef]">
              <ImageIcon size={22} className="cursor-pointer" />
              <Heart size={22} className="cursor-pointer" />
              <Smile size={22} className="cursor-pointer" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
