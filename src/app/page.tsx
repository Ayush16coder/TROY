"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import {
  Zap, Activity, ArrowRight, Terminal, Cpu, Command, Layers,
  Wand2, FolderOpen, MoveRight, Code2, GitMerge, Star, GitCommit,
  Search, Braces, CornerDownLeft, Box, Sliders, Menu, X, Hexagon
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { ProviderIcon, ProviderBadge, ProviderSlug, ProviderStatus } from "@/components/ui/provider-icon";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// ─── TROY LOGO ────────────────────────────────────────────────────────────────
function TroyLogo() {
  return (
    <div className="flex items-center gap-2 transition-transform group-hover:scale-105 select-none">
      <Hexagon className="w-7 h-7 text-foreground" strokeWidth={1.5} />
      <div className="flex items-baseline">
        <span className="text-2xl font-extrabold tracking-tighter font-serif text-foreground">T</span>
        <span className="text-xl font-light tracking-widest font-sans text-muted-foreground">R</span>
        <span className="text-2xl font-black font-mono text-primary">O</span>
        <span className="text-xl font-medium italic font-serif text-foreground">Y</span>
      </div>
    </div>
  );
}

// ─── NAVBAR ───────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
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
            <Link href="/" className="flex items-center group">
              <TroyLogo />
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
            <Badge variant="secondary" className="hidden lg:flex items-center gap-1 font-mono text-[11px] rounded-md px-2 py-1">
              <Command className="w-3 h-3" /> K
            </Badge>
            <Separator orientation="vertical" className="h-4 hidden sm:block" />
            <div className="hidden sm:flex items-center gap-4">
              <ThemeToggle />
              <Button variant="ghost" size="sm" asChild className="text-[13px]">
                <Link href="/auth/login">Log in</Link>
              </Button>
            </div>
            <Button size="sm" asChild className="text-[13px] font-semibold rounded-md shadow-md hover:scale-105 transition-all hidden sm:inline-flex">
              <Link href="/auth/register">Deploy Now</Link>
            </Button>
            <Button variant="ghost" size="icon" className="sm:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-background/95 backdrop-blur-sm sm:hidden pt-20 px-6 flex flex-col">
          <nav className="flex flex-col gap-6 items-center flex-1 justify-center">
            {["Platform", "Integrations", "Changelog", "Docs"].map((item) => (
              <Link key={item} href="#" className="text-2xl font-semibold" onClick={() => setMobileMenuOpen(false)}>
                {item}
              </Link>
            ))}
            <div className="h-[1px] w-full bg-border my-4 max-w-xs" />
            <ThemeToggle />
            <div className="flex flex-col gap-4 w-full max-w-xs mt-4">
              <Button variant="outline" className="w-full h-12 text-base" asChild onClick={() => setMobileMenuOpen(false)}>
                <Link href="/auth/login">Log in</Link>
              </Button>
              <Button className="w-full shadow-md h-12 text-base" asChild onClick={() => setMobileMenuOpen(false)}>
                <Link href="/auth/register">Deploy Now</Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}

// ─── INFRASTRUCTURE TOPOLOGY ──────────────────────────────────────────────────
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
    { d: "M 15% 17% Q 48% 17% 50% 50%", color: "currentColor", dur: "2.2s" },
    { d: "M 81% 17% Q 52% 17% 50% 50%", color: "currentColor", dur: "2.8s" },
    { d: "M 15% 75% Q 48% 75% 50% 50%", color: "#3ecf8e", dur: "1.9s" },
    { d: "M 81% 75% Q 52% 75% 50% 50%", color: "#2496ed", dur: "3.1s" },
    { d: "M 50% 8% Q 50% 30% 50% 50%",  color: "#8ab4f8", dur: "2.5s" },
    { d: "M 87% 46% Q 68% 46% 50% 50%", color: "#f38020", dur: "2.0s" },
  ];

  return (
    <div className="relative w-full h-[320px] md:h-[480px] flex items-center justify-center select-none overflow-hidden md:overflow-visible">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/8 via-transparent to-transparent blur-3xl pointer-events-none" />
      <svg className="absolute inset-0 w-full h-full pointer-events-none text-border" preserveAspectRatio="none">
        {paths.map((p, i) => (
          <motion.path key={i} d={p.d} fill="none" stroke="currentColor"
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

      <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-20 w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-card border border-border flex items-center justify-center shadow-xl"
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
          className="absolute flex flex-col items-center gap-1.5 transform scale-75 md:scale-100" style={{ left: x, top: y }}
        >
          <ProviderIcon provider={provider} size="lg" status="connected" />
          <span className="text-[9px] font-mono text-muted-foreground">{label}</span>
        </motion.div>
      ))}
    </div>
  );
}

// ─── CONNECTED PLATFORMS MARQUEE ──────────────────────────────────────────────
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
              size="2xl"
              variant="ghost"
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

