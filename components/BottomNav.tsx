import React from 'react';
import { Home, Compass, Film, PlusSquare } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const BottomNav: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;

  const NavItem: React.FC<{ 
    icon: React.ReactNode, 
    to: string, 
    label: string,
    active?: boolean 
  }> = ({ icon, to, label, active }) => (
    <Link 
      to={to} 
      className={`flex-1 flex flex-col justify-center items-center h-full transition-all active:scale-90 ${
        active 
          ? 'text-[#0f0f0f] dark:text-white' 
          : 'text-[#606060] dark:text-[#aaaaaa]'
      }`}
    >
      {icon}
      <span className={`text-[10px] mt-0.5 ${active ? 'font-bold' : 'font-medium'}`}>{label}</span>
    </Link>
  );

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[500px] h-14 bg-white/95 dark:bg-[#0f0f0f]/95 backdrop-blur-md border-t border-[#efefef] dark:border-[#262626] flex items-center justify-around z-50 transition-colors px-1 shadow-inner">
      <NavItem 
        icon={<Home size={22} fill={path === '/' ? 'currentColor' : 'none'} />} 
        to="/" 
        label="Home"
        active={path === '/'} 
      />
      <NavItem 
        icon={<Film size={22} fill={path === '/reels' ? 'currentColor' : 'none'} />} 
        to="/reels" 
        label="Shorts"
        active={path === '/reels'} 
      />
      <NavItem 
        icon={<div className="bg-[#f2f2f2] dark:bg-[#272727] p-1 rounded-full"><PlusSquare size={24} /></div>} 
        to="#" 
        label="Create"
      />
      <NavItem 
        icon={<Compass size={22} fill={path === '/explore' ? 'currentColor' : 'none'} />} 
        to="/explore" 
        label="Explore"
        active={path === '/explore'} 
      />
      <NavItem 
        icon={<div className="w-6 h-6 bg-gradient-to-tr from-purple-600 to-red-600 rounded-full flex items-center justify-center text-[8px] font-bold text-white border border-white dark:border-black shadow-sm">G</div>} 
        to="/profile/GeminiUser" 
        label="You"
        active={path.startsWith('/profile/')} 
      />
    </nav>
  );
};

export default BottomNav;
