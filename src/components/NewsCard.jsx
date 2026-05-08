import { useTheme } from '../context/ThemeContext';
import { formatISODate, truncate } from '../utils/helpers';

/**
 * News article card with image, metadata, and read more link
 */
export default function NewsCard({ article, delay = 0 }) {
  const { theme } = useTheme();

  return (
    <div
      className="glass-card overflow-hidden animate-slide-up group"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Image */}
      <div className="relative overflow-hidden">
        {article.image ? (
          <img
            src={article.image}
            alt={article.title}
            className="news-img transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              e.target.src = 'data:image/svg+xml,' + encodeURIComponent(`
                <svg xmlns="http://www.w3.org/2000/svg" width="400" height="180" viewBox="0 0 400 180">
                  <rect fill="#1e1548" width="400" height="180"/>
                  <text fill="#7c3aed" font-size="48" font-family="sans-serif" x="50%" y="50%" text-anchor="middle" dy=".3em">🛰️</text>
                </svg>
              `);
            }}
          />
        ) : (
          <div className={`h-44 flex items-center justify-center text-4xl
            ${theme === 'dark' ? 'bg-space-700' : 'bg-gray-100'}`}
          >
            📰
          </div>
        )}
        {/* Source badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md
            ${theme === 'dark'
              ? 'bg-black/40 text-white'
              : 'bg-white/80 text-gray-800'
            }`}
          >
            {article.source}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <h4 className={`text-sm font-semibold leading-snug line-clamp-2
          ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
        >
          {article.title}
        </h4>

        <div className={`flex items-center gap-2 text-xs
          ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}
        >
          <span>✍️ {article.author}</span>
          <span>•</span>
          <span>📅 {formatISODate(article.publishedAt)}</span>
        </div>

        <p className={`text-xs leading-relaxed
          ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}
        >
          {truncate(article.description, 140)}
        </p>

        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-nebula-400 hover:text-nebula-300 transition-colors"
        >
          Read More
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    </div>
  );
}
