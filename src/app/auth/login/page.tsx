"use client";

import { motion } from "framer-motion";
import { Zap, GitBranch, Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Welcome back!");
      router.push("/dashboard");
    }
    setLoading(false);
  }

  async function handleGitHubLogin() {
    setGithubLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: { redirectTo: `${location.origin}/auth/callback?next=/dashboard` },
    });
    if (error) toast.error(error.message);
    setGithubLoading(false);
  }

  return (
    <div className="min-h-screen bg-[#080a0f] flex items-center justify-center px-4 relative overflow-hidden">
      <div className="fixed inset-0 grid-bg opacity-30 pointer-events-none" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-sm"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 mb-4 glow-blue">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Welcome to NexusForge</h1>
          <p className="text-sm text-zinc-500 mt-1">Sign in to your workspace</p>
        </div>

        <div className="glass rounded-2xl p-6 space-y-4">
          {/* GitHub OAuth */}
          <button
            onClick={handleGitHubLogin}
            disabled={githubLoading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-[#1a2236] hover:bg-[#1e2a42] border border-[#1e2d40] text-white font-medium text-sm transition-all duration-200 disabled:opacity-50"
          >
            <GitBranch className="w-4.5 h-4.5" />
            {githubLoading ? "Connecting..." : "Continue with GitHub"}
          </button>

          <div className="flex items-center gap-3 text-xs text-zinc-600">
            <div className="flex-1 h-px bg-[#1e2d40]" />
            OR
            <div className="flex-1 h-px bg-[#1e2d40]" />
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-3">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                id="email"
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#0d1117] border border-[#1e2d40] text-white placeholder:text-zinc-600 text-sm focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                id="password"
                type={showPw ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-10 py-3 rounded-xl bg-[#0d1117] border border-[#1e2d40] text-white placeholder:text-zinc-600 text-sm focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all duration-200 disabled:opacity-50 glow-blue"
            >
              {loading ? "Signing in..." : "Sign in"} <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-zinc-600 mt-6">
          No account?{" "}
          <Link href="/auth/signup" className="text-blue-400 hover:text-blue-300 transition-colors">
            Create one free
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
