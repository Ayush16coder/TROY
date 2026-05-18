"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import {
  Zap, Activity, ArrowRight, Terminal, Cpu, Command, Layers,
  Wand2, FolderOpen, MoveRight, Code2, GitMerge, Star, GitCommit,
  Search, Braces, CornerDownLeft, Box, Sliders
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { ProviderIcon, ProviderBadge, ProviderSlug, ProviderStatus } from "@/components/ui/provider-icon";

// ─── NAVBAR ───────────────────────────────────────────────────────────────────
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
        scrolled ? "bg-background/80 backdrop-blur-md border-b border-border" : "bg-transparent"
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
            {["Platform", "Integrations", "Changelog", "Docs"].map((item) => (
              <Link key={item} href="#" className="text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors">
                {item}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-secondary border border-border text-[11px] text-muted-foreground font-mono">
            <Command className="w-3 h-3" /> K
          </div>
          <div className="h-4 w-px bg-border hidden sm:block" />
          <ThemeToggle />
          <Link href="/auth/login" className="text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
            Log in
          </Link>
          <Link href="/auth/register" className="h-8 inline-flex items-center justify-center px-4 rounded-md bg-foreground hover:bg-foreground/90 text-background text-[13px] font-semibold transition-all shadow-md hover:scale-105">
            Deploy Now
          </Link>
        </div>
      </div>
    </motion.header>
  );
}

// ─── INFRASTRUCTURE TOPOLOGY (Real Brand Icons) ───────────────────────────────
function InfrastructureTopology() {
  const nodes: { provider: ProviderSlug; x: string; y: string; delay: number; label: string }[] = [
    { provider: "github",     x: "8%",  y: "10%", delay: 0.2, label: "SOURCE_CONTROL" },
    { provider: "vercel",     x: "74%", y: "10%", delay: 0.4, label: "EDGE_NETWORK"   },
    { provider: "supabase",   x: "8%",  y: "70%", delay: 0.6, label: "DATABASE"       },
    { provider: "docker",     x: "74%", y: "70%", delay: 0.8, label: "CONTAINERS"     },
    { provider: "gemini",     x: "42%", y: "2%",  delay: 0.3, label: "AI_LAYER"       },
    { provider: "cloudflare", x: "82%", y: "40%", delay: 0.7, label: "CDN"            },
  ];

  const paths = [
    { d: "M 15% 17% Q 48% 17% 50% 50%", color: "#ffffff", dur: "2.2s" },
    { d: "M 81% 17% Q 52% 17% 50% 50%", color: "#ffffff", dur: "2.8s" },
    { d: "M 15% 75% Q 48% 75% 50% 50%", color: "#3ecf8e", dur: "1.9s" },
    { d: "M 81% 75% Q 52% 75% 50% 50%", color: "#2496ed", dur: "3.1s" },
    { d: "M 50% 8% Q 50% 30% 50% 50%",  color: "#8ab4f8", dur: "2.5s" },
    { d: "M 87% 46% Q 68% 46% 50% 50%", color: "#f38020", dur: "2.0s" },
  ];

  return (
    <div className="relative w-full h-[480px] flex items-center justify-center select-none">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/8 via-transparent to-transparent blur-3xl pointer-events-none" />
      <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
        {paths.map((p, i) => (
          <motion.path key={i} d={p.d} fill="none" stroke="var(--border)"
            strokeWidth="1.5" strokeDasharray="6 4"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.4, delay: 0.3 + i * 0.1, ease: "easeOut" }}
          />
        ))}
        {paths.map(({ d, color, dur }, i) => (
          <motion.circle key={i} r="3" style={{ fill: color, filter: "blur(0.5px)" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}
          >
            <animateMotion dur={dur} repeatCount="indefinite" path={d} />
          </motion.circle>
        ))}
      </svg>

      {/* Central Orchestrator */}
      <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-20 w-20 h-20 rounded-2xl bg-card border border-border flex items-center justify-center shadow-xl"
      >
        <Cpu className="w-8 h-8 text-primary" strokeWidth={1.5} />
        {[0, 1, 2].map((i) => (
          <motion.div key={i} className="absolute inset-0 rounded-2xl border border-primary/30"
            animate={{ scale: [1, 2.8], opacity: [0.6, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, delay: i * 1.15, ease: "linear" }}
          />
        ))}
        <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-[9px] font-mono text-muted-foreground whitespace-nowrap">
          NEXUS_CORE
        </div>
      </motion.div>

      {nodes.map(({ provider, x, y, delay, label }) => (
        <motion.div key={provider} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
          className="absolute flex flex-col items-center gap-1.5" style={{ left: x, top: y }}
        >
          <ProviderIcon provider={provider} size="lg" status="connected" />
          <span className="text-[9px] font-mono text-muted-foreground">{label}</span>
        </motion.div>
      ))}
    </div>
  );
}

// ─── CONNECTED PLATFORMS MARQUEE ──────────────────────────────────────────────
// Matches the reference: dark rounded containers, colored SVG logos, status dots, labels below
const MARQUEE_PROVIDERS: { slug: ProviderSlug; status: ProviderStatus }[] = [
  { slug: "kubernetes", status: "connected" },
  { slug: "aws",        status: "connected" },
  { slug: "cloudflare", status: "connected" },
  { slug: "anthropic",  status: "connected" },
  { slug: "postgresql", status: "connected" },
  { slug: "redis",      status: "syncing"   },
  { slug: "sentry",     status: "idle"      },
  { slug: "stripe",     status: "connected" },
  { slug: "linear",     status: "idle"      },
  { slug: "github",     status: "connected" },
  { slug: "vercel",     status: "connected" },
  { slug: "supabase",   status: "connected" },
  { slug: "railway",    status: "deploying" },
  { slug: "docker",     status: "connected" },
  { slug: "netlify",    status: "idle"      },
  { slug: "discord",    status: "idle"      },
  { slug: "render",     status: "idle"      },
  { slug: "gemini",     status: "connected" },
];

function PlatformsMarquee() {
  const doubled = [...MARQUEE_PROVIDERS, ...MARQUEE_PROVIDERS];
  const [paused, setPaused] = useState(false);
  return (
    <div
      className="relative overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 45, repeat: Infinity, ease: "linear", repeatType: "loop" }}
        style={{ width: "max-content", animationPlayState: paused ? "paused" : "running" }}
        className="flex items-end gap-5 py-3"
      >
        {doubled.map(({ slug, status }, i) => (
          <motion.div
            key={`${slug}-${i}`}
            whileHover={{ y: -4, scale: 1.08 }}
            transition={{ type: "spring", stiffness: 420, damping: 16 }}
            className="flex-shrink-0"
          >
            <ProviderIcon
              provider={slug}
              size="md"
              status={status}
              showLabel
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

// ─── CAPABILITIES ROW (light circles with thin icons — image 2 reference) ─────
const CAPABILITIES = [
  { icon: Sliders,        label: "Orchestrate"  },
  { icon: Wand2,          label: "AI Triage"    },
  { icon: GitMerge,       label: "Merge Gate"   },
  { icon: FolderOpen,     label: "Workspaces"   },
  { icon: MoveRight,      label: "Pipelines"    },
  { icon: Code2,          label: "Code Scan"    },
  { icon: GitCommit,      label: "Commit Watch" },
  { icon: Star,           label: "Starlogs"     },
  { icon: GitCommit,      label: "Snapshots"    },
  { icon: Search,         label: "Log Search"   },
  { icon: Braces,         label: "Env Vars"     },
  { icon: CornerDownLeft, label: "Rollback"     },
  { icon: Box,            label: "Artifacts"    },
  { icon: Cpu,            label: "AI Agents"    },
];

function CapabilitiesRow() {
  const [paused, setPaused] = useState(false);
  return (
    <div
      className="relative overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

      <motion.div
        animate={{ x: ["-50%", "0%"] }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear", repeatType: "loop" }}
        style={{ width: "max-content", animationPlayState: paused ? "paused" : "running" }}
        className="flex items-center gap-5 py-4"
      >
        {[...CAPABILITIES, ...CAPABILITIES].map(({ icon: Icon, label }, i) => (
          <motion.div
            key={`${label}-${i}`}
            whileHover={{ y: -4, scale: 1.08 }}
            transition={{ type: "spring", stiffness: 420, damping: 16 }}
            className="flex flex-col items-center gap-2 cursor-default group flex-shrink-0"
          >
            <div className="w-14 h-14 rounded-full bg-secondary border border-border flex items-center justify-center shadow-sm group-hover:shadow-lg group-hover:border-foreground/30 transition-all duration-200">
              <Icon className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors duration-150" strokeWidth={1.5} />
            </div>
            <span className="text-[10px] font-medium text-muted-foreground group-hover:text-foreground transition-colors whitespace-nowrap">{label}</span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

// ─── MAIN PAGE ─────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />

      {/* HERO */}
      <section ref={containerRef} className="relative pt-36 pb-20 md:pt-52 md:pb-32 overflow-hidden border-b border-border">
        <div className="absolute inset-0 noise-overlay" />
        <div className="absolute inset-0 infra-grid pointer-events-none"
          style={{ maskImage: "radial-gradient(circle at 50% 40%, black 0%, transparent 75%)" }}
        />
        <motion.div style={{ y, opacity }}
          className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-0 items-center"
        >
          {/* Left */}
          <div className="max-w-xl">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary border border-border mb-8 text-[11px] font-mono text-muted-foreground"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              NEXUS_ENGINE_v2.0 — 18 providers online
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-5xl sm:text-6xl lg:text-[72px] font-medium tracking-tight leading-[1.04] mb-6"
            >
              Orchestrate the<br />
              <span className="text-muted-foreground">infrastructure layer.</span>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-lg text-muted-foreground mb-10 leading-relaxed font-light"
            >
              A unified operating system for elite engineering teams. Synchronize GitHub, Vercel, and Supabase instantly — with embedded AI orchestration and realtime deployment topology.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap items-center gap-4 mb-12"
            >
              <Link href="/auth/register"
                className="h-12 inline-flex items-center gap-2 px-8 rounded-lg bg-foreground text-background font-medium hover:scale-[0.98] transition-transform shadow-lg"
              >
                Start Deploying <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="#platforms"
                className="h-12 inline-flex items-center gap-2 px-8 rounded-lg bg-secondary border border-border font-medium hover:bg-secondary/70 transition-colors"
              >
                View Integrations
              </Link>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.6 }}
              className="flex flex-wrap gap-2"
            >
              {(["github", "vercel", "supabase", "docker", "anthropic"] as const).map((p) => (
                <ProviderBadge key={p} provider={p} />
              ))}
              <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-secondary border border-border text-[11px] font-medium text-muted-foreground">
                +13 more
              </span>
            </motion.div>
          </div>

          {/* Right: topology */}
          <div className="relative">
            <InfrastructureTopology />
          </div>
        </motion.div>
      </section>

      {/* CONNECTED PLATFORMS — matches reference image 1 */}
      <section id="platforms" className="py-12 border-b border-border">
        <div className="max-w-[1400px] mx-auto px-6 mb-5">
          <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.2em]">Connected Platforms</p>
        </div>
        <PlatformsMarquee />
      </section>

      {/* CAPABILITIES ROW — matches reference image 2 */}
      <section className="py-12 border-b border-border">
        <div className="max-w-[1400px] mx-auto px-6 mb-5">
          <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.2em]">Platform Capabilities</p>
        </div>
        <CapabilitiesRow />
      </section>

      {/* ASYMMETRIC FEATURES */}
      <section className="py-32">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="mb-20 max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-medium tracking-tight mb-4">Precision engineered for scale.</h2>
            <p className="text-muted-foreground text-lg font-light leading-relaxed">
              We replaced disjointed dashboards with a single, high-performance command center operating over secure WebSocket channels.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            <div className="md:col-span-8 group relative rounded-2xl bg-card border border-border p-8 md:p-12 overflow-hidden hover:border-foreground/20 transition-all shadow-sm hover:shadow-md">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/4 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-secondary border border-border flex items-center justify-center">
                    <Activity className="w-5 h-5 text-foreground" strokeWidth={1.5} />
                  </div>
                  <div className="flex items-center gap-2">
                    <ProviderIcon provider="supabase" size="sm" status="connected" />
                    <ProviderIcon provider="vercel"   size="sm" status="syncing"   />
                    <ProviderIcon provider="github"   size="sm" status="connected" />
                  </div>
                </div>
                <h3 className="text-2xl font-medium mb-3 tracking-tight">Realtime Synchronization Engine</h3>
                <p className="text-muted-foreground leading-relaxed font-light text-[15px] max-w-sm">
                  Bypass REST polling. Our architecture leverages PostgreSQL Logical Replication and Supabase Realtime to push deployment states in &lt;50ms.
                </p>
              </div>
            </div>

            <div className="md:col-span-4 group relative rounded-2xl bg-card border border-border p-8 overflow-hidden hover:border-foreground/20 transition-all shadow-sm hover:shadow-md">
              <div className="mb-6 flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-secondary border border-border flex items-center justify-center">
                  <Terminal className="w-5 h-5 text-foreground" strokeWidth={1.5} />
                </div>
                <ProviderIcon provider="docker" size="sm" status="connected" />
              </div>
              <h3 className="text-xl font-medium mb-3 tracking-tight">Live Log Streaming</h3>
              <p className="text-muted-foreground leading-relaxed font-light text-[15px]">
                Aggregate streams from Vercel, Docker, and AWS into one filterable terminal view.
              </p>
            </div>

            <div className="md:col-span-4 group relative rounded-2xl bg-card border border-border p-8 overflow-hidden hover:border-foreground/20 transition-all shadow-sm hover:shadow-md">
              <div className="mb-6 flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-secondary border border-border flex items-center justify-center">
                  <Cpu className="w-5 h-5 text-foreground" strokeWidth={1.5} />
                </div>
                <ProviderIcon provider="anthropic" size="sm" />
                <ProviderIcon provider="gemini"    size="sm" />
              </div>
              <h3 className="text-xl font-medium mb-3 tracking-tight">AI Orchestration</h3>
              <p className="text-muted-foreground leading-relaxed font-light text-[15px]">
                Inject deployment logs into Claude 3.5 or Gemini for autonomous triage and resolution.
              </p>
            </div>

            <div className="md:col-span-8 group relative rounded-2xl bg-card border border-border p-8 md:p-12 overflow-hidden hover:border-foreground/20 transition-all shadow-sm hover:shadow-md">
              <div className="absolute inset-0 bg-gradient-to-tl from-violet-500/4 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-secondary border border-border flex items-center justify-center">
                    <Layers className="w-5 h-5 text-foreground" strokeWidth={1.5} />
                  </div>
                  <div className="flex items-center gap-2">
                    <ProviderIcon provider="vercel"  size="sm" status="connected" />
                    <ProviderIcon provider="railway" size="sm" status="deploying" />
                    <ProviderIcon provider="render"  size="sm" status="idle"      />
                  </div>
                </div>
                <h3 className="text-2xl font-medium mb-3 tracking-tight">Multi-Provider Abstraction</h3>
                <p className="text-muted-foreground leading-relaxed font-light text-[15px] max-w-sm">
                  A unified API surface for heterogeneous infrastructure. Deploy simultaneously to Vercel, Railway, and Render with a single trigger.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER CTA */}
      <section className="py-32 border-t border-border relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-primary/5 via-background to-background pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-secondary border border-border mx-auto flex items-center justify-center mb-8 shadow-xl">
            <Zap className="w-7 h-7 text-foreground" />
          </div>
          <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-6">Ready to deploy?</h2>
          <p className="text-xl text-muted-foreground mb-10 font-light">
            Join the elite engineering teams building the future on NexusForge.
          </p>
          <Link href="/auth/register"
            className="h-14 inline-flex items-center gap-2 px-10 rounded-xl bg-foreground text-background font-semibold hover:scale-[0.98] transition-transform shadow-xl shadow-primary/10"
          >
            Create Free Workspace <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <footer className="py-8 border-t border-border text-center">
        <p className="text-xs text-muted-foreground font-mono">© 2026 NexusForge Infrastructure. All rights reserved.</p>
      </footer>
    </div>
  );
}
