
import React from 'react';
import { Home, Search, Compass, Film, User, PlusSquare } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const BottomNav: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;

  const NavItem: React.FC<{ icon: React.ReactNode, to: string, active?: boolean }> = ({ icon, to, active }) => (
    <Link 
      to={to} 
      className={`flex-1 flex justify-center items-center h-full transition-transform active:scale-90 ${active ? 'text-[#0f0f0f] dark:text-white' : 'text-[#8e8e8e]'}`}
    >
      {icon}
    </Link>
  );

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[500px] h-14 bg-white dark:bg-black border-t border-[#efefef] dark:border-[#262626] flex items-center justify-around z-50 transition-colors px-2">
      <NavItem icon={<Home size={26} fill={path === '/' ? 'currentColor' : 'none'} />} to="/" active={path === '/'} />
      <NavItem icon={<Search size={26} strokeWidth={path === '/search' ? 3 : 2} />} to="/search" active={path === '/search'} />
      <NavItem icon={<PlusSquare size={26} />} to="#" />
      <NavItem icon={<Compass size={26} />} to="#" />
      <NavItem icon={<Film size={26} />} to="#" />
      <NavItem 
        icon={<div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-[10px] font-bold text-white border border-white dark:border-black">G</div>} 
        to="/profile/GeminiUser" 
        active={path.startsWith('/profile/')} 
      />
    </nav>
  );
};

export default BottomNav;
