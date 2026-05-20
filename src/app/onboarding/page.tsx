"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Lock, Eye, EyeOff, Loader2, Hexagon, Check,
  ChevronRight, ExternalLink, SkipForward, Phone
} from "lucide-react";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Suspense, useEffect } from "react";

/* ── Provider logos ── */
function VercelLogo({ size = 20 }: { size?: number }) {
  return (
    <svg viewBox="0 0 76 65" width={size} height={size} fill="currentColor">
      <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
    </svg>
  );
}

function SupabaseLogo({ size = 20 }: { size?: number }) {
  return (
    <svg viewBox="0 0 109 113" width={size} height={size} fill="none">
      <path d="M63.7076 110.284C60.8481 113.885 55.0502 111.912 54.9813 107.314L53.9738 40.0627H99.3819C107.659 40.0627 112.198 49.7351 106.943 55.9467L63.7076 110.284Z" fill="url(#sb1)" />
      <path d="M63.7076 110.284C60.8481 113.885 55.0502 111.912 54.9813 107.314L53.9738 40.0627H99.3819C107.659 40.0627 112.198 49.7351 106.943 55.9467L63.7076 110.284Z" fill="url(#sb2)" fillOpacity="0.2" />
      <path d="M45.317 2.07103C48.1765 -1.53037 53.9745 0.442937 54.0434 5.04075L54.4849 72.2922H9.07688C0.## 72.2922 -3.73825 62.6198 1.51677 56.4082L45.317 2.07103Z" fill="#3ECF8E" />
      <defs>
        <linearGradient id="sb1" x1="53.9738" y1="54.974" x2="94.1635" y2="71.8295" gradientUnits="userSpaceOnUse">
          <stop stopColor="#249361" /><stop offset="1" stopColor="#3ECF8E" />
        </linearGradient>
        <linearGradient id="sb2" x1="36.1558" y1="30.578" x2="54.4844" y2="65.0806" gradientUnits="userSpaceOnUse">
          <stop /><stop offset="1" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function GithubLogo({ size = 20 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

/* ── Steps config ── */
const STEPS = [
  { id: "password", label: "Set Password", required: true },
  { id: "github", label: "GitHub", required: false },
  { id: "vercel", label: "Vercel", required: false },
  { id: "supabase", label: "Supabase", required: false },
];

export default function OnboardingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin" /></div>}>
      <OnboardingContent />
    </Suspense>
  );
}

function OnboardingContent() {
  const [currentStep, setCurrentStep] = useState(0);
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [connectedPlatforms, setConnectedPlatforms] = useState<Record<string, boolean>>({});

  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  useEffect(() => {
    const connected = searchParams.get("connected");
    if (connected) {
      setConnectedPlatforms((prev) => ({ ...prev, [connected]: true }));
      toast.success(`${connected.charAt(0).toUpperCase() + connected.slice(1)} connected successfully!`);
      
      // Auto-advance step based on what was connected
      if (connected === "github") setCurrentStep(2); // Move to Vercel
      if (connected === "vercel") setCurrentStep(3); // Move to Supabase
    }
  }, [searchParams]);

  const step = STEPS[currentStep];

  /* ── Password step ── */
  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not found");

      const { error: pwError } = await supabase.auth.updateUser({ password });
      if (pwError) throw pwError;

      const { error: dbError } = await supabase
        .from("users")
        // @ts-expect-error: supabase types need to be updated
        .update({ phone_number: phone })
        .eq("id", user.id);
      if (dbError) throw dbError;

      toast.success("Account secured successfully!");
      setCurrentStep(1);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  /* ── Platform connection ── */
  const handleConnect = async (platform: string) => {
    if (platform === "github") {
      setLoading(true);
      const { error } = await supabase.auth.linkIdentity({
        provider: "github",
        options: {
          redirectTo: `${window.location.origin}/onboarding?connected=github`,
        }
      });
      if (error) {
        toast.error(error.message);
        setLoading(false);
      }
      return;
    }

    if (platform === "vercel") {
      window.location.href = `/api/integrations/vercel/connect?next=/onboarding?connected=vercel`;
      return;
    }

    if (platform === "supabase") {
      window.location.href = `/api/integrations/supabase/connect?next=/onboarding?connected=supabase`;
      return;
    }
  };

  /* ── Skip step ── */
  const handleSkip = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      finishOnboarding();
    }
  };

  /* ── Next step (after connecting) ── */
  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      finishOnboarding();
    }
  };

  /* ── Complete onboarding ── */
  const finishOnboarding = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from("users")
          // @ts-expect-error: supabase types need to be updated
          .update({ onboarding_completed: true })
          .eq("id", user.id);
      }
      router.push("/dashboard");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex flex-col items-center justify-center p-6 transition-colors duration-300">
      {/* ── Logo ── */}
      <div className="flex items-center gap-2 mb-10 select-none">
        <Hexagon className="w-8 h-8 text-foreground" strokeWidth={1.5} />
        <div className="flex items-baseline mt-1">
          <span className="text-3xl font-extrabold tracking-tighter font-serif text-foreground">T</span>
          <span className="text-2xl font-light tracking-widest font-sans text-muted-foreground">R</span>
          <span className="text-3xl font-black font-mono text-primary">O</span>
          <span className="text-2xl font-medium italic font-serif text-foreground">Y</span>
        </div>
      </div>

      {/* ── Progress bar ── */}
      <div className="w-full max-w-[480px] mb-8">
        <div className="flex items-center justify-between mb-3">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold border-2 transition-all duration-300 ${
                  i < currentStep
                    ? "bg-green-500 border-green-500 text-white"
                    : i === currentStep
                    ? "border-foreground text-foreground bg-transparent"
                    : "border-zinc-300 dark:border-zinc-700 text-zinc-400 dark:text-zinc-600"
                }`}
              >
                {i < currentStep ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={`w-16 sm:w-20 h-0.5 mx-1 transition-colors duration-300 ${
                    i < currentStep
                      ? "bg-green-500"
                      : "bg-zinc-200 dark:bg-zinc-800"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-[11px] text-muted-foreground px-1">
          {STEPS.map((s) => (
            <span key={s.id} className="w-8 text-center">{s.label}</span>
          ))}
        </div>
      </div>

      {/* ── Step content ── */}
      <div className="w-full max-w-[480px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            {/* ──────────────── STEP 1: PASSWORD ──────────────── */}
            {step.id === "password" && (
              <div className="bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-white/10 rounded-2xl p-8 shadow-sm">
                <h2 className="text-2xl font-semibold tracking-tight mb-2">
                  Set your password
                </h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Create a password so you can also log in with your email. This is required.
                </p>

                <form onSubmit={handleSetPassword} className="space-y-4">
                  <div className="space-y-1.5">
                    <label htmlFor="phone" className="text-[13px] font-medium text-zinc-700 dark:text-zinc-300">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-zinc-400 dark:text-zinc-500" />
                      <input
                        id="phone"
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
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
                      Confirm Password
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
                    disabled={loading || password.length < 6 || !phone}
                    className="w-full h-11 mt-2 bg-foreground text-background hover:opacity-90 rounded-[10px] font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        Continue
                        <ChevronRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* ──────────────── STEP 2: GITHUB ──────────────── */}
            {step.id === "github" && (
              <div className="bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-white/10 rounded-2xl p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center">
                    <GithubLogo size={22} />
                  </div>
                  <h2 className="text-2xl font-semibold tracking-tight">Connect GitHub</h2>
                </div>
                <p className="text-sm text-muted-foreground mb-6">
                  Link your GitHub account to import repositories and enable automatic deployments.
                </p>

                {connectedPlatforms.github ? (
                  <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-xl mb-4">
                    <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <span className="text-sm font-medium text-green-700 dark:text-green-400">GitHub connected successfully!</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleConnect("github")}
                    className="w-full h-12 flex items-center justify-center gap-3 bg-zinc-900 dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 rounded-xl font-medium transition-colors mb-4"
                  >
                    <GithubLogo size={20} />
                    Connect GitHub
                    <ExternalLink className="w-4 h-4 ml-1 opacity-50" />
                  </button>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={handleSkip}
                    className="flex-1 h-11 border border-zinc-200 dark:border-white/10 rounded-[10px] text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-all flex items-center justify-center gap-2"
                  >
                    <SkipForward className="w-4 h-4" />
                    Skip
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={!connectedPlatforms.github}
                    className="flex-1 h-11 bg-foreground text-background hover:opacity-90 rounded-[10px] font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    Continue
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ──────────────── STEP 3: VERCEL ──────────────── */}
            {step.id === "vercel" && (
              <div className="bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-white/10 rounded-2xl p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-zinc-900 dark:bg-white flex items-center justify-center">
                    <VercelLogo size={18} />
                  </div>
                  <h2 className="text-2xl font-semibold tracking-tight">Connect Vercel</h2>
                </div>
                <p className="text-sm text-muted-foreground mb-6">
                  Link your Vercel account to deploy and manage your projects directly from TROY.
                </p>

                {connectedPlatforms.vercel ? (
                  <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-xl mb-4">
                    <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <span className="text-sm font-medium text-green-700 dark:text-green-400">Vercel connected successfully!</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleConnect("vercel")}
                    className="w-full h-12 flex items-center justify-center gap-3 bg-zinc-900 dark:bg-white/10 hover:bg-zinc-800 dark:hover:bg-white/15 text-white rounded-xl font-medium transition-colors mb-4"
                  >
                    <VercelLogo size={18} />
                    Connect Vercel
                    <ExternalLink className="w-4 h-4 ml-1 opacity-50" />
                  </button>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={handleSkip}
                    className="flex-1 h-11 border border-zinc-200 dark:border-white/10 rounded-[10px] text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-all flex items-center justify-center gap-2"
                  >
                    <SkipForward className="w-4 h-4" />
                    Skip
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={!connectedPlatforms.vercel}
                    className="flex-1 h-11 bg-foreground text-background hover:opacity-90 rounded-[10px] font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    Continue
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ──────────────── STEP 4: SUPABASE ──────────────── */}
            {step.id === "supabase" && (
              <div className="bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-white/10 rounded-2xl p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center">
                    <SupabaseLogo size={22} />
                  </div>
                  <h2 className="text-2xl font-semibold tracking-tight">Connect Supabase</h2>
                </div>
                <p className="text-sm text-muted-foreground mb-6">
                  Link your Supabase project to manage databases, auth, and storage from TROY.
                </p>

                {connectedPlatforms.supabase ? (
                  <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-xl mb-4">
                    <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <span className="text-sm font-medium text-green-700 dark:text-green-400">Supabase connected successfully!</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleConnect("supabase")}
                    className="w-full h-12 flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-colors mb-4"
                  >
                    <SupabaseLogo size={18} />
                    Connect Supabase
                    <ExternalLink className="w-4 h-4 ml-1 opacity-50" />
                  </button>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={handleSkip}
                    className="flex-1 h-11 border border-zinc-200 dark:border-white/10 rounded-[10px] text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-all flex items-center justify-center gap-2"
                  >
                    <SkipForward className="w-4 h-4" />
                    Skip
                  </button>
                  <button
                    onClick={finishOnboarding}
                    disabled={loading}
                    className="flex-1 h-11 bg-foreground text-background hover:opacity-90 rounded-[10px] font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        Go to Dashboard
                        <ChevronRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Step indicator text ── */}
      <p className="text-xs text-muted-foreground mt-6">
        Step {currentStep + 1} of {STEPS.length}
        {!step.required && " · Optional"}
      </p>
    </div>
  );
}
