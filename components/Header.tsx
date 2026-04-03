import React, { useState } from 'react';
import { Menu, X, ChevronDown, Sun, Moon } from 'lucide-react';
import { PageRoute } from '../types';
import { Button } from './Button';
import { SearchBar } from './SearchBar';
import { useAppContext } from '../context/AppContext';
import { NotificationIcon } from './AnimatedIcons';

interface HeaderProps {
  onNavigate: (route: PageRoute) => void;
  currentRoute: PageRoute;
  isMobileMenuOpen: boolean;
  onToggleMobileMenu: (isOpen: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onNavigate, 
  currentRoute,
  isMobileMenuOpen,
  onToggleMobileMenu
}) => {
  const { theme, toggleTheme, addToast } = useAppContext();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  
  const navLinks = [
    { label: 'Asset Comparison', route: PageRoute.COMPARE, options: [] },
    { 
      label: 'Macro Intel', 
      route: PageRoute.MACRO_INTEL, 
      options: [
        { label: 'Weekly Briefing', route: PageRoute.MACRO_INTEL },
        { label: 'Geopolitical Decoder', route: PageRoute.MACRO_INTEL },
        { label: 'Cross-Market Analysis', route: PageRoute.MACRO_INTEL },
        { label: 'Institutional Lens', route: PageRoute.MACRO_INTEL },
        { label: 'Archive', route: PageRoute.MACRO_INTEL }
      ]
    },
    { 
      label: 'Tools & Calculators', 
      route: PageRoute.TOOLS, 
      options: [
        { label: 'DCA Calculator', route: PageRoute.TOOLS },
        { label: 'ROI Calculator', route: PageRoute.TOOLS },
        { label: 'Impermanent Loss', route: PageRoute.TOOLS },
        { label: 'Tax Estimator', route: PageRoute.TOOLS }
      ]
    },
    { 
      label: 'Academy', 
      route: PageRoute.LEARN, 
      options: [
        { label: 'DeFi Strategies', route: PageRoute.LEARN },
        { label: 'Security & Custody', route: PageRoute.AUDIT },
        { label: 'Research', route: PageRoute.RESEARCH },
        { label: 'Technical Analysis', route: PageRoute.LEARN },
        { label: 'Insights', route: PageRoute.INSIGHTS }
      ] 
    },
    { label: 'Newsletter', route: PageRoute.NEWSLETTER, options: [] },
  ];
  
  const featuredLinks = [
    { label: 'Whale Tracker', route: PageRoute.WHALE, icon: '🐋', featured: true },
  ];

  const handleNavClick = (route: PageRoute) => {
    onNavigate(route);
    onToggleMobileMenu(false);
    setActiveDropdown(null);
  };

  const handleNotificationClick = () => {
    addToast('You have 3 unread market alerts', 'info');
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-200 h-[72px] ${isMobileMenuOpen ? 'bg-background' : 'glass-nav'}`}>
      <div className="max-w-container mx-auto px-6 h-full flex items-center justify-between">
        
        {/* Logo — blend-mode removes solid backgrounds: screen for black bg, multiply for white bg */}
        <div
          className="flex items-center cursor-pointer group flex-shrink-0"
          onClick={() => handleNavClick(PageRoute.HOME)}
        >
          {/* ── Dark mode, Desktop (black bg → mix-blend-screen makes black invisible) ── */}
          <img
            src="/logo-dark mode-full.png"
            alt="Coinvestopedia"
            className={`h-10 lg:h-12 w-auto object-contain mix-blend-screen transition-transform duration-200 group-hover:scale-105
              ${theme === 'dark' ? 'hidden md:block' : 'hidden'}`}
          />
          {/* ── Light mode, Desktop (white bg → mix-blend-multiply makes white invisible) ── */}
          <img
            src="/logo-light mode full.png"
            alt="Coinvestopedia"
            className={`h-10 lg:h-12 w-auto object-contain mix-blend-multiply transition-transform duration-200 group-hover:scale-105
              ${theme !== 'dark' ? 'hidden md:block' : 'hidden'}`}
          />
          {/* ── Mobile Dark (black bg → mix-blend-screen) ── */}
          <img
            src="/Mobile logo-light and dark mode-icon.png"
            alt="Coinvestopedia"
            className={`h-10 w-auto object-contain mix-blend-screen transition-transform duration-200 group-hover:scale-105
              ${theme === 'dark' ? 'block md:hidden' : 'hidden'}`}
          />
          {/* ── Mobile Light (white bg → mix-blend-multiply) ── */}
          <img
            src="/Mobile logo-light-mode-icon.png"
            alt="Coinvestopedia"
            className={`h-10 w-auto object-contain mix-blend-multiply transition-transform duration-200 group-hover:scale-105
              ${theme !== 'dark' ? 'block md:hidden' : 'hidden'}`}
          />
        </div>

        {/* Desktop Nav */}
        <nav className="hidden xl:flex items-center gap-4 xl:gap-8 h-full">
          {navLinks.map((link) => (
            <div 
              key={link.label}
              className="relative h-full flex items-center group"
              onMouseEnter={() => setActiveDropdown(link.label)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <div 
                className={`flex items-center gap-1 cursor-pointer transition-colors font-medium text-sm py-2 whitespace-nowrap relative ${currentRoute === link.route ? 'text-primary' : 'text-text-muted hover:text-text'}`}
                onClick={() => link.route && handleNavClick(link.route)}
                aria-label={link.label}
              >
                {link.label}
                {link.options.length > 0 && <ChevronDown size={14} className={`mt-[2px] transition-transform ${activeDropdown === link.label ? 'rotate-180' : ''}`} aria-hidden="true" />}
                
                {/* Active Indicator Line */}
                <span className={`absolute -bottom-1 left-0 h-[2px] bg-primary transition-all duration-300 ${currentRoute === link.route ? 'w-full' : 'w-0 group-hover:w-full opacity-50'}`} aria-hidden="true" />
              </div>
              
              {link.options.length > 0 && activeDropdown === link.label && (
                <div className="absolute top-[60px] left-1/2 -translate-x-1/2 w-48 py-2 bg-surface border border-border rounded-xl shadow-xl animate-fade-in z-50 overflow-hidden">
                  {link.options.map((opt, i) => (
                    <div 
                      key={i} 
                      className="px-4 py-3 text-sm font-medium text-text-muted hover:text-primary hover:bg-background cursor-pointer transition-colors"
                      onClick={() => handleNavClick(opt.route)}
                    >
                      {opt.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          
          {/* Featured Whale Radar */}
          {featuredLinks.map((link) => (
            <div 
              key={link.label}
              className={`flex items-center gap-1 cursor-pointer transition-colors font-medium text-sm whitespace-nowrap ${currentRoute === link.route ? 'text-primary' : 'text-text-muted hover:text-text'}`}
              onClick={() => link.route && handleNavClick(link.route)}
            >
              <span className="mr-1">{link.icon}</span>
              {link.label}
            </div>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <div className="hidden md:block">
            <SearchBar 
              className="w-[180px] xl:w-[240px]" 
              placeholder="Search (Cmd+K)"
            />
          </div>
          
          <button 
             onClick={handleNotificationClick}
             className="p-2 rounded-lg hover:bg-surface transition-colors"
             aria-label="Notifications"
          >
             <NotificationIcon hasNotification={true} />
          </button>

          <button 
            onClick={toggleTheme}
            className="p-2 rounded-lg text-text-muted hover:text-primary hover:bg-surface transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Hamburger: Hidden on mobile (< md) because bottom nav exists. Visible on tablet (md-xl). Hidden on desktop (> xl). */}
          <button className="hidden md:block xl:hidden text-text p-1" onClick={() => onToggleMobileMenu(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="xl:hidden fixed inset-0 top-[72px] bg-background z-40 overflow-y-auto pb-32 animate-fade-in border-t border-border">
          <div className="p-6 flex flex-col gap-6">
            <div className="mb-4">
              <SearchBar 
                className="w-full" 
                placeholder="Search assets..."
              />
            </div>

            <div className="flex flex-col gap-2">
               <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-2">Navigation</h3>
               
               {/* Featured Whale Radar in mobile */}
               {featuredLinks.map((link) => (
                 <div 
                   key={link.label}
                   className="py-4 border-b border-primary/30 text-xl font-medium text-primary flex items-center justify-between bg-primary/5 rounded-lg px-4 mb-2"
                   onClick={() => handleNavClick(link.route)}
                 >
                   <div className="flex items-center gap-3">
                       <span>{link.icon}</span>
                       {link.label}
                   </div>
                   <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">Featured</span>
                 </div>
               ))}
               
               {navLinks.map((link) => (
                 <div key={link.label} className="border-b border-border/50">
                    <div 
                      className="py-4 text-xl font-medium text-text flex items-center justify-between active:text-primary transition-colors cursor-pointer"
                      onClick={() => {
                        if (link.options.length > 0) {
                          setActiveDropdown(activeDropdown === link.label ? null : link.label);
                        } else {
                          handleNavClick(link.route);
                        }
                      }}
                    >
                      <div className="flex items-center gap-3">
                          {link.label}
                      </div>
                      {link.options.length > 0 && <ChevronDown size={20} className={`transition-transform duration-200 ${activeDropdown === link.label ? 'rotate-180' : ''}`} />}
                    </div>
                    
                    {/* Expandable Mobile Sub-options */}
                    {link.options.length > 0 && activeDropdown === link.label && (
                      <div className="pl-4 pb-4 flex flex-col gap-3 animate-fade-in">
                        {link.options.map((opt, i) => (
                          <div 
                            key={i} 
                            className="text-lg font-medium text-text-muted active:text-primary py-2 cursor-pointer"
                            onClick={() => handleNavClick(opt.route)}
                          >
                            {opt.label}
                          </div>
                        ))}
                      </div>
                    )}
                 </div>
               ))}
            </div>
            
            <div className="mt-4 pb-8 text-center px-6">
               <Button className="w-full justify-center py-4 text-lg">Sign In / Sign Up</Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};