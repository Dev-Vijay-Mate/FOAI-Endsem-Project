import { useTheme } from '../context/ThemeContext';

/**
 * Loading skeleton components for various layouts
 */
export function CardSkeleton({ lines = 3 }) {
  const { theme } = useTheme();
  return (
    <div className={`glass-card p-5 space-y-3 ${theme === 'dark' ? '' : ''}`}>
      <div className="skeleton h-4 w-1/3" />
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className={`skeleton h-3 ${i === lines - 1 ? 'w-2/3' : 'w-full'}`} />
      ))}
    </div>
  );
}

export function NewsCardSkeleton() {
  return (
    <div className="glass-card overflow-hidden">
      <div className="skeleton h-44 w-full rounded-none" />
      <div className="p-4 space-y-3">
        <div className="skeleton h-4 w-3/4" />
        <div className="skeleton h-3 w-1/2" />
        <div className="skeleton h-3 w-full" />
        <div className="skeleton h-3 w-5/6" />
        <div className="skeleton h-8 w-24 mt-2" />
      </div>
    </div>
  );
}

export function StatSkeleton() {
  return (
    <div className="glass-card p-5">
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <div className="skeleton h-3 w-20" />
          <div className="skeleton h-7 w-28" />
        </div>
        <div className="skeleton w-10 h-10 rounded-xl" />
      </div>
    </div>
  );
}

export function MapSkeleton() {
  return (
    <div className="glass-card p-4">
      <div className="skeleton h-5 w-40 mb-4" />
      <div className="skeleton h-80 w-full rounded-xl" />
    </div>
  );
}

/**
 * Full-width loading spinner
 */
export function LoadingSpinner({ size = 'md', text = 'Loading...' }) {
  const { theme } = useTheme();
  const sizeMap = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8">
      <div className={`${sizeMap[size]} border-2 border-nebula-500/30 border-t-nebula-400 rounded-full animate-spin`} />
      <p className={`text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>{text}</p>
    </div>
  );
}
