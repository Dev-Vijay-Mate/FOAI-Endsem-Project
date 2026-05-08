import { useTheme } from '../context/ThemeContext';

/**
 * Astronaut panel displaying people currently in space
 */
export default function AstronautPanel({ astronauts, loading }) {
  const { theme } = useTheme();

  if (loading) {
    return (
      <div className="glass-card p-5 animate-fade-in">
        <div className="skeleton h-5 w-40 mb-4" />
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-10 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-5 animate-slide-up" style={{ animationDelay: '200ms' }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          👨‍🚀 Astronauts in Space
        </h3>
        <span className={`px-2.5 py-1 rounded-full text-xs font-bold
          ${theme === 'dark'
            ? 'bg-cosmic-500/20 text-cosmic-300'
            : 'bg-cyan-50 text-cyan-600'
          }`}
        >
          {astronauts.count} people
        </span>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
        {astronauts.people.map((person, idx) => (
          <div
            key={idx}
            className={`flex items-center gap-3 p-3 rounded-xl transition-colors
              ${theme === 'dark'
                ? 'bg-white/3 hover:bg-white/6'
                : 'bg-gray-50 hover:bg-gray-100'
              }`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold
              ${theme === 'dark'
                ? 'bg-gradient-to-br from-nebula-500/30 to-cosmic-500/30 text-nebula-300'
                : 'bg-gradient-to-br from-purple-100 to-cyan-100 text-purple-600'
              }`}
            >
              {person.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium truncate ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                {person.name}
              </p>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                {person.craft}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
