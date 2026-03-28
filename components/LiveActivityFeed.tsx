import React from 'react';
import { Activity, Hash, Lock, ArrowRight } from 'lucide-react';
import { Card } from './Card';

interface ActivityItem {
  user: string;
  action: string;
  amount: string;
  asset: string;
  time: string;
  severity: 'extreme' | 'high' | 'medium' | 'low';
}

interface LiveActivityFeedProps {
  activities?: ActivityItem[];
}

const LiveActivityFeedComponent: React.FC<LiveActivityFeedProps> = ({ 
  activities = [
    { user: 'Whale Alert', action: 'bought', amount: '$50M', asset: 'ETH', time: '2m ago', severity: 'extreme' as const },
    { user: 'Smart Money', action: 'sold', amount: '$30M', asset: 'BTC', time: '5m ago', severity: 'high' as const },
    { user: 'Institution', action: 'staked', amount: '$20M', asset: 'SOL', time: '8m ago', severity: 'medium' as const }
  ]
}) => {
  const getSeverityColor = (severity: ActivityItem['severity']) => {
    switch(severity) {
      case 'extreme': return 'text-red-500 bg-red-500/10 border-red-500/30';
      case 'high': return 'text-orange-500 bg-orange-500/10 border-orange-500/30';
      case 'medium': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30';
      case 'low': return 'text-primary bg-primary/10 border-primary/30';
      default: return 'text-primary bg-primary/10 border-primary/30';
    }
  };

  return (
    <Card variant="featured">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <Activity size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-text">Live Whale Activity</h3>
            <p className="text-sm text-text-muted">Real-time smart money tracking</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
          <span className="text-xs text-primary font-semibold">LIVE</span>
        </div>
      </div>
      
      <div className="space-y-3" role="feed" aria-live="polite">
        {activities.map((activity, i) => (
          <div 
            key={i} 
            className="flex items-center justify-between p-4 bg-background/50 rounded-xl border border-border hover:border-primary/30 transition-all group animate-slide-in" 
            style={{ animationDelay: `${i * 100}ms` }}
            role="article"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-10 h-10 bg-surface rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                <Hash size={20} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm truncate">
                  <span className="text-text-muted">{activity.user}</span>
                  <span className="text-text mx-1">{activity.action}</span>
                  <span className="text-primary">{activity.amount}</span>
                  <span className="text-text mx-1">{activity.asset}</span>
                </div>
                <div className="text-xs text-text-muted truncate">{activity.time}</div>
              </div>
            </div>
            <div className={`px-2 py-1 rounded-md text-xs font-bold border ${getSeverityColor(activity.severity)} flex-shrink-0`}>
              {activity.severity.toUpperCase() as 'EXTREME' | 'HIGH' | 'MEDIUM' | 'LOW'}
            </div>
          </div>
        ))}
      </div>

      <button className="w-full mt-4 px-4 py-3 bg-primary/10 border border-primary/30 rounded-xl text-primary font-semibold hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2 group">
        <Lock size={16} />
        <span>Unlock Real-Time Feed</span>
        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
      </button>
    </Card>
  );
};

export const LiveActivityFeed = React.memo(LiveActivityFeedComponent);
LiveActivityFeed.displayName = 'LiveActivityFeed';