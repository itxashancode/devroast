"use client";

import { useEffect, useRef, useState } from "react";
import { prepare, layout } from "@chenglou/pretext";

interface RoastCardProps {
  roast: string;
  username: string;
}

export default function RoastCard({ roast, username }: RoastCardProps) {
  const containerRef = useRef<HTMLParagraphElement>(null);
  const [displayedText, setDisplayedText] = useState("");
  const [targetHeight, setTargetHeight] = useState<number | undefined>(undefined);
  
  // 1. Calculate the exact height needed using pretext
  useEffect(() => {
    if (!containerRef.current) return;
    const p = containerRef.current;
    
    // Get actual computed font string
    const comp = window.getComputedStyle(p);
    const font = comp.font || `${comp.fontWeight} ${comp.fontSize} ${comp.fontFamily}`;
    
    // Calculate line height in pixels
    let lineHeight = parseFloat(comp.lineHeight);
    if (isNaN(lineHeight)) {
      // Fallback if line-height is "normal"
      lineHeight = parseFloat(comp.fontSize) * 1.85; 
    }
    
    // Prepare text via pretext's Canvas measurement
    const prepared = prepare(roast, font);
    
    // Use ResizeObserver to recalculate if the container resizes (e.g. rotating a phone)
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;
        if (width > 0) {
          // layout() arithmetic is lightning fast and prevents DOM thrashing
          const metrics = layout(prepared, width, lineHeight);
          // Add a tiny buffer (2px) to prevent sub-pixel clipping on certain fonts
          setTargetHeight(metrics.height + 2);
        }
      }
    });
    
    resizeObserver.observe(p);
    return () => resizeObserver.disconnect();
  }, [roast]);

  // 2. Typewriter streaming effect
  useEffect(() => {
    let index = 0;
    setDisplayedText(""); // Reset when new roast comes in
    
    // Reveal 1 character every 12ms for a fast, snappy typing feel
    const interval = setInterval(() => {
      if (index < roast.length) {
        setDisplayedText(roast.substring(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 12);
    
    return () => clearInterval(interval);
  }, [roast]);

  return (
    <div className="relative flex flex-col gap-4 h-full">
      {/* Decorative quote mark */}
      <div
        aria-hidden="true"
        className="absolute -top-2 -left-1 text-7xl font-serif leading-none select-none pointer-events-none"
        style={{ color: "rgba(168,85,247,0.15)", fontFamily: "Georgia, serif" }}
      >
        &ldquo;
      </div>

      {/* Roast text — locked height ensures zero layout shift while typing! */}
      <p 
        ref={containerRef}
        className="pl-4 text-lg sm:text-xl leading-[1.85] tracking-[-0.01em] text-text-primary relative z-10 font-[450] flex-1"
        style={{ height: targetHeight ? `${targetHeight}px` : "auto" }}
      >
        {displayedText}
        {displayedText.length < roast.length && (
          <span className="inline-block w-1.5 h-[1.1em] ml-1 bg-accent/80 animate-pulse align-middle" />
        )}
      </p>

      {/* Attribution row */}
      <div className="flex items-center gap-3 pt-2 border-t border-border mt-auto">
        {/* Accent bar */}
        <div className="h-4 w-0.5 rounded-full gradient-accent-secondary shrink-0" />
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-[0.12em] text-text-muted font-semibold">AI Roast by</span>
          <span className="font-mono text-sm font-semibold text-accent-secondary">
            @{username}
          </span>
        </div>
        <div className="ml-auto">
          <span className="badge">llama-3.3-70b</span>
        </div>
      </div>
    </div>
  );
}
