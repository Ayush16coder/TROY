"use client";

import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, Loader2, Hexagon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const supabase = createClient();

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      
      toast.success("Password updated successfully!");
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error.message);
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
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-8"
        >
          <div>
            <h1 className="text-[32px] font-semibold tracking-tight text-zinc-900 dark:text-white mb-3">
              Update password
            </h1>
            <p className="text-[15px] text-zinc-500 dark:text-zinc-400">
              Please enter your new password below.
            </p>
          </div>

          <form onSubmit={handleUpdate} className="space-y-5">
            <div className="space-y-1.5">
              <label htmlFor="password" className="text-[13px] font-medium text-zinc-700 dark:text-zinc-300">
                New Password
              </label>
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

            <div className="space-y-1.5">
              <label htmlFor="confirmPassword" className="text-[13px] font-medium text-zinc-700 dark:text-zinc-300">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-zinc-400 dark:text-zinc-500" />
                <input
                  id="confirmPassword"
                  type={showConfirmPw ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full h-11 pl-[42px] pr-11 bg-white dark:bg-black/20 border border-zinc-200 dark:border-white/10 rounded-[10px] text-[15px] text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white focus:border-transparent transition-all"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPw(!showConfirmPw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
                >
                  {showConfirmPw ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || password.length < 6}
              className="w-full h-11 mt-2 bg-[#2D2D2D] dark:bg-white/10 hover:bg-[#202020] dark:hover:bg-white/15 text-white rounded-[10px] font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Update Password
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