// ─── CAPABILITIES ROW ─────────────────────────────────────────────────────────
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
        transition={{ duration: 60, repeat: Infinity, ease: "linear", repeatType: "loop" }}
        style={{ width: "max-content", animationPlayState: paused ? "paused" : "running" }}
        className="flex items-center gap-4 py-12 pl-10"
      >
        {[...CAPABILITIES, ...CAPABILITIES, ...CAPABILITIES, ...CAPABILITIES].map(({ icon: Icon, label }, i) => (
          <motion.div
            key={`${label}-${i}`}
            animate={{ y: [-40, 40, -40] }}
            transition={{
              y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: i * 0.15 },
              scale: { type: "spring", stiffness: 420, damping: 16 }
            }}
            whileHover={{ scale: 1.1, zIndex: 50 }}
            className="flex flex-col items-center cursor-default group flex-shrink-0 relative"
            style={{ zIndex: i }}
          >
            <div className="w-20 h-20 rounded-full bg-background border border-border/60 flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-200">
              <Icon className="w-6 h-6 text-foreground/80 group-hover:text-foreground transition-colors duration-150" strokeWidth={1} />
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

// ─── MAIN PAGE ─────────────────────────────────────────────────────────────────
function AntigravityBackground() {
  const particles = Array.from({ length: 250 }).map((_, i) => {
    const r = Math.sqrt(i) * 45; 
    const theta = i * Math.PI * (3 - Math.sqrt(5)); 
    const x = r * Math.cos(theta);
    const y = r * Math.sin(theta);
    const rotation = (theta * 180) / Math.PI + 90; 
    const color = i % 2 === 0 ? "#3b82f6" : i % 3 === 0 ? "#8b5cf6" : "#60a5fa";
    return { x, y, rotation, color, delay: (i % 50) * 0.1 };
  });

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 flex items-center justify-center opacity-60">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 150, repeat: Infinity, ease: "linear" }}
        className="relative w-[1200px] h-[1200px] translate-x-[20%] md:translate-x-[35%]"
      >
        {particles.map((p, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.1, 0.7, 0.1] }}
            transition={{ duration: 4, repeat: Infinity, delay: p.delay, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 rounded-full"
            style={{
              width: 3,
              height: 12,
              backgroundColor: p.color,
              transform: `translate(-50%, -50%) translate(${p.x}px, ${p.y}px) rotate(${p.rotation}deg)`,
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}

export default function LandingPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />

      {/* HERO */}
      <section ref={containerRef} className="relative pt-40 pb-32 md:pt-56 md:pb-48 overflow-hidden flex flex-col items-center justify-center text-center">
        <AntigravityBackground />
        
        <div className="absolute inset-0 noise-overlay opacity-30 pointer-events-none z-0" />
        
        <motion.div style={{ y, opacity }}
          className="max-w-[1000px] mx-auto px-6 relative z-10 flex flex-col items-center"
        >
          {/* Logo / Badge */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="flex items-center gap-2 mb-8 bg-card/80 backdrop-blur-sm border border-border px-3 py-1.5 rounded-full shadow-sm"
          >
             <div className="w-5 h-5 rounded flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-primary" fill="currentColor" />
             </div>
             <span className="text-sm font-medium tracking-tight">TROY Agent Platform</span>
          </motion.div>

          {/* Heading */}
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-6xl lg:text-[76px] font-medium tracking-tight leading-[1.05] mb-10 text-foreground max-w-4xl"
          >
            Experience liftoff with the next-gen agent platform
          </motion.h1>

          {/* Buttons */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center gap-4"
          >
            <Button size="lg" asChild className="h-14 px-8 text-base rounded-full shadow-xl hover:scale-[1.02] transition-transform w-full sm:w-auto">
              <Link href="/auth/register">
                Download for Windows
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="h-14 px-8 text-base rounded-full shadow-sm bg-secondary/50 backdrop-blur-sm border-border hover:bg-secondary w-full sm:w-auto">
              <Link href="#platforms">
                Explore use cases
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* CONNECTED PLATFORMS */}
      <section id="platforms" className="py-8">
        <PlatformsMarquee />
      </section>

      {/* ASYMMETRIC FEATURES */}
      <section className="py-32 bg-background">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="mb-20 max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">Precision engineered for scale.</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              We replaced disjointed dashboards with a single, high-performance command center operating over secure WebSocket channels.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            <Card className="md:col-span-8 group relative overflow-hidden hover:border-primary/50 transition-all shadow-sm hover:shadow-md border-border bg-card">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardHeader className="relative z-10 pb-0 pt-8 px-8 md:px-12">
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
                <CardTitle className="text-2xl tracking-tight">Realtime Synchronization Engine</CardTitle>
              </CardHeader>
              <CardContent className="relative z-10 pt-4 px-8 md:px-12 pb-8 md:pb-12">
                <p className="text-muted-foreground leading-relaxed text-[15px] max-w-sm">
                  Bypass REST polling. Our architecture leverages PostgreSQL Logical Replication and Supabase Realtime to push deployment states in &lt;50ms.
                </p>
              </CardContent>
            </Card>

            <Card className="md:col-span-4 group relative overflow-hidden hover:border-primary/50 transition-all shadow-sm hover:shadow-md border-border bg-card">
              <CardHeader className="pb-0 pt-8 px-8">
                <div className="mb-6 flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-secondary border border-border flex items-center justify-center">
                    <Terminal className="w-5 h-5 text-foreground" strokeWidth={1.5} />
                  </div>
                  <ProviderIcon provider="docker" size="sm" status="connected" />
                </div>
                <CardTitle className="text-xl tracking-tight">Live Log Streaming</CardTitle>
              </CardHeader>
              <CardContent className="pt-4 px-8 pb-8">
                <p className="text-muted-foreground leading-relaxed text-[15px]">
                  Aggregate streams from Vercel, Docker, and AWS into one filterable terminal view.
                </p>
              </CardContent>
            </Card>

            <Card className="md:col-span-4 group relative overflow-hidden hover:border-primary/50 transition-all shadow-sm hover:shadow-md border-border bg-card">
              <CardHeader className="pb-0 pt-8 px-8">
                <div className="mb-6 flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-secondary border border-border flex items-center justify-center">
                    <Cpu className="w-5 h-5 text-foreground" strokeWidth={1.5} />
                  </div>
                  <ProviderIcon provider="anthropic" size="sm" />
                  <ProviderIcon provider="gemini"    size="sm" />
                </div>
                <CardTitle className="text-xl tracking-tight">AI Orchestration</CardTitle>
              </CardHeader>
              <CardContent className="pt-4 px-8 pb-8">
                <p className="text-muted-foreground leading-relaxed text-[15px]">
                  Inject deployment logs into Claude 3.5 or Gemini for autonomous triage and resolution.
                </p>
              </CardContent>
            </Card>

            <Card className="md:col-span-8 group relative overflow-hidden hover:border-primary/50 transition-all shadow-sm hover:shadow-md border-border bg-card">
              <div className="absolute inset-0 bg-gradient-to-tl from-violet-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardHeader className="relative z-10 pb-0 pt-8 px-8 md:px-12">
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
                <CardTitle className="text-2xl tracking-tight">Multi-Provider Abstraction</CardTitle>
              </CardHeader>
              <CardContent className="relative z-10 pt-4 px-8 md:px-12 pb-8 md:pb-12">
                <p className="text-muted-foreground leading-relaxed text-[15px] max-w-sm">
                  A unified API surface for heterogeneous infrastructure. Deploy simultaneously to Vercel, Railway, and Render with a single trigger.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CAPABILITIES ROW */}
      <section className="py-12">
        <div className="max-w-[1400px] mx-auto px-6 mb-2 text-center">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">Platform Capabilities</h2>
        </div>
        <CapabilitiesRow />
      </section>

      {/* MEGA FOOTER */}
      <footer className="pt-24 pb-12 px-6 md:px-12 bg-background relative overflow-hidden flex flex-col border-t border-border/30 mt-12">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-primary/5 via-background to-background pointer-events-none" />
        
        {/* Top Info */}
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start max-w-[1400px] mx-auto w-full mb-12 gap-16 md:gap-12 pt-12">
          <h2 className="text-3xl md:text-5xl font-medium tracking-tight">Experience liftoff</h2>
          <div className="grid grid-cols-2 gap-x-16 md:gap-x-32 gap-y-4 text-sm font-medium text-muted-foreground">
            <div className="flex flex-col gap-4">
              <Link href="#" className="hover:text-primary transition-colors">Download</Link>
              <Link href="#" className="hover:text-primary transition-colors">Product</Link>
              <Link href="#" className="hover:text-primary transition-colors">Docs</Link>
              <Link href="#" className="hover:text-primary transition-colors">Changelog</Link>
              <Link href="#" className="hover:text-primary transition-colors">Press</Link>
              <Link href="#" className="hover:text-primary transition-colors">Releases</Link>
            </div>
            <div className="flex flex-col gap-4">
              <Link href="#" className="hover:text-primary transition-colors">Blog</Link>
              <Link href="#" className="hover:text-primary transition-colors">Pricing</Link>
              <Link href="#" className="hover:text-primary transition-colors">Use Cases</Link>
            </div>
          </div>
        </div>

        {/* Massive TROY Name */}
        <div className="relative z-10 w-full flex justify-center items-center py-12 md:py-20 select-none pointer-events-none overflow-hidden">
          <div className="flex items-baseline text-[25vw] md:text-[22vw] leading-[0.8] tracking-tighter">
            <span className="font-extrabold font-serif text-foreground">T</span>
            <span className="font-light tracking-wide font-sans text-muted-foreground/80 -ml-[2vw]">R</span>
            <span className="font-black font-mono text-primary -ml-[1vw]">O</span>
            <span className="font-medium italic font-serif text-foreground -ml-[1vw]">Y</span>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center max-w-[1400px] mx-auto w-full pt-8 border-t border-border/40 gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-foreground text-background flex items-center justify-center shadow-sm">
              <Zap className="w-4 h-4" fill="currentColor" />
            </div>
            <span className="font-semibold text-foreground tracking-tight group-hover:opacity-80 transition-opacity">TROY</span>
          </Link>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm text-muted-foreground font-medium">
            <Link href="#" className="hover:text-foreground transition-colors">About TROY</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Products</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
