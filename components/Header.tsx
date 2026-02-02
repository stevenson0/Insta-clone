
import React from 'react';
import { Youtube, Search, Bell, User, Sun, Moon, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ isDarkMode, toggleTheme }) => {
  return (
    <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[500px] h-14 bg-white/95 dark:bg-[#0f0f0f]/95 backdrop-blur-md border-b border-[#efefef] dark:border-[#262626] flex items-center justify-between px-4 z-50 transition-colors">
      <Link to="/" className="flex items-center gap-1 group">
        <Youtube size={30} className="text-[#FF0000] fill-[#FF0000]" />
        <span className="text-xl font-bold tracking-tighter dark:text-white">GeminiTube</span>
      </Link>

      <div className="flex items-center gap-3">
        <button 
          onClick={toggleTheme}
          className="p-2 hover:bg-[#f2f2f2] dark:hover:bg-[#272727] rounded-full transition-colors"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <Link to="/messages" className="p-2 hover:bg-[#f2f2f2] dark:hover:bg-[#272727] rounded-full transition-colors">
          <MessageCircle size={20} />
        </Link>
        <div className="p-2 hover:bg-[#f2f2f2] dark:hover:bg-[#272727] rounded-full transition-colors cursor-pointer relative">
          <Bell size={20} />
          <div className="absolute top-2 right-2 w-2 h-2 bg-[#FF0000] rounded-full border-2 border-white dark:border-[#0f0f0f]"></div>
        </div>
      </div>
    </header>
  );
};

export default Header;
