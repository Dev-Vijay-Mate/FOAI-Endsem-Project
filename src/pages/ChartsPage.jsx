import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useDashboard } from '../context/DashboardContext';
import SpeedChart from '../charts/SpeedChart';
import NewsDistributionChart from '../charts/NewsDistributionChart';
import ISSMap from '../components/ISSMap';

/**
 * Analytics/Charts page with ISS speed, news distribution, and map
 */
export default function ChartsPage() {
  const { theme } = useTheme();
  const { issPosition, positions, speeds, nearestLocation, techNews, spaceNews } = useDashboard();
  const [filterCategory, setFilterCategory] = useState(null);

  const handleSliceClick = (category) => {
    setFilterCategory((prev) => (prev === category ? null : category));
  };

  const filteredArticles = filterCategory
    ? filterCategory === 'technology'
      ? techNews
      : spaceNews
    : [...techNews, ...spaceNews];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          📊 Analytics Center
        </h2>
        <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
          Real-time visualizations and data insights
        </p>
      </div>

      {/* Charts grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Speed chart */}
        <SpeedChart speeds={speeds} />

        {/* News distribution */}
        <NewsDistributionChart
          techCount={techNews.length}
          spaceCount={spaceNews.length}
          onSliceClick={handleSliceClick}
        />
      </div>

      {/* Filter indicator */}
      {filterCategory && (
        <div className={`flex items-center gap-3 px-4 py-2 rounded-xl text-sm
          ${theme === 'dark' ? 'bg-nebula-500/10 text-nebula-300' : 'bg-purple-50 text-purple-600'}`}
        >
          <span>🔍 Filtering by: <strong>{filterCategory === 'technology' ? 'Technology' : 'Space & Science'}</strong></span>
          <button
            onClick={() => setFilterCategory(null)}
            className={`text-xs px-2 py-0.5 rounded-lg
              ${theme === 'dark' ? 'bg-white/10 hover:bg-white/15' : 'bg-white hover:bg-gray-100'}`}
          >
            ✕ Clear
          </button>
        </div>
      )}

      {/* Filtered articles list */}
      {filteredArticles.length > 0 && (
        <div className="glass-card p-5">
          <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            📰 {filterCategory ? `${filterCategory === 'technology' ? 'Technology' : 'Space & Science'} Articles` : 'All Articles'}
          </h3>
          <div className="space-y-3">
            {filteredArticles.map((article, idx) => (
              <div
                key={idx}
                className={`flex items-start gap-3 p-3 rounded-xl transition-colors
                  ${theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}
              >
                <span className="text-lg mt-0.5">{filterCategory === 'space' || (!filterCategory && idx >= techNews.length) ? '🚀' : '💻'}</span>
                <div className="flex-1 min-w-0">
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-sm font-medium hover:underline line-clamp-1
                      ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}
                  >
                    {article.title}
                  </a>
                  <p className={`text-xs mt-0.5 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                    {article.source} • {new Date(article.publishedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Map */}
      {issPosition && (
        <ISSMap issPosition={issPosition} positions={positions} nearestLocation={nearestLocation} />
      )}
    </div>
  );
}
