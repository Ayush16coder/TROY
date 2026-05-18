"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface PremiumIconProps {
  icon: LucideIcon;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  variant?: "primary" | "secondary" | "accent" | "destructive" | "ghost";
}

const sizeConfig = {
  sm: { container: "w-8 h-8 rounded-lg", icon: "w-4 h-4" },
  md: { container: "w-10 h-10 rounded-xl", icon: "w-5 h-5" },
  lg: { container: "w-12 h-12 rounded-2xl", icon: "w-6 h-6" },
  xl: { container: "w-16 h-16 rounded-[1.25rem]", icon: "w-8 h-8" },
};

const variantConfig = {
  primary: "bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_rgba(var(--primary),0.2)] hover:shadow-[0_0_25px_rgba(var(--primary),0.4)]",
  secondary: "bg-secondary text-secondary-foreground border border-border hover:bg-secondary/80",
  accent: "bg-background text-foreground border border-border hover:border-foreground/20 shadow-sm",
  destructive: "bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive/20",
  ghost: "bg-transparent text-muted-foreground hover:bg-secondary hover:text-foreground",
};

export function PremiumIcon({ icon: Icon, size = "md", variant = "secondary", className }: PremiumIconProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "relative flex items-center justify-center transition-colors duration-300",
        sizeConfig[size].container,
        variantConfig[variant],
        className
      )}
    >
      <Icon className={cn(sizeConfig[size].icon, "transition-colors duration-300")} strokeWidth={1.5} />
      
      {/* Subtle inner reflection for 3D depth */}
      <div className="absolute inset-0 rounded-inherit border-t border-white/10 pointer-events-none mix-blend-overlay" style={{ borderRadius: "inherit" }} />
    </motion.div>
  );
}
