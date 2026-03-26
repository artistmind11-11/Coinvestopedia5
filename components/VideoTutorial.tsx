import React from 'react';
import { Play, Eye, Users } from 'lucide-react';
import { Card } from './Card';

interface VideoTutorialProps {
  title?: string;
  description?: string;
  views?: number;
  enrolled?: number;
  seriesBadge?: string;
}

const VideoTutorialComponent: React.FC<VideoTutorialProps> = ({
  title = 'Crypto Trading Masterclass',
  description = 'Learn from Wall Street veterans. 12 episodes covering fundamentals to advanced strategies.',
  views = 125000,
  enrolled = 8500,
  seriesBadge = 'NEW SERIES'
}) => {
  return (
    <Card variant="interactive" className="relative overflow-hidden h-full">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 opacity-50"></div>
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
            <Play size={24} />
          </div>
          <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs font-bold rounded-md">
            {seriesBadge}
          </span>
        </div>
        <h3 className="text-xl font-bold text-text mb-2">{title}</h3>
        <p className="text-text-muted text-sm mb-4">{description}</p>
        
        <div className="flex items-center gap-4 mb-4 text-sm">
          <div className="flex items-center gap-1 text-text-muted">
            <Eye size={16} />
            <span>{(views / 1000).toFixed(0)}K views</span>
          </div>
          <div className="flex items-center gap-1 text-text-muted">
            <Users size={16} />
            <span>{(enrolled / 1000).toFixed(1)}K enrolled</span>
          </div>
        </div>

        <button className="w-full px-4 py-3 bg-purple-500 text-white rounded-xl font-semibold hover:bg-purple-600 transition-colors flex items-center justify-center gap-2">
          <Play size={16} />
          Start Watching Free
        </button>
      </div>
    </Card>
  );
};

export const VideoTutorial = React.memo(VideoTutorialComponent);
VideoTutorial.displayName = 'VideoTutorial';