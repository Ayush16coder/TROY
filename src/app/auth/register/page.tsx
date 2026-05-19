"use client";

import { motion } from "framer-motion";
import { GitBranch, Mail, Lock, Eye, EyeOff, User, Loader2, Building } from "lucide-react";
import Link from "next/link";
import { useState, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

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
      <Card className="w-full border-border bg-card shadow-2xl">
        <CardHeader className="space-y-2 text-center pb-6">
          <CardTitle className="text-3xl font-semibold tracking-tight">Create account</CardTitle>
          <CardDescription className="text-muted-foreground">
            Join the next-generation deployment orchestrator.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Button
            variant="outline"
            className="w-full h-11 relative group bg-background"
            onClick={handleGithubSignup}
            disabled={githubLoading}
          >
            {githubLoading ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2 text-muted-foreground" />
            ) : (
              <GitBranch className="w-4 h-4 mr-2" />
            )}
            <span>{githubLoading ? "Connecting..." : "Sign up with GitHub"}</span>
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground font-medium tracking-wider">
                Or sign up with email
              </span>
            </div>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-muted-foreground">Full Name</Label>
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    id="fullName"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="pl-9 h-11 bg-background"
                    placeholder="John Doe"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="workspace" className="text-muted-foreground">Workspace</Label>
                <div className="relative group">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    id="workspace"
                    type="text"
                    required
                    value={workspace}
                    onChange={(e) => setWorkspace(e.target.value)}
                    className="pl-9 h-11 bg-background"
                    placeholder="Acme Inc"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-muted-foreground">Email Address</Label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9 h-11 bg-background"
                  placeholder="you@company.com"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-muted-foreground">Password</Label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9 pr-9 h-11 bg-background"
                  placeholder="••••••••"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition-colors rounded-md"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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
                            : 'bg-muted'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground w-12 text-right">
                    {passwordStrength < 2 ? 'Weak' : passwordStrength < 4 ? 'Good' : 'Strong'}
                  </span>
                </div>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading || (password.length > 0 && passwordStrength < 2)}
              className="w-full h-11 font-medium mt-4 group"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Create Account"}
            </Button>
          </form>

          <p className="text-center text-muted-foreground text-xs mt-6">
            By signing up, you agree to our{" "}
            <Link href="#" className="text-foreground hover:text-primary transition-colors">Terms</Link> and{" "}
            <Link href="#" className="text-foreground hover:text-primary transition-colors">Privacy Policy</Link>.
          </p>
        </CardContent>
        
        <CardFooter className="flex justify-center pt-2 pb-6">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/auth/login" className="font-medium text-foreground hover:text-primary transition-colors">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
