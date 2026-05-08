import { useTheme } from '../context/ThemeContext';
import { useAnimatedCounter } from '../hooks/useAnimatedCounter';

/**
 * Stat card with animated counter, icon, and optional trend
 */
export default function StatCard({ title, value, icon, suffix = '', color = 'nebula', delay = 0 }) {
  const { theme } = useTheme();
  const animatedValue = useAnimatedCounter(typeof value === 'number' ? value : 0);

  const colorMap = {
    nebula: {
      bg: 'from-nebula-500/20 to-nebula-500/5',
      icon: 'from-nebula-500 to-nebula-400',
      text: theme === 'dark' ? 'text-nebula-300' : 'text-nebula-500',
    },
    cosmic: {
      bg: 'from-cosmic-500/20 to-cosmic-500/5',
      icon: 'from-cosmic-500 to-cosmic-400',
      text: theme === 'dark' ? 'text-cosmic-300' : 'text-cosmic-500',
    },
    aurora: {
      bg: 'from-aurora-500/20 to-aurora-500/5',
      icon: 'from-aurora-500 to-aurora-400',
      text: theme === 'dark' ? 'text-aurora-300' : 'text-aurora-500',
    },
    solar: {
      bg: 'from-solar-500/20 to-solar-500/5',
      icon: 'from-solar-500 to-solar-400',
      text: theme === 'dark' ? 'text-solar-300' : 'text-solar-500',
    },
  };

  const colors = colorMap[color] || colorMap.nebula;

  return (
    <div
      className="glass-card p-5 animate-slide-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className={`text-xs font-medium uppercase tracking-wider mb-2
            ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}
          >
            {title}
          </p>
          <div className="flex items-baseline gap-1">
            <span className={`text-2xl font-bold ${colors.text} animate-counter`}>
              {typeof value === 'number' ? animatedValue.toLocaleString() : value}
            </span>
            {suffix && (
              <span className={`text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                {suffix}
              </span>
            )}
          </div>
        </div>
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colors.icon} flex items-center justify-center text-lg`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
