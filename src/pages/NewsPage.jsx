import { useState, useEffect, useCallback } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useDashboard } from '../context/DashboardContext';
import { fetchNews, searchNews } from '../services/newsService';
import NewsCard from '../components/NewsCard';
import { NewsCardSkeleton } from '../components/Skeletons';
import ErrorState from '../components/ErrorState';
import toast from 'react-hot-toast';

/**
 * News dashboard page with search, sort, and category tabs
 */
export default function NewsPage() {
  const { theme } = useTheme();
  const { techNews, setTechNews, spaceNews, setSpaceNews } = useDashboard();

  const [activeCategory, setActiveCategory] = useState('technology');
  const [techLoading, setTechLoading] = useState(false);
  const [spaceLoading, setSpaceLoading] = useState(false);
  const [techError, setTechError] = useState(null);
  const [spaceError, setSpaceError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [sortBy, setSortBy] = useState('newest');

  // Fetch tech news
  const loadTechNews = useCallback(async (force = false) => {
    setTechLoading(true);
    setTechError(null);
    try {
      const result = await fetchNews('technology', force);
      setTechNews(result.articles);
      if (result.fromCache) {
        toast('📦 Loaded from cache', { icon: '💾', duration: 2000 });
      }
    } catch (err) {
      setTechError(err.message);
      toast.error('Failed to load tech news');
    } finally {
      setTechLoading(false);
    }
  }, [setTechNews]);

  // Fetch space news
  const loadSpaceNews = useCallback(async (force = false) => {
    setSpaceLoading(true);
    setSpaceError(null);
    try {
      const result = await fetchNews('space', force);
      setSpaceNews(result.articles);
      if (result.fromCache) {
        toast('📦 Loaded from cache', { icon: '💾', duration: 2000 });
      }
    } catch (err) {
      setSpaceError(err.message);
      toast.error('Failed to load space news');
    } finally {
      setSpaceLoading(false);
    }
  }, [setSpaceNews]);

  // Initial load
  useEffect(() => {
    if (techNews.length === 0) loadTechNews();
    if (spaceNews.length === 0) loadSpaceNews();
  }, [loadTechNews, loadSpaceNews, techNews.length, spaceNews.length]);

  // Search handler
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResults(null);
      return;
    }
    setSearchLoading(true);
    try {
      const results = await searchNews(searchQuery);
      setSearchResults(results);
    } catch (err) {
      toast.error('Search failed: ' + err.message);
    } finally {
      setSearchLoading(false);
    }
  };

  // Sort articles
  const sortArticles = (articles) => {
    if (!articles) return [];
    const sorted = [...articles];
    switch (sortBy) {
      case 'newest':
        return sorted.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
      case 'source':
        return sorted.sort((a, b) => a.source.localeCompare(b.source));
      default:
        return sorted;
    }
  };

  const currentArticles = searchResults
    ? sortArticles(searchResults)
    : activeCategory === 'technology'
      ? sortArticles(techNews)
      : sortArticles(spaceNews);

  const isLoading = searchResults
    ? searchLoading
    : activeCategory === 'technology' ? techLoading : spaceLoading;

  const currentError = activeCategory === 'technology' ? techError : spaceError;

  const handleRefresh = () => {
    if (activeCategory === 'technology') {
      loadTechNews(true);
    } else {
      loadSpaceNews(true);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            📰 News Hub
          </h2>
          <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            Latest technology and space science articles
          </p>
        </div>
      </div>

      {/* Search & Controls */}
      <div className="glass-card p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search news..."
              className={`flex-1 px-4 py-2.5 rounded-xl text-sm outline-none transition-colors
                ${theme === 'dark'
                  ? 'bg-white/5 text-white placeholder-gray-600 focus:bg-white/8 border border-white/5 focus:border-nebula-500/30'
                  : 'bg-gray-50 text-gray-800 placeholder-gray-400 focus:bg-white border border-gray-200 focus:border-nebula-400'
                }`}
            />
            <button type="submit" className="btn-primary" disabled={searchLoading}>
              🔍
            </button>
            {searchResults && (
              <button
                type="button"
                onClick={() => { setSearchResults(null); setSearchQuery(''); }}
                className="btn-ghost"
              >
                ✕ Clear
              </button>
            )}
          </form>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={`px-3 py-2.5 rounded-xl text-sm outline-none cursor-pointer
              ${theme === 'dark'
                ? 'bg-white/5 text-gray-300 border border-white/5'
                : 'bg-gray-50 text-gray-700 border border-gray-200'
              }`}
          >
            <option value="newest">📅 Newest First</option>
            <option value="source">📰 By Source</option>
          </select>
        </div>
      </div>

      {/* Category tabs (hide when searching) */}
      {!searchResults && (
        <div className="flex items-center gap-2">
          {[
            { id: 'technology', label: '💻 Technology', count: techNews.length },
            { id: 'space', label: '🚀 Space & Science', count: spaceNews.length },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
                ${activeCategory === cat.id
                  ? 'bg-gradient-to-r from-nebula-500 to-cosmic-500 text-white shadow-lg'
                  : theme === 'dark'
                    ? 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-800'
                }`}
            >
              {cat.label}
              <span className="ml-2 text-xs opacity-70">({cat.count})</span>
            </button>
          ))}

          <button
            onClick={handleRefresh}
            className="ml-auto btn-ghost text-sm"
            disabled={isLoading}
          >
            🔄 Refresh
          </button>
        </div>
      )}

      {/* Search results label */}
      {searchResults && (
        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
          🔍 Search results for &ldquo;{searchQuery}&rdquo; ({searchResults.length} articles)
        </p>
      )}

      {/* Error state */}
      {currentError && !searchResults && (
        <ErrorState message={currentError} onRetry={handleRefresh} />
      )}

      {/* Articles grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {isLoading
          ? Array.from({ length: 5 }).map((_, i) => <NewsCardSkeleton key={i} />)
          : currentArticles.map((article, idx) => (
              <NewsCard key={article.url || idx} article={article} delay={idx * 80} />
            ))
        }
      </div>

      {/* Empty state */}
      {!isLoading && currentArticles.length === 0 && !currentError && (
        <div className="text-center py-12">
          <div className="text-5xl mb-4">📡</div>
          <h3 className={`text-lg font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            No articles found
          </h3>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
            Try a different search term or check your API key configuration.
          </p>
        </div>
      )}
    </div>
  );
}
