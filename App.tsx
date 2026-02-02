
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import SearchPage from './pages/Search';
import Profile from './pages/Profile';
import Messages from './pages/Messages';
import ChatRoom from './pages/ChatRoom';

const AppContent: React.FC<{ isDarkMode: boolean, toggleTheme: () => void }> = ({ isDarkMode, toggleTheme }) => {
  const location = useLocation();
  const hideChrome = location.pathname.startsWith('/messages/');

  return (
    <div className="w-full max-w-[500px] min-h-screen flex flex-col relative bg-white dark:bg-black border-x border-transparent sm:border-[#efefef] sm:dark:border-[#262626] shadow-xl">
      {!hideChrome && <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />}
      
      <main className={`flex-1 overflow-y-auto overflow-x-hidden no-scrollbar ${!hideChrome ? 'pb-20 pt-14' : ''}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchPage />} />
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
      <div className="min-h-screen bg-white dark:bg-black text-[#0f0f0f] dark:text-white transition-colors duration-300 flex flex-col items-center">
        <AppContent isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      </div>
    </Router>
  );
};

export default App;
