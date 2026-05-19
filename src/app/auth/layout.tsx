import { ReactNode } from "react";
import { AuthVisuals } from "@/components/auth/auth-visuals";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-white dark:bg-[#09090b] text-zinc-900 dark:text-white overflow-hidden relative transition-colors duration-300">
      {/* ── Global Decorative arcs ── */}
      <svg
        className="absolute pointer-events-none z-0"
        style={{ top: "50%", right: "-10%", transform: "translateY(-50%)", width: "120vw", height: "120vh", minWidth: 1000, minHeight: 1000 }}
        viewBox="0 0 1400 1400" fill="none"
      >
        <circle cx="700" cy="700" r="400" className="stroke-indigo-100 dark:stroke-indigo-900/30" strokeWidth="1.5" />
        <circle cx="700" cy="700" r="550" className="stroke-indigo-200/50 dark:stroke-indigo-800/30" strokeWidth="1.5" />
        <circle cx="700" cy="700" r="750" className="stroke-indigo-100 dark:stroke-indigo-900/30" strokeWidth="1.5" />
        <circle cx="700" cy="700" r="1000" className="stroke-indigo-50 dark:stroke-indigo-950/30" strokeWidth="1.5" />
      </svg>

      {/* Left – form */}
      <div className="flex-1 flex flex-col relative overflow-y-auto z-10 bg-transparent">
        {children}
      </div>
      {/* Right – dashboard preview */}
      <AuthVisuals />
    </div>
  );
}
