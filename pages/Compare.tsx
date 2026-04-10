import React, { useState } from 'react';
import { DEFAULT_ASSETS, AssetData } from '../data/assetRegistry';
import { useLiveAssetRegistry } from '../hooks/useLiveAssetRegistry';

// Components
import { AssetSelector } from '../components/compare/AssetSelector';
import { OverviewPanel } from '../components/compare/OverviewPanel';
import { PerformancePanel } from '../components/compare/PerformancePanel';
import { RiskPanel } from '../components/compare/RiskPanel';
import { AllocationPanel } from '../components/compare/AllocationPanel';
import { CorrelationHeatmap } from '../components/compare/CorrelationHeatmap';
import { AnalystPanel } from '../components/compare/AnalystPanel';

// Icons
import { LayoutDashboard, TrendingUp, ShieldAlert, PieChart, GitMerge, Lightbulb, Activity } from 'lucide-react';

type TabId = 'overview' | 'performance' | 'risk' | 'allocation' | 'correlation' | 'analyst';

export const Compare: React.FC = () => {
  const isProUser = true; // Set to true for institutional dashboard view
  const [selectedAssetIds, setSelectedAssetIds] = useState<string[]>(DEFAULT_ASSETS);
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  const { registry, isHydrating } = useLiveAssetRegistry();

  const selectedAssets = selectedAssetIds
    .map(id => registry[id])
    .filter((a): a is AssetData => Boolean(a));

  const tabs = [
    { id: 'overview' as TabId, label: 'Overview', icon: LayoutDashboard },
    { id: 'performance' as TabId, label: 'Performance', icon: TrendingUp },
    { id: 'risk' as TabId, label: 'Risk & Volatility', icon: ShieldAlert },
    { id: 'allocation' as TabId, label: 'Allocation', icon: PieChart },
    { id: 'correlation' as TabId, label: 'Correlation', icon: GitMerge },
    { id: 'analyst' as TabId, label: 'Analyst Views', icon: Lightbulb },
  ];

  return (
    <div className="space-y-6 animate-fade-in pt-4 md:pt-0">
      
      {/* ─── HERO SECTION (Standardized Design) ─────────────── */}
      <div className="relative rounded-2xl lg:rounded-3xl border border-border bg-gradient-to-br from-background to-surface p-8 lg:p-16 mb-12 lg:mb-20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full -translate-y-48 translate-x-48 blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10">
          {/* Title area */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-5">
            <span className="w-2 h-2 rounded-full bg-primary animate-[pulse_2s_ease-in-out_infinite] shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            Wall Street Grade
          </div>
          <h1 className="text-3xl lg:text-5xl font-heading font-extrabold tracking-tight mb-4 leading-tight">
            Cross-Asset <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary-dark to-primary">Dashboard</span>
          </h1>
          <p className="text-text-muted text-base lg:text-xl max-w-2xl mb-8 leading-relaxed">
            Multi-asset intelligence for standard crypto, macro, and traditional markets. Q1 2026 data.
          </p>
          
          {/* Target Universe — integrated in the card */}
          <div className="border-t border-border/30 pt-8 mt-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="w-full min-w-0">
                <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-3 flex items-center gap-2">
                  <Activity size={12} className="text-primary" /> Target Universe
                </h3>
                <AssetSelector 
                  selectedIds={selectedAssetIds} 
                  onChange={setSelectedAssetIds} 
                  registry={registry}
                />
              </div>
              {isProUser && (
                <div className="shrink-0 w-full md:w-auto mt-2 md:mt-0">
                  <button className="flex justify-center md:items-center gap-2 px-6 py-3 w-full md:w-auto bg-primary/10 hover:bg-primary/20 text-primary text-sm font-bold border border-primary/20 rounded-lg transition-colors shadow-sm">
                    Export Data
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ─── TABS & NAVIGATION ─────────────────────────────────────────────── */}
      <div className="flex overflow-x-auto scrollbar-hide gap-2 md:gap-3 pb-2 scroll-smooth">
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-bold rounded-xl border transition-all duration-300 whitespace-nowrap shrink-0
                ${isActive 
                  ? 'border-primary/50 text-primary bg-primary/10 shadow-[0_0_15px_rgba(255,215,0,0.1)]' 
                  : 'border-border text-text-muted hover:text-text hover:bg-surface hover:border-primary/30'
                }`}
            >
              <Icon size={16} className={isActive ? 'text-primary' : 'text-text-muted'} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ─── TAB CONTENT PANELS ────────────────────────────────────────────── */}
      <div className="min-h-[500px]">
        {activeTab === 'overview' && <OverviewPanel assets={selectedAssets} />}
        {activeTab === 'performance' && <PerformancePanel assets={selectedAssets} />}
        {activeTab === 'risk' && <RiskPanel assets={selectedAssets} isProUser={isProUser} />}
        {activeTab === 'allocation' && <AllocationPanel />}
        {activeTab === 'correlation' && <CorrelationHeatmap assets={selectedAssets} />}
        {activeTab === 'analyst' && <AnalystPanel assets={selectedAssets} isProUser={isProUser} />}
      </div>
    </div>
  );
};
