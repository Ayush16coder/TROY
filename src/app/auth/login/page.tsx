"use client";

import { motion } from "framer-motion";
import { GitBranch, Mail, Lock, ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";
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
      setLoading(false);
    } else {
      toast.success("Welcome back!");
      router.push("/dashboard");
    }
  }

  async function handleGitHubLogin() {
    setGithubLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: { redirectTo: `${location.origin}/auth/callback?next=/dashboard` },
    });
    if (error) {
      toast.error(error.message);
      setGithubLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="w-full"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-white tracking-tight mb-2">Sign in</h1>
        <p className="text-zinc-400 text-sm">Enter your details to access your workspace.</p>
      </div>

      <div className="space-y-6">
        {/* GitHub OAuth */}
        <button
          onClick={handleGitHubLogin}
          disabled={githubLoading}
          className="w-full group flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-white text-black hover:bg-zinc-100 font-medium text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {githubLoading ? (
            <Loader2 className="w-5 h-5 animate-spin text-zinc-500" />
          ) : (
            <GitBranch className="w-5 h-5" />
          )}
          {githubLoading ? "Connecting..." : "Continue with GitHub"}
        </button>

        <div className="flex items-center gap-3 text-xs text-zinc-600 font-medium">
          <div className="flex-1 h-px bg-[#1e2d40]" />
          <span className="uppercase tracking-wider">or sign in with email</span>
          <div className="flex-1 h-px bg-[#1e2d40]" />
        </div>

        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-zinc-300">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-zinc-500 group-focus-within:text-blue-400 transition-colors" />
              <input
                id="email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#0d1421] border border-[#1e2d40] text-white placeholder:text-zinc-600 text-sm focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all shadow-inner shadow-black/20"
              />
            </div>
          </div>
          
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-zinc-300">Password</label>
              <Link href="/auth/forgot-password" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                Forgot password?
              </Link>
            </div>
            <div className="relative group">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-zinc-500 group-focus-within:text-blue-400 transition-colors" />
              <input
                id="password"
                type={showPw ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-11 py-3 rounded-xl bg-[#0d1421] border border-[#1e2d40] text-white placeholder:text-zinc-600 text-sm focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all shadow-inner shadow-black/20"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-zinc-500 hover:text-zinc-300 transition-colors rounded-md hover:bg-[#1e2d40]"
              >
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-all duration-200 disabled:opacity-50 mt-2 shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:shadow-[0_0_30px_rgba(37,99,235,0.4)]"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign in"}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>
      </div>

      <p className="text-center text-sm text-zinc-500 mt-8">
        Don't have an account?{" "}
        <Link href="/auth/register" className="text-white font-medium hover:text-blue-400 transition-colors">
          Create one free
        </Link>
      </p>
    </motion.div>
  );
}
