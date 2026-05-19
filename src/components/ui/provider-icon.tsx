"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Cloud, MessageSquare, Sparkles } from "lucide-react";
import {
  SiGithub,
  SiVercel,
  SiSupabase,
  SiRailway,
  SiDocker,
  SiKubernetes,
  SiCloudflare,
  SiNetlify,
  SiGitlab,
  SiBitbucket,
  SiPostgresql,
  SiRedis,
  SiSentry,
  SiDiscord,
  SiFigma,
  SiStripe,
  SiLinear,
  SiRender,
  SiGooglegemini,
  SiAnthropic,
} from "@icons-pack/react-simple-icons";

export type ProviderSlug =
  | "github" | "vercel" | "supabase" | "railway" | "docker"
  | "kubernetes" | "aws" | "cloudflare" | "netlify" | "openai"
  | "anthropic" | "gemini" | "gitlab" | "bitbucket" | "postgresql"
  | "redis" | "sentry" | "slack" | "discord" | "figma"
  | "stripe" | "linear" | "render";

export type ProviderStatus = "connected" | "syncing" | "deploying" | "failed" | "idle";

// Lucide fallback wrappers to match Simple Icons signature
const AwsIcon = ({ size, style, className }: { size?: number; style?: React.CSSProperties; className?: string }) => (
  <Cloud size={size} style={style} className={className} strokeWidth={1.5} />
);
const OpenAiIcon = ({ size, style, className }: { size?: number; style?: React.CSSProperties; className?: string }) => (
  <Sparkles size={size} style={style} className={className} strokeWidth={1.5} />
);
const SlackIcon = ({ size, style, className }: { size?: number; style?: React.CSSProperties; className?: string }) => (
  <MessageSquare size={size} style={style} className={className} strokeWidth={1.5} />
);

export interface ProviderConfig {
  icon: React.ElementType;
  label: string;
  monoColor: string;
}

export const PROVIDERS: Record<ProviderSlug, ProviderConfig> = {
  github:     { icon: SiGithub,       label: "GitHub",        monoColor: "#ffffff" },
  vercel:     { icon: SiVercel,       label: "Vercel",        monoColor: "#ffffff" },
  supabase:   { icon: SiSupabase,     label: "Supabase",      monoColor: "#3ecf8e" },
  railway:    { icon: SiRailway,      label: "Railway",       monoColor: "#c77dff" },
  docker:     { icon: SiDocker,       label: "Docker",        monoColor: "#2496ed" },
  kubernetes: { icon: SiKubernetes,   label: "Kubernetes",    monoColor: "#326ce5" },
  aws:        { icon: AwsIcon,        label: "AWS",           monoColor: "#ff9900" },
  cloudflare: { icon: SiCloudflare,   label: "Cloudflare",    monoColor: "#f38020" },
  netlify:    { icon: SiNetlify,      label: "Netlify",       monoColor: "#00c7b7" },
  openai:     { icon: OpenAiIcon,     label: "OpenAI",        monoColor: "#a0a0a0" },
  anthropic:  { icon: SiAnthropic,    label: "Anthropic",     monoColor: "#cc9b7a" },
  gemini:     { icon: SiGooglegemini, label: "Gemini",        monoColor: "#8ab4f8" },
  gitlab:     { icon: SiGitlab,       label: "GitLab",        monoColor: "#fc6d26" },
  bitbucket:  { icon: SiBitbucket,    label: "Bitbucket",     monoColor: "#0052cc" },
  postgresql: { icon: SiPostgresql,   label: "PostgreSQL",    monoColor: "#4169e1" },
  redis:      { icon: SiRedis,        label: "Redis",         monoColor: "#dc382d" },
  sentry:     { icon: SiSentry,       label: "Sentry",        monoColor: "#aa99ec" },
  slack:      { icon: SlackIcon,      label: "Slack",         monoColor: "#e01e5a" },
  discord:    { icon: SiDiscord,      label: "Discord",       monoColor: "#5865f2" },
  figma:      { icon: SiFigma,        label: "Figma",         monoColor: "#f24e1e" },
  stripe:     { icon: SiStripe,       label: "Stripe",        monoColor: "#635bff" },
  linear:     { icon: SiLinear,       label: "Linear",        monoColor: "#5e6ad2" },
  render:     { icon: SiRender,       label: "Render",        monoColor: "#46e3b7" },
};

