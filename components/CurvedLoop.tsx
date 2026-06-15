"use client";

/**
 * CurvedLoop
 * ───────────
 * An infinitely scrolling marquee text rendered along a curved SVG path.
 * Integrates with the DevRoast design system (Tailwind v4 tokens in globals.css).
 *
 * Props
 * ─────
 * marqueeText   Text to repeat along the curve.                  Default: "React Bits ✦"
 * speed         Scroll speed multiplier (higher = faster).        Default: 2
 * curveAmount   Vertical curvature magnitude (px, Bezier peak).   Default: 400
 * direction     "left" (default) | "right"
 * interactive   Pointer warp effect.                              Default: true
 * className     Extra Tailwind / global classes on the text fill. Default: ""
 *
 * Zero new dependencies — uses only React hooks and the SVG textPath API.
 * GSAP (already installed) is not used; animation is pure CSS + rAF.
 */

import {
  useRef,
  useEffect,
  useCallback,
  useId,
  type CSSProperties,
} from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface CurvedLoopProps {
  marqueeText?: string;
  speed?: number;
  curveAmount?: number;
  direction?: "left" | "right";
  interactive?: boolean;
  className?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Build a valley-shaped curve that dips in the center. */
function makePath(width: number, curve: number): string {
  const startY = 80;
  const bottomY = Math.max(startY + 40, curve);
  
  // Left curve starts high, slopes down to flat center section
  const cp1x = width * 0.16;
  const cp2x = width * 0.30;
  
  // Right curve slopes back up to high right side
  const cp3x = width * 0.70;
  const cp4x = width * 0.84;

  return `M 0,${startY} C ${cp1x},${startY} ${cp2x},${bottomY} ${width * 0.33},${bottomY} L ${width * 0.67},${bottomY} C ${cp3x},${bottomY} ${cp4x},${startY} ${width},${startY}`;
}

/**
 * Repeat the text enough times so that the path length is always
 * fully covered for continuous loop.
 */
function repeat(text: string, n = 12): string {
  return Array.from({ length: n }, () => text).join("  ");
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CurvedLoop({
  marqueeText = "React Bits ✦",
  speed = 2,
  curveAmount = 400,
  direction = "left",
  interactive = true,
  className = "",
}: CurvedLoopProps) {
  // Unique IDs so multiple instances on the same page don't collide
  const uid = useId().replace(/:/g, "");
  const pathId1 = `clp1-${uid}`;
  const pathId2 = `clp2-${uid}`;

  const svgRef = useRef<SVGSVGElement>(null);
  const pathEl1 = useRef<SVGPathElement>(null);
  const pathEl2 = useRef<SVGPathElement>(null);
  // Extra curve offset driven by pointer — lives in a ref to avoid re-renders
  const extraCurve = useRef(0);
  const animRaf = useRef<number | null>(null);

  // ── Redraw paths ───────────────────────────────────────────────────────────
  const redraw = useCallback(() => {
    const svg = svgRef.current;
    if (!svg) return;
    // Use the actual rendered width (viewBox is 1000-unit wide, but we want
    // the path to span the full viewBox so it fills edge-to-edge)
    const d = makePath(1000, curveAmount + extraCurve.current);
    pathEl1.current?.setAttribute("d", d);
    pathEl2.current?.setAttribute("d", d);
  }, [curveAmount]);

  // Initial draw + resize
  useEffect(() => {
    redraw();
    const ro = new ResizeObserver(redraw);
    if (svgRef.current) ro.observe(svgRef.current);
    return () => ro.disconnect();
  }, [redraw]);

  // ── Interactive pointer warp ───────────────────────────────────────────────
  useEffect(() => {
    if (!interactive) return;

    const svg = svgRef.current;
    if (!svg) return;

    const onMove = (e: PointerEvent) => {
      const rect = svg.getBoundingClientRect();
      const yNorm = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
      // Map 0..1 → ±20 % of curveAmount
      const target = (yNorm - 0.5) * curveAmount * 0.4;

      if (animRaf.current !== null) cancelAnimationFrame(animRaf.current);

      const lerp = () => {
        const delta = target - extraCurve.current;
        extraCurve.current += delta * 0.1;
        redraw();
        if (Math.abs(delta) > 0.3) {
          animRaf.current = requestAnimationFrame(lerp);
        }
      };
      animRaf.current = requestAnimationFrame(lerp);
    };

    const onLeave = () => {
      if (animRaf.current !== null) cancelAnimationFrame(animRaf.current);
      const ease = () => {
        extraCurve.current *= 0.88;
        redraw();
        if (Math.abs(extraCurve.current) > 0.3) {
          animRaf.current = requestAnimationFrame(ease);
        } else {
          extraCurve.current = 0;
          redraw();
        }
      };
      animRaf.current = requestAnimationFrame(ease);
    };

    svg.addEventListener("pointermove", onMove);
    svg.addEventListener("pointerleave", onLeave);

    return () => {
      svg.removeEventListener("pointermove", onMove);
      svg.removeEventListener("pointerleave", onLeave);
      if (animRaf.current !== null) cancelAnimationFrame(animRaf.current);
    };
  }, [interactive, curveAmount, redraw]);

  // ── Derived values ─────────────────────────────────────────────────────────
  const durationSec = Math.max(1, 30 / Math.max(0.1, speed));
  const isRight = direction === "right";
  const repeatedText = repeat(marqueeText);
  const svgHeight = Math.max(60, Math.abs(curveAmount) + 80);

  // CSS custom property–based duration so the <style> block is static
  const wrapperStyle: CSSProperties = {
    ["--cl-dur" as string]: `${durationSec}s`,
  };

  return (
    <div
      style={wrapperStyle}
      className="w-full overflow-hidden"
      role="marquee"
      aria-label={marqueeText}
    >
      {/*
       * We inject a scoped @keyframes block inline. This is the same pattern
       * used by several React animation primitives (e.g. Framer Motion's
       * spring serialiser). It is SSR-safe because it only touches CSS, not
       * the DOM directly.
       *
       * The keyframes animate `startOffset` from 0% → -100% so the text
       * scrolls leftward (or the reverse for "right" direction).
       * Using two <textPath> nodes staggered 100% apart produces a seamless
       * infinite loop with zero JS per frame.
       */}
      <style>{`
        @keyframes cl-scroll-left  { from { startOffset:   0%; } to { startOffset: -100%; } }
        @keyframes cl-scroll-right { from { startOffset: -100%; } to { startOffset:   0%;  } }
        .cl-tp-a {
          animation: ${isRight ? "cl-scroll-right" : "cl-scroll-left"}
                     var(--cl-dur) linear infinite;
        }
        .cl-tp-b {
          animation: ${isRight ? "cl-scroll-right" : "cl-scroll-left"}
                     var(--cl-dur) linear infinite;
          /* Stagger by exactly half the duration for a seamless join */
          animation-delay: calc(var(--cl-dur) * -0.5);
        }
      `}</style>

      <svg
        ref={svgRef}
        aria-hidden="true"
        className="w-full overflow-visible"
        style={{
          height: svgHeight,
          cursor: interactive ? "crosshair" : undefined,
        }}
        viewBox={`0 0 1000 ${svgHeight}`}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <path ref={pathEl1} id={pathId1} />
          <path ref={pathEl2} id={pathId2} />
        </defs>

        {/* Group A — starts at 0 % */}
        <text>
          <textPath
            href={`#${pathId1}`}
            className={`cl-tp-a fill-current text-sm font-semibold tracking-widest select-none pointer-events-none ${className}`}
            startOffset="0%"
          >
            {repeatedText}
          </textPath>
        </text>

        {/* Group B — starts at 100 % (half-cycle stagger via animation-delay) */}
        <text>
          <textPath
            href={`#${pathId2}`}
            className={`cl-tp-b fill-current text-sm font-semibold tracking-widest select-none pointer-events-none ${className}`}
            startOffset="100%"
          >
            {repeatedText}
          </textPath>
        </text>
      </svg>
    </div>
  );
}
