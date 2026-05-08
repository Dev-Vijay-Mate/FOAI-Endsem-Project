import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';
import { DashboardProvider } from './context/DashboardContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Chatbot from './chatbot/Chatbot';
import DashboardPage from './pages/DashboardPage';
import ISSPage from './pages/ISSPage';
import NewsPage from './pages/NewsPage';
import ChartsPage from './pages/ChartsPage';

/**
 * SpacePulse Dashboard — Main Application Shell
 * Provides theme, dashboard context, sidebar navigation, and page routing
 */
function AppContent() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderPage = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardPage />;
      case 'iss':
        return <ISSPage />;
      case 'news':
        return <NewsPage />;
      case 'charts':
        return <ChartsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          activeTab={activeTab}
        />
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          {renderPage()}
        </main>
      </div>

      {/* Floating chatbot */}
      <Chatbot />

      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: '12px',
            fontSize: '14px',
            fontFamily: 'Inter, sans-serif',
          },
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <DashboardProvider>
        <AppContent />
      </DashboardProvider>
    </ThemeProvider>
  );
}
