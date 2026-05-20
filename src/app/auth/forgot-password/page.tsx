"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Mail, ArrowLeft, Loader2, Hexagon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const supabase = createClient();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/auth/update-password`,
      });
      if (error) throw error;
      setSubmitted(true);
      toast.success("Recovery email sent!");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

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
          {submitted ? (
            <motion.div
              key="submitted"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.3 }}
              className="space-y-8 text-center"
            >
              <div className="mx-auto w-16 h-16 rounded-full bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 flex items-center justify-center mb-6">
                <Mail className="w-8 h-8 text-zinc-900 dark:text-white" />
              </div>
              <h1 className="text-[32px] font-semibold tracking-tight text-zinc-900 dark:text-white mb-2">Check your email</h1>
              <p className="text-[15px] text-zinc-500 dark:text-zinc-400 mb-8 max-w-[280px] mx-auto">
                We sent a password reset link to <span className="text-zinc-900 dark:text-white font-medium">{email}</span>
              </p>
              <Link 
                href="/auth/login"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-[10px] bg-[#F4F4F5] dark:bg-white/5 hover:bg-[#E4E4E7] dark:hover:bg-white/10 text-zinc-900 dark:text-white font-medium text-sm transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to log in
              </Link>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <div>
                <Link 
                  href="/auth/login"
                  className="flex items-center gap-2 text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors mb-6 -ml-2 p-2 w-fit rounded-lg hover:bg-zinc-100 dark:hover:bg-white/5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Link>
                <h1 className="text-[32px] font-semibold tracking-tight text-zinc-900 dark:text-white mb-3">
                  Forgot password?
                </h1>
                <p className="text-[15px] text-zinc-500 dark:text-zinc-400">
                  No worries, we'll send you reset instructions.
                </p>
              </div>

              <form onSubmit={handleReset} className="space-y-5">
                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-[13px] font-medium text-zinc-700 dark:text-zinc-300">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-zinc-400 dark:text-zinc-500" />
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-11 pl-[42px] pr-4 bg-white dark:bg-black/20 border border-zinc-200 dark:border-white/10 rounded-[10px] text-[15px] text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white focus:border-transparent transition-all"
                      placeholder="you@company.com"
                      disabled={loading}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 mt-2 bg-[#2D2D2D] dark:bg-white/10 hover:bg-[#202020] dark:hover:bg-white/15 text-white rounded-[10px] font-medium transition-colors flex items-center justify-center gap-2"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Reset Password
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
