"use client";

import { motion } from "framer-motion";
import { Zap, GitBranch, Cpu, Shield, Globe, Terminal, Activity } from "lucide-react";
import { useEffect, useState } from "react";

export function AuthVisuals() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="hidden lg:flex flex-col justify-between w-[45%] max-w-[640px] bg-[#06080c] relative overflow-hidden border-r border-[#1e2d40]/50 p-12">
      {/* Abstract Animated Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ duration: 2 }}
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-[#06080c]/0 to-transparent blur-3xl"
        />
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 2, delay: 0.5 }}
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-violet-900/20 via-[#06080c]/0 to-transparent blur-3xl"
        />
      </div>
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02] mix-blend-overlay" />
      <div 
        className="absolute inset-0 pointer-events-none" 
        style={{
          backgroundImage: `linear-gradient(to right, #1e2d40 1px, transparent 1px), linear-gradient(to bottom, #1e2d40 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          opacity: 0.2,
          maskImage: 'linear-gradient(to bottom, black, transparent 80%)'
        }}
      />

      {/* Top Branding */}
      <div className="relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/20 ring-1 ring-white/10">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">NexusForge</span>
        </div>
      </div>

      {/* Animated Topology Graphic */}
      <div className="relative z-10 w-full aspect-square max-w-sm mx-auto my-auto flex items-center justify-center">
        {/* Core Node */}
        <motion.div 
          animate={{ boxShadow: ["0 0 0px 0px rgba(59, 130, 246, 0)", "0 0 40px 10px rgba(59, 130, 246, 0.2)", "0 0 0px 0px rgba(59, 130, 246, 0)"] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-24 h-24 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center backdrop-blur-md"
        >
          <Cpu className="w-8 h-8 text-blue-400" />
        </motion.div>

        {/* Orbit 1 */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute w-[240px] h-[240px] rounded-full border border-[#1e2d40] border-dashed"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-[#0d1421] border border-[#1e2d40] flex items-center justify-center shadow-lg">
            <GitBranch className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-10 h-10 rounded-xl bg-[#0d1421] border border-[#1e2d40] flex items-center justify-center shadow-lg">
            <Terminal className="w-4 h-4 text-zinc-400" />
          </div>
        </motion.div>

        {/* Orbit 2 */}
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute w-[360px] h-[360px] rounded-full border border-[#1e2d40]/50"
        >
          <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-xl bg-[#0d1421] border border-[#1e2d40] flex items-center justify-center shadow-lg shadow-violet-500/10 ring-1 ring-violet-500/20">
            <Globe className="w-5 h-5 text-violet-400" />
          </div>
          <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-xl bg-[#0d1421] border border-[#1e2d40] flex items-center justify-center shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-500/20">
            <Shield className="w-5 h-5 text-cyan-400" />
          </div>
        </motion.div>

        {/* Scanning Line */}
        <motion.div 
          animate={{ top: ["0%", "100%", "0%"] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"
        />
      </div>

      {/* Bottom Content */}
      <div className="relative z-10">
        <blockquote className="space-y-4">
          <p className="text-xl font-medium text-zinc-300 leading-snug">
            "NexusForge has fundamentally transformed how we deploy. It's the command center we didn't know we needed."
          </p>
          <footer className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#1e2d40] flex items-center justify-center">
              <span className="text-sm font-semibold text-white">S</span>
            </div>
            <div>
              <div className="text-sm font-medium text-white">Sarah Chen</div>
              <div className="text-xs text-zinc-500">VP of Engineering at CloudScale</div>
            </div>
          </footer>
        </blockquote>
      </div>
    </div>
  );
}
