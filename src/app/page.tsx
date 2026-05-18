"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import {
  GitBranch,
  Zap,
  Shield,
  Activity,
  ArrowRight,
  Terminal,
  Globe,
  Cpu,
  ChevronRight,
  Command,
  Database,
  Cloud,
  Layers,
  Code2
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { ThemeToggle } from "@/components/theme-toggle";

// --- NAVBAR COMPONENT ---
function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-background/80 backdrop-blur-md border-b border-border" 
          : "bg-transparent border-transparent"
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-7 h-7 rounded-lg bg-foreground text-background flex items-center justify-center shadow-lg transition-transform group-hover:scale-105">
              <Zap className="w-4 h-4" fill="currentColor" />
            </div>
            <span className="font-semibold text-foreground tracking-tight text-sm">NexusForge</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {["Platform", "Infrastructure", "Changelog", "Docs"].map((item) => (
              <Link 
                key={item} 
                href="#" 
                className="text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {item}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-secondary border border-border text-[11px] text-muted-foreground font-mono tracking-wide">
            <Command className="w-3 h-3" /> K
            <span className="ml-1 text-muted-foreground/70">to search</span>
          </div>
          
          <div className="h-4 w-px bg-border hidden sm:block" />

          <ThemeToggle />

          <Link 
            href="/auth/login" 
            className="text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
          >
            Log in
          </Link>
          <Link 
            href="/auth/register" 
            className="h-8 inline-flex items-center justify-center px-4 rounded-md bg-foreground hover:bg-foreground/90 text-background text-[13px] font-semibold transition-all shadow-md hover:scale-105"
          >
            Deploy Now
          </Link>
        </div>
      </div>
    </motion.header>
  );
}

// --- TOPOLOGY VISUALIZATION COMPONENT ---
function InfrastructureTopology() {
  return (
    <div className="relative w-full aspect-square md:aspect-auto md:h-[600px] flex items-center justify-center perspective-1000">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background/0 to-transparent blur-2xl" />
      
      {/* Central Orchestrator */}
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-20 w-24 h-24 rounded-2xl bg-card border border-primary/30 flex items-center justify-center shadow-[0_0_40px_rgba(var(--primary),0.15)]"
      >
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/10 to-transparent" />
        <Cpu className="w-8 h-8 text-primary" />
        
        {/* Pulse rings */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-2xl border border-primary/20"
            animate={{ scale: [1, 2.5], opacity: [0.8, 0] }}
            transition={{ duration: 3, repeat: Infinity, delay: i * 1, ease: "linear" }}
          />
        ))}
      </motion.div>

      {/* Connection Lines (SVG) */}
      <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none" style={{ filter: "drop-shadow(0 0 4px rgba(var(--foreground),0.1))" }}>
        <motion.path 
          d="M 20% 20% Q 50% 20% 50% 50%" 
          fill="none" 
          stroke="var(--border)" 
          strokeWidth="1.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
        <motion.path 
          d="M 80% 20% Q 50% 20% 50% 50%" 
          fill="none" 
          stroke="var(--border)" 
          strokeWidth="1.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
        <motion.path 
          d="M 20% 80% Q 50% 80% 50% 50%" 
          fill="none" 
          stroke="var(--border)" 
          strokeWidth="1.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
        <motion.path 
          d="M 80% 80% Q 50% 80% 50% 50%" 
          fill="none" 
          stroke="var(--border)" 
          strokeWidth="1.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />

        {/* Animated Data Packets */}
        <motion.circle r="3" fill="var(--primary)" style={{ filter: "blur(1px)" }}>
          <animateMotion dur="2s" repeatCount="indefinite" path="M 20% 20% Q 50% 20% 50% 50%" />
        </motion.circle>
        <motion.circle r="3" fill="#8b5cf6" style={{ filter: "blur(1px)" }}>
          <animateMotion dur="2.5s" repeatCount="indefinite" path="M 80% 20% Q 50% 20% 50% 50%" />
        </motion.circle>
        <motion.circle r="3" fill="#10b981" style={{ filter: "blur(1px)" }}>
          <animateMotion dur="1.8s" repeatCount="indefinite" path="M 20% 80% Q 50% 80% 50% 50%" />
        </motion.circle>
        <motion.circle r="3" fill="#f59e0b" style={{ filter: "blur(1px)" }}>
          <animateMotion dur="3s" repeatCount="indefinite" path="M 80% 80% Q 50% 80% 50% 50%" />
        </motion.circle>
      </svg>

      {/* Provider Nodes */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="absolute top-[10%] left-[10%] w-14 h-14 rounded-xl bg-card border border-border flex items-center justify-center shadow-xl hover:scale-110 transition-transform"
      >
        <GitBranch className="w-6 h-6 text-foreground" />
        <div className="absolute -bottom-6 text-[10px] font-mono text-muted-foreground">GITHUB_WEBHOOK</div>
      </motion.div>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="absolute top-[10%] right-[10%] w-14 h-14 rounded-xl bg-foreground border border-border flex items-center justify-center shadow-xl hover:scale-110 transition-transform"
      >
        <Zap className="w-6 h-6 text-background" fill="currentColor" />
        <div className="absolute -bottom-6 text-[10px] font-mono text-muted-foreground">VERCEL_EDGE</div>
      </motion.div>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="absolute bottom-[10%] left-[10%] w-14 h-14 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shadow-xl hover:scale-110 transition-transform"
      >
        <Database className="w-6 h-6 text-emerald-500" />
        <div className="absolute -top-6 text-[10px] font-mono text-emerald-500">SUPABASE_DB</div>
      </motion.div>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="absolute bottom-[10%] right-[10%] w-14 h-14 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shadow-xl hover:scale-110 transition-transform"
      >
        <Code2 className="w-6 h-6 text-violet-500" />
        <div className="absolute -top-6 text-[10px] font-mono text-violet-500">AI_ORCHESTRATOR</div>
      </motion.div>

    </div>
  );
}

