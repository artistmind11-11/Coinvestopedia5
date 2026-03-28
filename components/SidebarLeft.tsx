import React from 'react';
import { NavItem, PageRoute } from '../types';
import { BookOpen, BarChart2, TrendingUp, Shield, Calculator, Globe } from 'lucide-react';
import { TargetIcon } from './AnimatedIcons';

interface SidebarLeftProps {
  onNavigate?: (route: PageRoute) => void;
  currentRoute?: PageRoute;
}

export const SidebarLeft: React.FC<SidebarLeftProps> = ({ onNavigate, currentRoute }) => {
  const menuItems = [
    { icon: <BarChart2 size={20} />, label: 'Asset Comparison', route: PageRoute.COMPARE },
    { icon: <Globe size={20} />, label: 'Macro Intel', route: PageRoute.MACRO_INTEL },
    { icon: <TargetIcon className="w-5 h-5" />, label: 'Whale Tracker', route: PageRoute.WHALE },
    { icon: <Calculator size={20} />, label: 'Tools & Calculators', route: PageRoute.TOOLS },
    { icon: <Shield size={20} />, label: 'Security', route: PageRoute.AUDIT },
    { icon: <BookOpen size={20} />, label: 'Academy', route: PageRoute.LEARN },
  ];

  return (
    <aside className="hidden lg:block w-[160px] sticky top-[120px] self-start h-fit">
      <nav className="flex flex-col gap-2">
        <h3 className="text-xs font-bold text-primary uppercase tracking-widest mb-4 px-3">Explore</h3>
        {menuItems.map((item, index) => (
          <button 
            key={index} 
            onClick={() => item.route && onNavigate?.(item.route)}
            className={`flex items-center gap-3 px-3 py-2 w-full text-left rounded-md transition-colors group ${currentRoute === item.route ? 'text-primary bg-surface' : 'text-text-muted hover:text-primary hover:bg-surface'}`}
          >
            <span className="group-hover:text-primary transition-colors flex items-center justify-center">{item.icon}</span>
            <span className="text-sm font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};