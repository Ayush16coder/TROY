"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, User, Loader2, Building, ArrowLeft, Hexagon } from "lucide-react";
import Link from "next/link";
import { useState, useMemo } from "react";
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

function MicrosoftLogo({ size = 18 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21 21" width={size} height={size}>
      <rect x="1" y="1" width="9" height="9" fill="#f25022" />
      <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
      <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
      <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
    </svg>
  );
}

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [workspace, setWorkspace] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [msLoading, setMsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
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
      const { error } = await supabase.auth.signUp({
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

  const handleGoogleSignup = async () => {
    setGoogleLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message);
      setGoogleLoading(false);
    }
  };

  const handleMicrosoftSignup = async () => {
    setMsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "azure",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message);
      setMsLoading(false);
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
                  Start your free trial
                </h1>
                <p className="text-[15px] text-zinc-500 dark:text-zinc-400">
                  Select your preferred sign up method to continue
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleGoogleSignup}
                  disabled={googleLoading || msLoading}
                  className="w-full h-12 relative flex items-center justify-center gap-3 bg-[#2D2D2D] dark:bg-white/10 hover:bg-[#202020] dark:hover:bg-white/15 text-white rounded-[12px] font-medium transition-colors disabled:opacity-70"
                >
                  <div className="absolute left-4">
                    {googleLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <GoogleLogo size={20} />}
                  </div>
                  <span>Continue with Google</span>
                </button>

                <button
                  onClick={handleMicrosoftSignup}
                  disabled={msLoading || googleLoading}
                  className="w-full h-12 relative flex items-center justify-center gap-3 bg-[#2D2D2D] dark:bg-white/10 hover:bg-[#202020] dark:hover:bg-white/15 text-white rounded-[12px] font-medium transition-colors disabled:opacity-70"
                >
                  <div className="absolute left-4">
                    {msLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <MicrosoftLogo size={20} />}
                  </div>
                  <span>Continue with Microsoft</span>
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
                  Already have an account?{" "}
                  <Link href="/auth/login" className="text-zinc-900 dark:text-white font-medium hover:underline">
                    Sign in
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
                  Sign up with email
                </h1>
                <p className="text-[15px] text-zinc-500 dark:text-zinc-400">
                  Enter your details to create your account
                </p>
              </div>

              <form onSubmit={handleRegister} className="space-y-5">
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="fullName" className="text-[13px] font-medium text-zinc-700 dark:text-zinc-300">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-zinc-400 dark:text-zinc-500" />
                      <input
                        id="fullName"
                        type="text"
                        placeholder="John Doe"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        className="w-full h-11 pl-[42px] pr-4 bg-white dark:bg-black/20 border border-zinc-200 dark:border-white/10 rounded-[10px] text-[15px] text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white focus:border-transparent transition-all"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="workspace" className="text-[13px] font-medium text-zinc-700 dark:text-zinc-300">
                      Workspace
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-zinc-400 dark:text-zinc-500" />
                      <input
                        id="workspace"
                        type="text"
                        placeholder="Acme Inc"
                        value={workspace}
                        onChange={(e) => setWorkspace(e.target.value)}
                        required
                        className="w-full h-11 pl-[42px] pr-4 bg-white dark:bg-black/20 border border-zinc-200 dark:border-white/10 rounded-[10px] text-[15px] text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white focus:border-transparent transition-all"
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>

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
                  <label htmlFor="password" className="text-[13px] font-medium text-zinc-700 dark:text-zinc-300">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-zinc-400 dark:text-zinc-500" />
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full h-11 pl-[42px] pr-11 bg-white dark:bg-black/20 border border-zinc-200 dark:border-white/10 rounded-[10px] text-[15px] text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white focus:border-transparent transition-all"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                    </button>
                  </div>

                  {password.length > 0 && (
                    <div className="pt-2 flex items-center gap-2">
                      <div className="flex-1 flex gap-1 h-1">
                        {[1, 2, 3, 4].map((i) => (
                          <div 
                            key={i} 
                            className={`flex-1 rounded-full transition-colors duration-300 ${
                              i <= passwordStrength 
                                ? (passwordStrength < 2 ? 'bg-red-500' : passwordStrength < 4 ? 'bg-amber-400' : 'bg-emerald-500')
                                : 'bg-zinc-100 dark:bg-white/10'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500 dark:text-zinc-400 w-12 text-right">
                        {passwordStrength < 2 ? 'Weak' : passwordStrength < 4 ? 'Good' : 'Strong'}
                      </span>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading || (password.length > 0 && passwordStrength < 2)}
                  className="w-full h-11 mt-2 bg-[#2D2D2D] dark:bg-white/10 hover:bg-[#202020] dark:hover:bg-white/15 text-white rounded-[10px] font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Create Account
                </button>

                <p className="text-center text-zinc-500 dark:text-zinc-400 text-[13px] mt-6">
                  By signing up, you agree to our{" "}
                  <Link href="#" className="text-zinc-900 dark:text-white hover:underline">Terms</Link> and{" "}
                  <Link href="#" className="text-zinc-900 dark:text-white hover:underline">Privacy Policy</Link>.
                </p>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
