import { useTheme } from '../context/ThemeContext';

/**
 * Reusable error state with retry action
 */
export default function ErrorState({ message, onRetry, compact = false }) {
  const { theme } = useTheme();

  if (compact) {
    return (
      <div className={`flex items-center gap-3 p-3 rounded-xl
        ${theme === 'dark' ? 'bg-danger-500/10 text-danger-400' : 'bg-red-50 text-red-500'}`}
      >
        <span>⚠️</span>
        <span className="text-sm flex-1">{message}</span>
        {onRetry && (
          <button onClick={onRetry} className="btn-ghost text-xs py-1 px-3">
            Retry
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="glass-card p-8 text-center">
      <div className="text-4xl mb-4">🛸</div>
      <h3 className={`text-lg font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
        Houston, we have a problem
      </h3>
      <p className={`text-sm mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
        {message || 'Something went wrong. Please try again.'}
      </p>
      {onRetry && (
        <button onClick={onRetry} className="btn-primary">
          🔄 Try Again
        </button>
      )}
    </div>
  );
}
