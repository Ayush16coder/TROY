"use client";

import * as React from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const CYCLE = ["light", "dark", "system"] as const;

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className={cn("w-8 h-8 rounded-lg bg-secondary/50 animate-pulse", className)} />;
  }

  const cycleTheme = () => {
    document.documentElement.classList.add("transition-theme");
    const idx = CYCLE.indexOf((theme as typeof CYCLE[number]) ?? "system");
    setTheme(CYCLE[(idx + 1) % CYCLE.length]);
    setTimeout(() => document.documentElement.classList.remove("transition-theme"), 300);
  };

  const Icon =
    theme === "system" ? Monitor : resolvedTheme === "dark" ? Moon : Sun;

  return (
    <button
      onClick={cycleTheme}
      className={cn(
        "relative w-8 h-8 flex items-center justify-center rounded-lg",
        "hover:bg-secondary border border-transparent hover:border-border transition-colors",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 overflow-hidden",
        className
      )}
      aria-label={`Theme: ${theme}. Click to cycle.`}
      title={`Theme: ${theme}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme ?? "light"}
          initial={{ y: 12, opacity: 0, rotate: -20 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: -12, opacity: 0, rotate: 20 }}
          transition={{ duration: 0.18 }}
          className="flex items-center justify-center"
        >
          <Icon className="w-4 h-4 text-muted-foreground" strokeWidth={1.75} />
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
