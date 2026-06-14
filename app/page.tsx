"use client";

import { useState, type FormEvent, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";

export default function Home() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
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
        className="relative z-10 flex flex-col items-center gap-8 text-center"
      >
        {/* Animated Badge */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
          className="badge backdrop-blur-md bg-surface-2/40 border-accent/20 cursor-default select-none hover:border-accent/40 hover:bg-surface-2/60 transition-colors"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
          Devlynix Buildathon 2.0 · Track 5
        </motion.div>

        {/* Headline */}
        <div className="flex flex-col gap-3">
          <motion.h1 
            initial={{ filter: "blur(8px)", opacity: 0 }}
            animate={{ filter: "blur(0px)", opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-6xl font-black tracking-tighter sm:text-7xl bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-400 select-none"
          >
            devroast<span className="text-accent">.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg font-mono text-text-secondary tracking-widest uppercase"
          >
            GitHub Developer Report Card
          </motion.p>
        </div>

        {/* Descriptor */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="max-w-md text-sm leading-relaxed text-text-muted/90"
        >
          Enter a GitHub username. We fetch their live public data, run it
          through our scoring engine, and generate a{" "}
          <span className="text-text-primary font-medium hover:text-accent transition-colors">brutally honest AI roast</span>{" "}
          grounded in real metrics.
        </motion.p>

        {/* Form Card Container */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, type: "spring", stiffness: 80 }}
          className="w-full max-w-md p-6 rounded-2xl border border-border/80 bg-surface/50 backdrop-blur-xl shadow-2xl relative group"
        >
          {/* Subtle gradient border highlight on group hover */}
          <div className="absolute inset-0 rounded-2xl border border-accent/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none duration-500" />
          
          <form
            onSubmit={handleSubmit}
            className="flex w-full flex-col gap-3 sm:flex-row"
          >
            <div className="relative flex-1">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted font-mono text-sm select-none">
                @
              </span>
              <input
                id="username-input"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.replace(/\s/g, ""))}
                placeholder="github-username"
                aria-label="GitHub username"
                className="w-full rounded-xl border border-border/60 bg-surface-2/60 py-3 pl-8 pr-4 text-sm text-text-primary placeholder:text-text-muted focus:border-accent/80 focus:bg-surface-2 focus:outline-none focus:ring-1 focus:ring-accent transition-all duration-300"
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
              className="rounded-xl gradient-accent px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40 shadow-lg shadow-accent/20 cursor-pointer flex items-center justify-center min-w-[100px]"
            >
              {loading ? (
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-white animate-bounce" style={{animationDelay:"0ms"}} />
                  <span className="h-1.5 w-1.5 rounded-full bg-white animate-bounce" style={{animationDelay:"150ms"}} />
                  <span className="h-1.5 w-1.5 rounded-full bg-white animate-bounce" style={{animationDelay:"300ms"}} />
                </span>
              ) : (
                "Scan Profile"
              )}
            </motion.button>
          </form>
        </motion.div>

        {/* Stats Row */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex flex-wrap justify-center items-center gap-4 text-xs text-text-muted font-mono"
        >
          <span className="flex items-center gap-1.5 hover:text-accent transition-colors duration-200">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Live GitHub API
          </span>
          <span className="h-3 w-px bg-border" />
          <span className="flex items-center gap-1.5 hover:text-accent transition-colors duration-200">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Scoring Engine
          </span>
          <span className="h-3 w-px bg-border" />
          <span className="flex items-center gap-1.5 hover:text-accent transition-colors duration-200">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Brutal LLM Roast
          </span>
        </motion.div>

        <motion.a
          href="/leaderboard"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          whileHover={{ scale: 1.05 }}
          className="text-sm font-medium text-text-secondary hover:text-accent underline underline-offset-4 decoration-border hover:decoration-accent/60 transition-all duration-200 cursor-pointer"
        >
          View Leaderboard
        </motion.a>
      </motion.div>
    </div>
  );
}