// --- MAIN PAGE ---
export default function LandingPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans overflow-x-hidden">
      <Navbar />

      {/* --- HERO SECTION --- */}
      <section ref={containerRef} className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden border-b border-border">
        {/* Deep Background Noise & Grid */}
        <div className="absolute inset-0 noise-overlay" />
        <div 
          className="absolute inset-0 pointer-events-none infra-grid" 
          style={{ maskImage: 'radial-gradient(circle at center, black 0%, transparent 80%)' }}
        />

        <motion.div 
          style={{ y, opacity }}
          className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center"
        >
          {/* Hero Left: Copy & CTA */}
          <div className="relative z-10 max-w-2xl">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary border border-border mb-8 shadow-sm"
            >
              <span className="flex w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-mono tracking-wide text-muted-foreground">NEXUS_ENGINE_v2.0_ONLINE</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-5xl sm:text-6xl lg:text-[72px] font-medium tracking-tight text-foreground leading-[1.05] mb-6"
            >
              Orchestrate the <br className="hidden sm:block"/>
              <span className="text-muted-foreground">infrastructure layer.</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-lg text-muted-foreground mb-10 leading-relaxed max-w-xl font-light"
            >
              A unified operating system for elite engineering teams. Synchronize GitHub, Vercel, and Supabase instantly with embedded AI orchestration and realtime deployment topology.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col sm:flex-row items-center gap-4"
            >
              <Link 
                href="/auth/register"
                className="w-full sm:w-auto h-12 inline-flex items-center justify-center gap-2 px-8 rounded-lg bg-foreground text-background font-medium hover:scale-[0.98] transition-transform shadow-lg shadow-primary/20"
              >
                Start Deploying <ArrowRight className="w-4 h-4" />
              </Link>
              <Link 
                href="#architecture"
                className="w-full sm:w-auto h-12 inline-flex items-center justify-center gap-2 px-8 rounded-lg bg-secondary border border-border text-foreground font-medium hover:bg-secondary/80 transition-colors shadow-sm"
              >
                Read Documentation
              </Link>
            </motion.div>
          </div>

          {/* Hero Right: Infrastructure Visualization */}
          <div className="relative z-10">
            <InfrastructureTopology />
          </div>
        </motion.div>
      </section>

      {/* --- ASYMMETRIC FEATURES SECTION --- */}
      <section className="py-32 relative">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="mb-24 max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-medium tracking-tight mb-4 text-foreground">Precision engineered for scale.</h2>
            <p className="text-muted-foreground text-lg font-light leading-relaxed">
              We replaced disjointed dashboards with a single, high-performance command center. Everything operates over secure WebSocket channels with deterministic state management.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Feature 1 (Large Asymmetric) */}
            <div className="md:col-span-8 group relative rounded-3xl bg-card border border-border p-8 md:p-12 overflow-hidden hover:border-foreground/20 transition-colors shadow-sm hover:shadow-md">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10 max-w-md">
                <div className="w-12 h-12 rounded-xl bg-secondary border border-border flex items-center justify-center mb-6 shadow-sm">
                  <Activity className="w-5 h-5 text-foreground" />
                </div>
                <h3 className="text-2xl font-medium mb-3 tracking-tight text-foreground">Realtime Synchronization Engine</h3>
                <p className="text-muted-foreground leading-relaxed font-light text-[15px]">
                  Bypass standard REST polling. Our architecture leverages native PostgreSQL Logical Replication and Supabase Realtime to push deployment states to the client in &lt;50ms.
                </p>
              </div>
              
              {/* Decorative visual */}
              <div className="absolute right-0 bottom-0 w-2/3 h-2/3 opacity-20 pointer-events-none translate-x-1/4 translate-y-1/4">
                 <div className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/30 to-transparent blur-3xl" />
              </div>
            </div>

            {/* Feature 2 (Small Vertical) */}
            <div className="md:col-span-4 group relative rounded-3xl bg-card border border-border p-8 overflow-hidden hover:border-foreground/20 transition-colors shadow-sm hover:shadow-md">
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-secondary border border-border flex items-center justify-center mb-6 shadow-sm">
                  <Terminal className="w-5 h-5 text-foreground" />
                </div>
                <h3 className="text-xl font-medium mb-3 tracking-tight text-foreground">Live Log Streaming</h3>
                <p className="text-muted-foreground leading-relaxed font-light text-[15px]">
                  Terminal-grade log viewer that aggregates streams from Vercel, AWS, and Docker simultaneously into a single, filterable view.
                </p>
              </div>
            </div>

            {/* Feature 3 (Small Vertical) */}
            <div className="md:col-span-4 group relative rounded-3xl bg-card border border-border p-8 overflow-hidden hover:border-foreground/20 transition-colors shadow-sm hover:shadow-md">
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-secondary border border-border flex items-center justify-center mb-6 shadow-sm">
                  <Cpu className="w-5 h-5 text-foreground" />
                </div>
                <h3 className="text-xl font-medium mb-3 tracking-tight text-foreground">AI Orchestration</h3>
                <p className="text-muted-foreground leading-relaxed font-light text-[15px]">
                  Inject deployment logs directly into the context window of Claude 3.5 Sonnet or GPT-4o for autonomous triage and resolution.
                </p>
              </div>
            </div>

            {/* Feature 4 (Large Asymmetric) */}
            <div className="md:col-span-8 group relative rounded-3xl bg-card border border-border p-8 md:p-12 overflow-hidden hover:border-foreground/20 transition-colors shadow-sm hover:shadow-md">
               <div className="absolute inset-0 bg-gradient-to-tl from-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10 max-w-md">
                <div className="w-12 h-12 rounded-xl bg-secondary border border-border flex items-center justify-center mb-6 shadow-sm">
                  <Layers className="w-5 h-5 text-foreground" />
                </div>
                <h3 className="text-2xl font-medium mb-3 tracking-tight text-foreground">Multi-Provider Abstraction</h3>
                <p className="text-muted-foreground leading-relaxed font-light text-[15px]">
                  A unified API surface for heterogeneous infrastructure. Deploy the same codebase to Vercel, Railway, and Render concurrently with a single trigger event.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* --- FOOTER CTA --- */}
      <section className="py-32 relative border-t border-border overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-primary/5 via-background to-background pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-b from-secondary to-background border border-border mx-auto flex items-center justify-center mb-8 shadow-xl">
            <Zap className="w-8 h-8 text-foreground" />
          </div>
          <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-6 text-foreground">
            Ready to deploy?
          </h2>
          <p className="text-xl text-muted-foreground mb-10 font-light">
            Join the elite engineering teams building the future on NexusForge.
          </p>
          <Link 
            href="/auth/register"
            className="h-14 inline-flex items-center justify-center gap-2 px-10 rounded-xl bg-foreground text-background font-semibold hover:scale-[0.98] transition-transform shadow-xl shadow-primary/20"
          >
            Create Free Workspace <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer minimal */}
      <footer className="py-8 border-t border-border text-center">
        <p className="text-xs text-muted-foreground font-mono">© 2026 NexusForge Infrastructure. All rights reserved.</p>
      </footer>
    </div>
  );
}
