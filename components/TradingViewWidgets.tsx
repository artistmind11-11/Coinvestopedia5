import React, { useState, useEffect, useRef, memo } from 'react';

export const TradingViewTimelineNews = memo(() => {
  const container = useRef<HTMLDivElement>(null);
  const [isDarkMode, setIsDarkMode] = useState(document.documentElement.classList.contains('dark'));
  
  useEffect(() => {
    // Listen for theme changes on document element
    const observer = new MutationObserver(() => {
      const isDark = document.documentElement.classList.contains('dark');
      setIsDarkMode(isDark);
    });
    
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!container.current) return;
    
    // Clear previous widget
    container.current.innerHTML = '';
    const widgetSub = document.createElement("div");
    widgetSub.className = "tradingview-widget-container__widget h-full w-full";
    container.current.appendChild(widgetSub);
    
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-timeline.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      "feedMode": "all_symbols",
      "isTransparent": true,
      "displayMode": "regular",
      "width": "100%",
      "height": "100%",
      "colorTheme": isDarkMode ? "dark" : "light",
      "locale": "en"
    });
    container.current.appendChild(script);
    
    return () => { if(container.current) container.current.innerHTML = ''; };
  }, [isDarkMode]);

  return (
    <div className="tradingview-widget-container h-full w-full rounded-xl overflow-hidden border border-border bg-surface" ref={container}>
      <div className="tradingview-widget-container__widget h-full w-full"></div>
    </div>
  );
});

