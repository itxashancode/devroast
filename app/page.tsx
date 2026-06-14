"use client";

import { useState, type FormEvent, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";

const SAMPLE_ROASTS = [
  "\"A solid 10x developer... if x is the number of unresolved merge conflicts.\"",
  "\"Your most used language is YAML. You're not a developer, you're a config file.\"",
  "\"500 stars? Nice. Too bad 499 are on an awesome-list of other people's work.\"",
  "\"Your commit history looks like a heart monitor for someone flatlining.\""
];

export default function Home() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [roastIndex, setRoastIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = username.trim();
    if (!trimmed) return;

    setLoading(true);
    router.push(`/report/${encodeURIComponent(trimmed)}`);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setRoastIndex((prev) => (prev + 1) % SAMPLE_ROASTS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Subtle background spotlight tracking mouse
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current || !glowRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      gsap.to(glowRef.current, {
        x: x - 150,
        y: y - 150,
        duration: 0.6,
        ease: "power2.out",
        opacity: 0.15,
      });
    };

    const handleMouseLeave = () => {
      if (!glowRef.current) return;
      gsap.to(glowRef.current, {
        opacity: 0,
        duration: 0.6,
      });
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
      container.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      if (container) {
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative mx-auto flex min-h-[82vh] max-w-4xl flex-col items-center justify-center px-4 overflow-hidden rounded-3xl"
    >
      {/* GSAP Cursor Glow Spotlight */}
      <div 
        ref={glowRef}
        className="pointer-events-none absolute h-[300px] w-[300px] rounded-full bg-accent blur-[120px] opacity-0 transition-opacity"
        style={{ mixBlendMode: "screen" }}
      />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 flex w-full flex-col items-center gap-8 text-center"
      >
        {/* Headline */}
        <div className="flex flex-col gap-3 mt-8">
          <motion.h1 
            initial={{ filter: "blur(8px)", opacity: 0 }}
            animate={{ filter: "blur(0px)", opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-5xl font-black tracking-tighter sm:text-6xl lg:text-7xl text-gradient select-none"
          >
            devroast<span className="text-accent">.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-sm font-mono text-text-secondary tracking-[0.22em] uppercase"
          >
            GitHub Developer Report Card
          </motion.p>
        </div>

        {/* Descriptor */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="max-w-md text-sm leading-relaxed text-text-muted/90"
        >
          Enter a GitHub username. We fetch their live public data, run it
          through our scoring engine, and generate a{" "}
          <span className="text-text-primary font-medium hover:text-accent transition-colors">brutally honest AI roast</span>{" "}
          grounded in real metrics.
        </motion.p>

        {/* Form Area with Faded Roast Quote Behind */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 80 }}
          className="relative w-full max-w-lg mt-4"
        >
          {/* Rotating Faded Quote */}
          <div className="absolute -top-10 inset-x-0 flex justify-center pointer-events-none select-none overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={roastIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 0.4, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
                className="text-accent-secondary font-mono text-xs sm:text-sm italic text-center w-full max-w-[90%] whitespace-nowrap overflow-hidden text-ellipsis blur-[0.5px]"
              >
                {SAMPLE_ROASTS[roastIndex]}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Form Card Container */}
          <div className="w-full p-2 sm:p-3 rounded-2xl border border-border/80 bg-surface-header/90 backdrop-blur-xl shadow-2xl relative group mt-4">
            <form
              onSubmit={handleSubmit}
              className="flex w-full flex-col gap-3 sm:flex-row"
            >
              <div className="relative flex-1">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted font-mono text-sm select-none">
                  @
                </span>
                <input
                  id="username-input"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.replace(/\s/g, ""))}
                  placeholder="github-username"
                  aria-label="GitHub username"
                  className="w-full h-full rounded-xl border-2 border-border/60 bg-surface py-3 pl-9 pr-4 text-sm sm:text-base font-medium text-text-primary placeholder:text-text-muted/60 focus:border-accent focus:bg-surface-hover focus:outline-none focus:ring-4 focus:ring-accent/10 transition-all duration-300"
                  disabled={loading}
                  autoFocus
                  autoComplete="off"
                  spellCheck={false}
                />
              </div>
              <motion.button
                type="submit"
                id="scan-button"
                disabled={loading || !username.trim()}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="rounded-xl bg-accent px-8 py-3 text-sm sm:text-base font-bold text-surface transition-all duration-300 hover:bg-accent-hover hover:shadow-[0_0_24px_rgba(46,217,160,0.5)] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:shadow-none cursor-pointer flex items-center justify-center min-w-[140px] shadow-[0_0_12px_rgba(46,217,160,0.3)]"
              >
                {loading ? (
                  <div className="loader" />
                ) : (
                  "Scan Profile"
                )}
              </motion.button>
            </form>
          </div>
        </motion.div>

        {/* Feature Cards Row */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-3 sm:gap-4 mt-6 w-full max-w-2xl"
        >
          <div className="flex items-center gap-2.5 px-4 py-2 rounded-lg bg-surface border border-border">
            <span className="text-accent text-lg leading-none">⚡</span>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary">Live GitHub API</span>
          </div>
          <div className="flex items-center gap-2.5 px-4 py-2 rounded-lg bg-surface border border-border">
            <span className="text-yellow-500 text-lg leading-none">🎯</span>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary">Scoring Engine</span>
          </div>
          <div className="flex items-center gap-2.5 px-4 py-2 rounded-lg bg-surface border border-border">
            <span className="text-accent-secondary text-lg leading-none">🔥</span>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary">Brutal LLM Roast</span>
          </div>
        </motion.div>

        <motion.a
          href="/leaderboard"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.05 }}
          className="mt-4 text-sm font-semibold text-text-secondary hover:text-accent flex items-center gap-2 group transition-colors duration-200 cursor-pointer"
        >
          View Leaderboard
          <span className="transform group-hover:translate-x-1 transition-transform">→</span>
        </motion.a>
      </motion.div>
    </div>
  );
}
