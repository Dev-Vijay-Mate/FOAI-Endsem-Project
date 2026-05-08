import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

/**
 * Top header bar for mobile & desktop
 */
export default function Header({ onMenuClick, activeTab }) {
  const { theme } = useTheme();

  const titles = {
    dashboard: 'Mission Control',
    iss: 'ISS Live Tracker',
    news: 'News Hub',
    charts: 'Analytics Center',
  };

  return (
    <header className={`sticky top-0 z-30 px-4 lg:px-8 py-4 flex items-center justify-between
      ${theme === 'dark'
        ? 'bg-space-900/80 border-b border-white/5'
        : 'bg-white/80 border-b border-gray-200'
      } backdrop-blur-xl`}
    >
      <div className="flex items-center gap-4">
        {/* Mobile menu button */}
        <button
          id="menu-toggle"
          onClick={onMenuClick}
          className={`lg:hidden p-2 rounded-lg transition-colors
            ${theme === 'dark' ? 'hover:bg-white/10 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div>
          <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {titles[activeTab] || 'Dashboard'}
          </h2>
          <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
            Real-time space intelligence
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Live indicator */}
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium
          ${theme === 'dark' ? 'bg-aurora-500/10 text-aurora-400' : 'bg-green-50 text-green-600'}`}
        >
          <div className="w-2 h-2 rounded-full bg-aurora-400 animate-pulse" />
          LIVE
        </div>

        {/* Current time */}
        <div className={`hidden sm:block text-xs font-mono
          ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}
        >
          <CurrentTime />
        </div>
      </div>
    </header>
  );
}

function CurrentTime() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return <span>{time.toLocaleTimeString('en-US', { hour12: false })}</span>;
}
