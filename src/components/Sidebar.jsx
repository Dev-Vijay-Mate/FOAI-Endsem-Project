import { useTheme } from '../context/ThemeContext';

/**
 * Sidebar navigation for the dashboard
 */
export default function Sidebar({ activeTab, onTabChange, isOpen, onClose }) {
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '🚀' },
    { id: 'iss', label: 'ISS Tracker', icon: '🛰️' },
    { id: 'news', label: 'News Hub', icon: '📰' },
    { id: 'charts', label: 'Analytics', icon: '📊' },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full z-50 w-64 transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:z-10
          ${theme === 'dark'
            ? 'bg-space-900/95 border-r border-white/5'
            : 'bg-white/90 border-r border-gray-200'
          }
          backdrop-blur-xl flex flex-col`}
      >
        {/* Logo */}
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-nebula-500 to-cosmic-500 flex items-center justify-center text-xl animate-pulse-glow">
            🌌
          </div>
          <div>
            <h1 className="text-lg font-bold gradient-text">SpacePulse</h1>
            <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
              Mission Control
            </p>
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              id={`nav-${item.id}`}
              onClick={() => {
                onTabChange(item.id);
                onClose();
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                ${activeTab === item.id
                  ? theme === 'dark'
                    ? 'bg-nebula-500/20 text-nebula-300 border border-nebula-500/30'
                    : 'bg-nebula-500/10 text-nebula-500 border border-nebula-500/20'
                  : theme === 'dark'
                    ? 'text-gray-400 hover:text-white hover:bg-white/5'
                    : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
                }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
              {activeTab === item.id && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-nebula-400" />
              )}
            </button>
          ))}
        </nav>

        {/* Bottom section */}
        <div className="p-4 space-y-3">
          {/* Theme toggle */}
          <button
            id="theme-toggle"
            onClick={toggleTheme}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
              ${theme === 'dark'
                ? 'text-gray-400 hover:text-white hover:bg-white/5'
                : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
              }`}
          >
            <span className="text-lg">{theme === 'dark' ? '☀️' : '🌙'}</span>
            <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>

          {/* Connection status */}
          <div className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs
            ${theme === 'dark' ? 'bg-white/5 text-gray-500' : 'bg-gray-50 text-gray-400'}`}
          >
            <div className="status-online" />
            <span>Systems Online</span>
          </div>
        </div>
      </aside>
    </>
  );
}
