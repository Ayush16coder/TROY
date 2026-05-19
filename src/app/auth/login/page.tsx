"use client";

import { motion } from "framer-motion";
import { GitBranch, Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

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
      <Card className="w-full border-border bg-card shadow-2xl">
        <CardHeader className="space-y-2 text-center pb-6">
          <CardTitle className="text-3xl font-semibold tracking-tight">Sign in</CardTitle>
          <CardDescription className="text-muted-foreground">
            Enter your details to access your workspace.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Button
            variant="outline"
            className="w-full h-11 relative group bg-background"
            onClick={handleGitHubLogin}
            disabled={githubLoading}
          >
            {githubLoading ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2 text-muted-foreground" />
            ) : (
              <GitBranch className="w-4 h-4 mr-2" />
            )}
            <span>{githubLoading ? "Connecting..." : "Continue with GitHub"}</span>
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground font-medium tracking-wider">
                Or sign in with email
              </span>
            </div>
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-muted-foreground">Email Address</Label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-9 h-11 bg-background"
                  disabled={loading}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-muted-foreground">Password</Label>
                <Link href="/auth/forgot-password" className="text-xs text-primary hover:underline underline-offset-4">
                  Forgot password?
                </Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  id="password"
                  type={showPw ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-9 pr-9 h-11 bg-background"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 font-medium mt-2 group"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Sign in"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center pt-2 pb-6">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/auth/register" className="font-medium text-foreground hover:text-primary transition-colors">
              Create one free
            </Link>
          </p>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
