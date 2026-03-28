import React, { useEffect, useRef, memo } from 'react';

export const TradingViewTimelineNews = memo(() => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;
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
      "colorTheme": "dark",
      "locale": "en"
    });
    container.current.appendChild(script);
    return () => { if(container.current) container.current.innerHTML = ''; };
  }, []);

  return (
    <div className="tradingview-widget-container h-full w-full rounded-xl overflow-hidden border border-border bg-surface" ref={container}>
      <div className="tradingview-widget-container__widget h-full w-full"></div>
    </div>
  );
});

