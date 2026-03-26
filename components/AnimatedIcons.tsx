import React from 'react';

/**
 * Pulse (Radar) Icon
 * Good for live status, recording, or tracking indicators.
 */
export const PulseIcon = () => (
  <div className="relative flex items-center justify-center w-6 h-6">
    <span className="absolute w-2.5 h-2.5 bg-primary rounded-full z-10 shadow-[0_0_10px_rgba(16,185,129,0.8)]"></span>
    <span className="absolute w-full h-full border border-primary rounded-full opacity-0 animate-radar"></span>
    <span className="absolute w-full h-full border border-primary rounded-full opacity-0 animate-radar delay-300"></span>
  </div>
);

/**
 * Notification Icon with Shake Animation
 * Good for alerts, bells, or updates.
 */
interface NotificationIconProps {
  hasNotification?: boolean;
}

export const NotificationIcon: React.FC<NotificationIconProps> = ({ hasNotification = false }) => (
  <div className="relative group cursor-pointer p-1">
    <svg className="w-6 h-6 stroke-text-muted group-hover:stroke-primary transition-colors stroke-[1.5] fill-none group-hover:animate-shake" viewBox="0 0 24 24">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
    </svg>
    {hasNotification && (
       <span className="absolute top-1 right-1.5 w-2 h-2 bg-primary rounded-full border border-background scale-0 group-hover:scale-100 transition-transform duration-200 ease-out"></span>
    )}
  </div>
);

/**
 * Target (Tech Crosshair) Icon
 * Good for scanners, specific targets, or technical tools.
 */
interface IconProps {
  className?: string;
}

export const TargetIcon: React.FC<IconProps> = ({ className = "w-10 h-10" }) => (
  <div className={`relative flex items-center justify-center group ${className}`}>
     <svg className="w-full h-full text-primary/50 group-hover:text-primary transition-colors duration-300" viewBox="0 0 40 40">
         <path d="M20 0v40M0 20h40" stroke="currentColor" strokeWidth="1" className="opacity-50"></path>
         <circle cx="20" cy="20" r="10" stroke="currentColor" strokeWidth="1" fill="none" className="group-hover:scale-125 transition-transform duration-500 origin-center"></circle>
         <circle cx="20" cy="20" r="2" fill="currentColor" className="animate-pulse"></circle>
     </svg>
  </div>
);
