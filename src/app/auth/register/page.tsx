"use client";

import { motion } from "framer-motion";
import { GitBranch, Mail, Lock, ArrowRight, Eye, EyeOff, User, Loader2, Building, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useState, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [workspace, setWorkspace] = useState("");
  const [loading, setLoading] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const passwordStrength = useMemo(() => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  }, [password]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            workspace_name: workspace
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
      
      toast.success("Account created successfully!");
      router.push("/auth/login?message=Check your email to verify your account.");
    } catch (error: any) {
      toast.error(error.message);
      setLoading(false);
    }
  };

  const handleGithubSignup = async () => {
    setGithubLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message);
      setGithubLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="w-full"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-white tracking-tight mb-2">Create account</h1>
        <p className="text-zinc-400 text-sm">Join the next-generation deployment orchestrator.</p>
      </div>

      <div className="space-y-6">
        <button 
          onClick={handleGithubSignup}
          disabled={githubLoading}
          className="w-full group flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-white text-black hover:bg-zinc-100 font-medium text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {githubLoading ? (
            <Loader2 className="w-5 h-5 animate-spin text-zinc-500" />
          ) : (
            <GitBranch className="w-5 h-5" />
          )}
          {githubLoading ? "Connecting..." : "Sign up with GitHub"}
        </button>

        <div className="flex items-center gap-3 text-xs text-zinc-600 font-medium">
          <div className="flex-1 h-px bg-[#1e2d40]" />
          <span className="uppercase tracking-wider">or sign up with email</span>
          <div className="flex-1 h-px bg-[#1e2d40]" />
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-300">Full Name</label>
              <div className="relative group">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-zinc-500 group-focus-within:text-blue-400 transition-colors" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#0d1421] border border-[#1e2d40] focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 rounded-xl text-white text-sm transition-all shadow-inner shadow-black/20 outline-none"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-300">Workspace</label>
              <div className="relative group">
                <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-zinc-500 group-focus-within:text-blue-400 transition-colors" />
                <input
                  type="text"
                  required
                  value={workspace}
                  onChange={(e) => setWorkspace(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#0d1421] border border-[#1e2d40] focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 rounded-xl text-white text-sm transition-all shadow-inner shadow-black/20 outline-none"
                  placeholder="Acme Inc"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-zinc-300">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-zinc-500 group-focus-within:text-blue-400 transition-colors" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#0d1421] border border-[#1e2d40] focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 rounded-xl text-white text-sm transition-all shadow-inner shadow-black/20 outline-none"
                placeholder="you@company.com"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-zinc-300">Password</label>
            <div className="relative group">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-zinc-500 group-focus-within:text-blue-400 transition-colors" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-11 py-3 bg-[#0d1421] border border-[#1e2d40] focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 rounded-xl text-white text-sm transition-all shadow-inner shadow-black/20 outline-none"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-zinc-500 hover:text-zinc-300 transition-colors rounded-md hover:bg-[#1e2d40]"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            
            {/* Password Strength */}
            {password.length > 0 && (
              <div className="pt-2 flex items-center gap-2">
                <div className="flex-1 flex gap-1 h-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div 
                      key={i} 
                      className={`flex-1 rounded-full transition-colors duration-300 ${
                        i <= passwordStrength 
                          ? (passwordStrength < 2 ? 'bg-red-500' : passwordStrength < 4 ? 'bg-amber-400' : 'bg-emerald-500')
                          : 'bg-[#1e2d40]'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500 w-12 text-right">
                  {passwordStrength < 2 ? 'Weak' : passwordStrength < 4 ? 'Good' : 'Strong'}
                </span>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || (password.length > 0 && passwordStrength < 2)}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium px-4 py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] mt-4 disabled:opacity-50 disabled:shadow-none"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Account"}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <p className="text-center text-zinc-500 text-sm mt-6">
          By signing up, you agree to our{" "}
          <Link href="#" className="text-white hover:text-blue-400 transition-colors">Terms</Link> and{" "}
          <Link href="#" className="text-white hover:text-blue-400 transition-colors">Privacy Policy</Link>.
        </p>

      </div>
      
      <p className="text-center text-sm text-zinc-500 mt-8">
        Already have an account?{" "}
        <Link href="/auth/login" className="text-white font-medium hover:text-blue-400 transition-colors">
          Sign in
        </Link>
      </p>
    </motion.div>
  );
}