// Status indicator
function StatusDot({ status }: { status: ProviderStatus }) {
  const colors: Record<ProviderStatus, string> = {
    connected: "bg-emerald-500",
    syncing:   "bg-blue-400",
    deploying: "bg-amber-400",
    failed:    "bg-red-500",
    idle:      "bg-zinc-500",
  };
  return (
    <span className="relative flex w-2 h-2">
      {(status === "syncing" || status === "deploying") && (
        <motion.span
          animate={{ scale: [1, 2.2], opacity: [0.7, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
          className={cn("absolute inline-flex w-full h-full rounded-full", colors[status])}
        />
      )}
      <span className={cn("relative inline-flex w-2 h-2 rounded-full", colors[status])} />
    </span>
  );
}

interface ProviderIconProps {
  provider: ProviderSlug;
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  status?: ProviderStatus;
  showLabel?: boolean;
  className?: string;
  variant?: "default" | "ghost";
}

const sizeMap = {
  sm: { container: "w-9 h-9 rounded-lg",   iconSize: 15, text: "text-[10px]" },
  md: { container: "w-11 h-11 rounded-xl",  iconSize: 20, text: "text-xs"    },
  lg: { container: "w-14 h-14 rounded-2xl", iconSize: 26, text: "text-xs"    },
  xl: { container: "w-18 h-18 rounded-2xl", iconSize: 32, text: "text-sm"    },
  "2xl": { container: "w-24 h-24 rounded-3xl", iconSize: 56, text: "text-base" },
};

export function ProviderIcon({ provider, size = "md", status, showLabel = false, className, variant = "default" }: ProviderIconProps) {
  const config = PROVIDERS[provider];
  if (!config) return null;
  const { container, iconSize, text } = sizeMap[size];
  const Icon = config.icon;

  return (
    <div className={cn("flex flex-col items-center gap-1.5", className)}>
      <motion.div
        whileHover={{ scale: 1.08, y: -1 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 420, damping: 17 }}
        className={cn(
          "relative flex items-center justify-center transition-shadow duration-200 cursor-default",
          variant === "default" ? "bg-card border border-border shadow-sm hover:shadow-md" : "bg-transparent border-transparent shadow-none",
          container
        )}
        title={config.label}
      >
        {/* Brand color hover glow */}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 rounded-inherit"
          style={{
            background: `radial-gradient(circle at center, ${config.monoColor}18 0%, transparent 70%)`,
            borderRadius: "inherit",
          }}
        />

        <Icon
          size={iconSize}
          style={{ color: config.monoColor }}
          className="relative z-10"
        />

        {/* Status badge */}
        {status && (
          <div className="absolute -top-1 -right-1 z-20">
            <StatusDot status={status} />
          </div>
        )}
      </motion.div>

      {showLabel && (
        <span className={cn("font-medium text-muted-foreground whitespace-nowrap", text)}>
          {config.label}
        </span>
      )}
    </div>
  );
}

// Inline badge for navbar / cards
export function ProviderBadge({ provider, className }: { provider: ProviderSlug; className?: string }) {
  const config = PROVIDERS[provider];
  if (!config) return null;
  const Icon = config.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary border border-border",
        "text-[11px] font-medium text-muted-foreground hover:border-foreground/20 transition-colors cursor-default",
        className
      )}
      title={config.label}
    >
      <Icon size={12} style={{ color: config.monoColor }} />
      {config.label}
    </span>
  );
}

// Provider grid for integration sections
export function ProviderGrid({
  providers,
  size = "md",
  className,
}: {
  providers: { slug: ProviderSlug; status?: ProviderStatus }[];
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-center gap-4", className)}>
      {providers.map(({ slug, status }, i) => (
        <motion.div
          key={slug}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <ProviderIcon provider={slug} size={size} status={status} showLabel />
        </motion.div>
      ))}
    </div>
  );
}
