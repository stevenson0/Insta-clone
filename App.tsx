import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import SearchPage from './pages/Search';
import Explore from './pages/Explore';
import Reels from './pages/Reels';
import Profile from './pages/Profile';
import Messages from './pages/Messages';
import ChatRoom from './pages/ChatRoom';
import Watch from './pages/Watch';

const AppContent: React.FC<{ isDarkMode: boolean, toggleTheme: () => void }> = ({ isDarkMode, toggleTheme }) => {
  const location = useLocation();
  const path = location.pathname;
  const hideChrome = path.startsWith('/messages/');
  // Optional: Hide header on Reels for more immersive view
  const isReels = path === '/reels';

  return (
    <div className="w-full max-w-[500px] min-h-screen flex flex-col relative bg-white dark:bg-[#0f0f0f] border-x border-transparent sm:border-[#efefef] sm:dark:border-[#262626] shadow-xl mx-auto">
      {!hideChrome && !isReels && <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />}
      
      <main className={`flex-1 overflow-y-auto overflow-x-hidden no-scrollbar ${!hideChrome && !isReels ? 'pt-14' : ''} pb-14`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/reels" element={<Reels />} />
          <Route path="/watch/:id" element={<Watch />} />
          <Route path="/profile/:username" element={<Profile />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/messages/:username" element={<ChatRoom />} />
        </Routes>
      </main>

      {!hideChrome && <BottomNav />}
    </div>
  );
};

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : true;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  return (
    <Router>
      <div className="min-h-screen bg-[#f1f1f1] dark:bg-black text-[#0f0f0f] dark:text-white transition-colors duration-300 flex flex-col items-center">
        <AppContent isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      </div>
    </Router>
  );
};

export default App;
