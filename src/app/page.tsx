"use client";

import { motion } from "framer-motion";
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
} from "lucide-react";

const FEATURES = [
  {
    icon: GitBranch,
    title: "Git-Native Orchestration",
    description: "Every push triggers a synchronized cascade across GitHub, Vercel, and your entire deployment pipeline — in real time.",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
  },
  {
    icon: Zap,
    title: "Instant Deployment Sync",
    description: "Deploy to Vercel, Railway, Render, and Netlify simultaneously. Monitor build logs streaming live from every provider.",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
  },
  {
    icon: Cpu,
    title: "Multi-Model AI Layer",
    description: "GPT-4, Claude, and Gemini analyze your logs, debug deployments, and recommend infrastructure changes autonomously.",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
  },
  {
    icon: Activity,
    title: "Real-Time Event Bus",
    description: "Supabase-powered websockets stream deployment events, log entries, and sync pulses across your entire team in under 50ms.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "RBAC, encrypted token vaults, webhook signature verification, audit logs, and CSP hardening — production-grade from day one.",
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
  },
  {
    icon: Globe,
    title: "Universal Integrations",
    description: "GitHub, Vercel, Supabase, Railway, Render, AWS, Docker, Kubernetes — all connected through a single unified API surface.",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
  },
];

const PROVIDERS = ["GitHub", "Vercel", "Supabase", "Railway", "Render", "AWS", "Docker", "Kubernetes"];

const TERMINAL_LINES = [
  { t: 50,  c: "text-zinc-500", text: "# NexusForge deployment pipeline" },
  { t: 400, c: "text-blue-400", text: "→ Connecting to GitHub..." },
  { t: 800, c: "text-emerald-400", text: "✓ Repository synced: main@a3f8c91" },
  { t: 1200, c: "text-amber-400", text: "→ Triggering Vercel deployment..." },
  { t: 1800, c: "text-blue-400", text: "→ Building... [████████░░] 80%" },
  { t: 2400, c: "text-emerald-400", text: "✓ Deployment ready: my-app.vercel.app" },
  { t: 2900, c: "text-violet-400", text: "→ AI analyzing build artifacts..." },
  { t: 3400, c: "text-emerald-400", text: "✓ No issues detected. Performance score: 98" },
];

function TerminalDemo() {
  return (
    <div className="code-block p-4 rounded-xl overflow-hidden">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#1e2d40]">
        <div className="w-3 h-3 rounded-full bg-red-500/70" />
        <div className="w-3 h-3 rounded-full bg-amber-500/70" />
        <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
        <span className="ml-2 text-xs text-zinc-500 font-mono">nexusforge — deployment pipeline</span>
      </div>
      <div className="space-y-1">
        {TERMINAL_LINES.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: line.t / 1000, duration: 0.3 }}
            className={`font-mono text-sm ${line.c}`}
          >
            {line.text}
          </motion.div>
        ))}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.8 }}
          className="terminal-cursor font-mono text-sm text-zinc-500 mt-2"
        />
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#080a0f] relative overflow-hidden">
      {/* Grid background */}
      <div className="fixed inset-0 grid-bg opacity-40 pointer-events-none" />
      {/* Radial glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-blue-600/8 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-violet-600/6 rounded-full blur-[100px]" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-5 border-b border-[#1e2d40]/50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg text-white tracking-tight">NexusForge</span>
          <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/25 font-mono">
            BETA
          </span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm text-zinc-400">
          <Link href="#features" className="hover:text-white transition-colors">Features</Link>
          <Link href="#architecture" className="hover:text-white transition-colors">Architecture</Link>
          <Link href="/auth/login" className="hover:text-white transition-colors">Sign in</Link>
        </div>
        <Link
          href="/auth/login"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-all duration-200 glow-blue"
        >
          Get Started <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </nav>

      {/* Hero */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 md:px-12 pt-24 pb-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-blue-500/20 text-xs text-blue-400 mb-8 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 pulse-dot" />
            Real-time synchronized across all providers
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.05]">
            <span className="gradient-text">The OS for</span>
            <br />
            <span className="text-white">Modern Development</span>
          </h1>

          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            NexusForge unifies GitHub, Vercel, Supabase, Railway, and your entire stack
            into one AI-powered platform that orchestrates, synchronizes, and deploys — automatically.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <Link
              href="/auth/login"
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all duration-200 text-sm glow-blue"
            >
              Start Building Free <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-6 py-3 rounded-xl glass border border-zinc-700/50 text-zinc-300 hover:text-white hover:border-zinc-500 font-medium transition-all duration-200 text-sm"
            >
              <Terminal className="w-4 h-4" />
              View Dashboard
            </Link>
          </div>

          {/* Provider pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-20">
            {PROVIDERS.map((p) => (
              <span
                key={p}
                className="px-3 py-1 text-xs font-mono rounded-md bg-[#0d1117] border border-[#1e2d40] text-zinc-400"
              >
                {p}
              </span>
            ))}
          </div>

          {/* Terminal demo */}
          <div className="max-w-2xl mx-auto">
            <TerminalDemo />
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 max-w-6xl mx-auto px-6 md:px-12 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Everything in one place
          </h2>
          <p className="text-zinc-400 max-w-xl mx-auto">
            No more tab switching between 12 dashboards. NexusForge is your single pane of glass.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className={`p-6 rounded-2xl border ${f.border} ${f.bg} hover:scale-[1.02] transition-transform duration-200 cursor-default`}
            >
              <div className={`w-10 h-10 rounded-lg ${f.bg} border ${f.border} flex items-center justify-center mb-4`}>
                <f.icon className={`w-5 h-5 ${f.color}`} />
              </div>
              <h3 className="font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 md:px-12 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="glass-raised rounded-3xl p-12 border border-blue-500/10"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to unify your stack?
          </h2>
          <p className="text-zinc-400 mb-8 max-w-lg mx-auto">
            Connect your first repository in under 60 seconds. No credit card required.
          </p>
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all duration-200 glow-blue"
          >
            Start for free <ChevronRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#1e2d40]/50 px-6 md:px-12 py-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-xs text-zinc-600">
          <span className="flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-blue-500" />
            NexusForge © {new Date().getFullYear()}
          </span>
          <span>The OS for modern development</span>
        </div>
      </footer>
    </div>
  );
}
