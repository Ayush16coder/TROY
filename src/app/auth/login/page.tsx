"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowLeft, Hexagon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

/* ── Logos ── */
function GoogleLogo({ size = 18 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width={size} height={size} aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.15 0 5.64 1.08 7.73 2.85l5.74-5.74C33.99 3.48 29.36 1.5 24 1.5 14.97 1.5 7.28 7.1 4.14 14.97l6.71 5.21C12.43 14.06 17.75 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.5 24c0-1.64-.15-3.22-.43-4.75H24v9h12.7c-.55 2.97-2.2 5.49-4.68 7.18l7.19 5.59C43.99 36.76 46.5 30.86 46.5 24z" />
      <path fill="#FBBC05" d="M10.85 28.18A14.56 14.56 0 0 1 9.5 24c0-1.46.25-2.87.68-4.18l-6.71-5.21A22.46 22.46 0 0 0 1.5 24c0 3.62.87 7.04 2.4 10.06l6.95-5.88z" />
      <path fill="#34A853" d="M24 46.5c5.36 0 9.86-1.77 13.14-4.82l-7.19-5.59C28.18 37.64 26.21 38.5 24 38.5c-6.25 0-11.57-4.56-13.15-10.68l-6.95 5.88C7.28 40.9 14.97 46.5 24 46.5z" />
    </svg>
  );
}

function GithubLogo({ size = 18 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  
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

  async function handleGoogleLogin() {
    setGoogleLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${location.origin}/auth/callback?next=/dashboard` },
    });
    if (error) {
      toast.error(error.message);
      setGoogleLoading(false);
    }
  }

  async function handleGithubLogin() {
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
    <div className="flex-1 flex flex-col p-8 sm:p-12 min-h-screen bg-transparent text-zinc-900 dark:text-white font-sans transition-colors duration-300">
      {/* ── Logo ── */}
      <Link href="/" className="flex items-center gap-2 mb-16 select-none hover:opacity-80 transition-opacity w-fit">
        <Hexagon className="w-8 h-8 text-foreground" strokeWidth={1.5} />
        <div className="flex items-baseline mt-1">
          <span className="text-3xl font-extrabold tracking-tighter font-serif text-foreground">T</span>
          <span className="text-2xl font-light tracking-widest font-sans text-muted-foreground">R</span>
          <span className="text-3xl font-black font-mono text-primary">O</span>
          <span className="text-2xl font-medium italic font-serif text-foreground">Y</span>
        </div>
      </Link>

      {/* ── Content container ── */}
      <div className="flex-1 flex flex-col justify-center max-w-[400px] w-full mx-auto pb-24">
        
        <AnimatePresence mode="wait">
          {!showEmailForm ? (
            <motion.div
              key="methods"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <div className="space-y-3">
                <h1 className="text-[32px] font-semibold tracking-tight text-zinc-900 dark:text-white">
                  Sign in
                </h1>
                <p className="text-[15px] text-zinc-500 dark:text-zinc-400">
                  Select your preferred login method to continue
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleGoogleLogin}
                  disabled={googleLoading || githubLoading}
                  className="w-full h-12 relative flex items-center justify-center gap-3 bg-[#2D2D2D] dark:bg-white/10 hover:bg-[#202020] dark:hover:bg-white/15 text-white rounded-[12px] font-medium transition-colors disabled:opacity-70"
                >
                  <div className="absolute left-4">
                    {googleLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <GoogleLogo size={20} />}
                  </div>
                  <span>Continue with Google</span>
                </button>

                <button
                  onClick={handleGithubLogin}
                  disabled={githubLoading || googleLoading}
                  className="w-full h-12 relative flex items-center justify-center gap-3 bg-[#2D2D2D] dark:bg-white/10 hover:bg-[#202020] dark:hover:bg-white/15 text-white rounded-[12px] font-medium transition-colors disabled:opacity-70"
                >
                  <div className="absolute left-4">
                    {githubLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <GithubLogo size={20} />}
                  </div>
                  <span>Continue with GitHub</span>
                </button>

                <button
                  onClick={() => setShowEmailForm(true)}
                  className="w-full h-12 relative flex items-center justify-center gap-3 bg-[#F4F4F5] dark:bg-white/5 hover:bg-[#E4E4E7] dark:hover:bg-white/10 text-zinc-900 dark:text-white rounded-[12px] font-medium transition-colors"
                >
                  <div className="absolute left-4">
                    <Mail className="w-5 h-5 text-zinc-500 dark:text-zinc-400" strokeWidth={2} />
                  </div>
                  <span>Continue with email</span>
                </button>
              </div>
              
              <div className="text-center pt-2">
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Don't have an account?{" "}
                  <Link href="/auth/register" className="text-zinc-900 dark:text-white font-medium hover:underline">
                    Sign up
                  </Link>
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="email-form"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <div>
                <button 
                  onClick={() => setShowEmailForm(false)}
                  className="flex items-center gap-2 text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors mb-6 -ml-2 p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-white/5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
                <h1 className="text-[32px] font-semibold tracking-tight text-zinc-900 dark:text-white mb-3">
                  Sign in with email
                </h1>
                <p className="text-[15px] text-zinc-500 dark:text-zinc-400">
                  Enter your email and password to access your account
                </p>
              </div>

              <form onSubmit={handleEmailLogin} className="space-y-5">
                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-[13px] font-medium text-zinc-700 dark:text-zinc-300">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-zinc-400 dark:text-zinc-500" />
                    <input
                      id="email"
                      type="email"
                      placeholder="you@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full h-11 pl-[42px] pr-4 bg-white dark:bg-black/20 border border-zinc-200 dark:border-white/10 rounded-[10px] text-[15px] text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white focus:border-transparent transition-all"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="text-[13px] font-medium text-zinc-700 dark:text-zinc-300">
                      Password
                    </label>
                    <Link href="/auth/forgot-password" className="text-[13px] font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-zinc-400 dark:text-zinc-500" />
                    <input
                      id="password"
                      type={showPw ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full h-11 pl-[42px] pr-11 bg-white dark:bg-black/20 border border-zinc-200 dark:border-white/10 rounded-[10px] text-[15px] text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white focus:border-transparent transition-all"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw(!showPw)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
                    >
                      {showPw ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 mt-2 bg-[#2D2D2D] dark:bg-white/10 hover:bg-[#202020] dark:hover:bg-white/15 text-white rounded-[10px] font-medium transition-colors flex items-center justify-center gap-2"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Sign In
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
