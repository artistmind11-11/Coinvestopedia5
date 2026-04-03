import React, { useState } from 'react';
import { Home as HomeIcon, BarChart2, Calculator, Menu } from 'lucide-react';
import { Header } from './components/Header';
import { SidebarLeft } from './components/SidebarLeft';
import { SidebarRight } from './components/SidebarRight';
import { Background } from './components/Background';
import { ScrollToTop } from './components/ScrollToTop';
import { Home } from './pages/Home';
import { WhaleTracker } from './pages/WhaleTracker';
import { Compare } from './pages/Compare';
import { Tools } from './pages/Tools';
import { MacroIntel } from './pages/MacroIntel';
import { Learn } from './pages/Learn';
import { Insights } from './pages/Insights';
import { Research } from './pages/Research';
import { Newsletter } from './pages/Newsletter';
import { Privacy } from './pages/Privacy';
import { Terms } from './pages/Terms';
import { Cookies } from './pages/Cookies';
import { PageRoute } from './types';
import { AppProvider, useAppContext } from './context/AppContext';
import { ToastContainer } from './components/Toast';
import { SecurityAudit } from './pages/SecurityAudit';
import { TargetIcon } from './components/AnimatedIcons';

const AppContent: React.FC = () => {
  const { theme } = useAppContext();
  const [currentRoute, setCurrentRoute] = useState<PageRoute>(PageRoute.HOME);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavigate = (route: PageRoute) => {
    setCurrentRoute(route);
    setIsMobileMenuOpen(false); // Close menu if navigating
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    switch (currentRoute) {
      case PageRoute.HOME:
        return <Home onNavigate={handleNavigate} />;

      case PageRoute.WHALE:
        return <WhaleTracker />;
      case PageRoute.COMPARE:
        return <Compare />;
      case PageRoute.MACRO_INTEL:
        return <MacroIntel />;
      case PageRoute.TOOLS:
        return <Tools />;
      case PageRoute.NEWSLETTER:
        return <Newsletter />;
      case PageRoute.AUDIT:
        return <SecurityAudit />;
      case PageRoute.LEARN:
        return <Learn onNavigate={handleNavigate} />;
      case PageRoute.RESEARCH:
        return <Research />;
      case PageRoute.INSIGHTS:
        return <Insights />;
      case PageRoute.PRIVACY:
        return <Privacy />;
      case PageRoute.TERMS:
        return <Terms />;
      case PageRoute.COOKIES:
        return <Cookies />;
      default:
        return <Home onNavigate={handleNavigate} />;
    }
  };

  const mobileNavItems = [
    { label: 'Dashboard', icon: <HomeIcon size={20} />, route: PageRoute.HOME },
    { label: 'Whales', icon: <TargetIcon className="w-5 h-5" />, route: PageRoute.WHALE },
    { label: 'Tools', icon: <Calculator size={20} />, route: PageRoute.TOOLS },
  ];

  return (
    <div className="min-h-screen bg-background text-text font-body selection:bg-primary/30 relative">
      <Background />
      <ToastContainer />
      
      <div className="relative z-10">
        <Header 
          currentRoute={currentRoute} 
          onNavigate={handleNavigate}
          isMobileMenuOpen={isMobileMenuOpen}
          onToggleMobileMenu={setIsMobileMenuOpen}
        />
        
        {/* 
          Grid Layout from Design System: 
          160px Sidebar | 32px gap | 720px Content | 32px gap | 300px Sidebar 
          Total: 1244px fit in 1280px container
        */}
        <main className="max-w-container mx-auto pt-[72px] lg:pt-[120px] px-6 pb-32 md:pb-24">
          <div className="lg:grid lg:grid-cols-[160px_32px_1fr_32px_300px] lg:gap-0">
            
            {/* Col 1: Left Sidebar */}
            <div className="hidden lg:block">
              <SidebarLeft onNavigate={handleNavigate} currentRoute={currentRoute} />
            </div>

            {/* Col 2: Gap (Handled by grid-cols) */}
            <div className="hidden lg:block"></div>

            {/* Col 3: Main Content */}
            <div className="w-full min-w-0">
              {renderPage()}
            </div>

            {/* Col 4: Gap */}
            <div className="hidden lg:block"></div>

            {/* Col 5: Right Sidebar */}
            <div className="mt-12 lg:mt-0 hidden xl:block">
              <SidebarRight />
            </div>

          </div>
        </main>
        
        {/* Unified Footer: Visible on all devices */}
        <footer className="border-t border-border mt-auto py-12 bg-background/80 backdrop-blur-md relative z-20">
          <div className="max-w-container mx-auto px-6 flex flex-col items-center text-center gap-6">
            <div className="flex flex-col items-center gap-4">
              <img 
                src={theme === 'dark' ? '/logo-dark mode-full.png' : '/logo-light mode full.png'} 
                alt="Coinvestopedia" 
                className={`h-9 w-auto opacity-80 hover:opacity-100 transition-opacity ${theme === 'dark' ? 'mix-blend-screen' : 'mix-blend-multiply'}`}
              />
              <p className="text-text-muted text-sm px-4">
                © 2025 Coinvestopedia Academy. World-class institutional crypto data and research.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm font-medium">
              <button 
                onClick={() => handleNavigate(PageRoute.PRIVACY)} 
                className={`transition-colors whitespace-nowrap ${currentRoute === PageRoute.PRIVACY ? 'text-primary' : 'text-text-muted hover:text-primary'}`}
              >
                Privacy Policy
              </button>
              <button 
                onClick={() => handleNavigate(PageRoute.TERMS)} 
                className={`transition-colors whitespace-nowrap ${currentRoute === PageRoute.TERMS ? 'text-primary' : 'text-text-muted hover:text-primary'}`}
              >
                Terms of Service
              </button>
              <button 
                onClick={() => handleNavigate(PageRoute.COOKIES)} 
                className={`transition-colors whitespace-nowrap ${currentRoute === PageRoute.COOKIES ? 'text-primary' : 'text-text-muted hover:text-primary'}`}
              >
                Cookie Policy
              </button>
            </div>
            
            {/* Mobile Bottom Padding to account for navigation bar */}
            <div className="h-20 md:hidden" aria-hidden="true" />
          </div>
        </footer>

        {/* Mobile Bottom Navigation */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface border-t border-border">
          <div className="flex items-center justify-around h-[64px] px-2">
            {mobileNavItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavigate(item.route)}
                className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${
                  currentRoute === item.route 
                    ? 'text-primary' 
                    : 'text-text-muted hover:text-text'
                }`}
              >
                {item.icon}
                <span className="text-[10px] font-medium tracking-wide">{item.label}</span>
              </button>
            ))}
            {/* Menu Toggle Item */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${
                isMobileMenuOpen ? 'text-primary' : 'text-text-muted hover:text-text'
              }`}
            >
              <Menu size={20} />
              <span className="text-[10px] font-medium tracking-wide">Menu</span>
            </button>
          </div>
          {/* Safe area spacer for iOS Home Indicator */}
          <div className="h-[env(safe-area-inset-bottom)] bg-surface"></div>
        </div>

        {/* Global Action Button: Invisible until scroll > 300px */}
        <ScrollToTop />
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;