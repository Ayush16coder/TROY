"use client";

import { useState } from "react";
import { Settings, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

function GithubLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function VercelLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 76 65" fill="currentColor" className={className}>
      <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
    </svg>
  );
}

function SupabaseLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 109 113" fill="none" className={className}>
      <path d="M63.7076 110.284C60.8481 113.885 55.0502 111.912 54.9813 107.314L53.9738 40.0627H99.3819C107.659 40.0627 112.198 49.7351 106.943 55.9467L63.7076 110.284Z" fill="url(#sb1)" />
      <path d="M63.7076 110.284C60.8481 113.885 55.0502 111.912 54.9813 107.314L53.9738 40.0627H99.3819C107.659 40.0627 112.198 49.7351 106.943 55.9467L63.7076 110.284Z" fill="url(#sb2)" fillOpacity="0.2" />
      <path d="M45.317 2.07103C48.1765 -1.53037 53.9745 0.442937 54.0434 5.04075L54.4849 72.2922H9.07688C0.803704 72.2922 -3.73825 62.6198 1.51677 56.4082L45.317 2.07103Z" fill="#3ECF8E" />
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

function RailwayLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 400" fill="none" className={className}>
      <path d="M125.642 165.748L114.777 222.951L71.3093 189.967L84.2183 121.996L125.642 165.748Z" fill="currentColor"/>
      <path d="M136.183 162.775L125.319 219.978L191.071 251.654L199.89 205.228L136.183 162.775Z" fill="currentColor"/>
      <path d="M228.69 110.033L217.825 167.236L152.073 135.56L143.254 181.986L207.039 224.36L217.904 167.157L261.371 200.141L248.462 268.112L207.039 224.36L274.68 181.986L228.69 110.033Z" fill="currentColor"/>
    </svg>
  );
}

function RenderLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M22.99 12l-5.74-5.74-5.74 5.74 5.74 5.74 5.74-5.74zm-22.98 0l5.74 5.74 5.74-5.74-5.74-5.74-5.74 5.74zm11.49-11.49l-5.74 5.74 5.74 5.74 5.74-5.74-5.74-5.74zm0 22.98l-5.74-5.74 5.74-5.74 5.74 5.74-5.74 5.74z"/>
    </svg>
  );
}

function AwsLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M13.435 15.011c-2.317.935-4.992 1.341-7.534 1.135-2.274-.183-4.471-.854-6.388-1.93-.053-.03-.075-.097-.046-.151.054-.105.18-.28.32-.472.043-.057.126-.068.181-.022 1.776 1.488 4.093 2.378 6.55 2.502 2.766.14 5.562-.432 7.973-1.606.07-.034.152.012.164.088.03.189.066.388.106.586.012.062-.038.118-.097.135-.386.108-.813.22-1.229.335zM23.111 12.384c-.035-.06-.113-.07-.163-.021-1.127 1.109-2.613 2.112-4.425 2.924-.078.035-.079.146-.002.181 1.631.733 3.655 1.171 5.923.948.067-.006.109-.077.08-.135-.333-.671-.806-1.558-1.413-2.897zm.797 2.355c-2.385.742-4.981-.137-7.234-1.393-.112-.063-.052-.225.074-.225 1.879 0 3.69-.646 5.228-1.745.093-.066.216.035.158.136-.264.455-.56 1.05-.884 1.701.378-.456.745-.968 1.096-1.528.05-.081.17-.075.216.009.645 1.168 1.131 2.474 1.345 2.99.034.084-.047.164-.132.13zM15.42 12.316c-.22.064-.442.12-.667.168.04-.15.087-.315.138-.492.203-.706.495-1.942.548-2.663.023-.332.007-.58-.046-.745-.094-.286-.339-.42-.716-.42-.647 0-1.428.46-2.125.962-.835.6-1.636 1.488-2.12 2.308l-.348.618c-.288.544-.657 1.366-1.077 2.428-.46 1.175-.826 2.213-1.091 3.093h2.392c.28-1.082.722-2.396.963-3.136.257-.792.59-1.634.821-2.185.703-.131 1.503-.314 2.115-.494-1.394 2.05-3.037 3.39-5.111 4.14-1.296.471-2.585.576-3.791.31-1.353-.298-2.45-1.246-3.111-2.69-.474-1.035-.615-2.22-.387-3.232.253-1.127.915-2.176 1.838-2.92.836-.671 1.821-1.086 2.879-1.213.911-.11 1.767.032 2.466.41.343.185.642.422.884.7l.115-.889h2.32c-.147 1.05-.44 2.951-1.135 5.372v.001l4.045-1.427zm-9.336.564c-.114.542.067 1.075.452 1.332.285.19.67.24 1.056.136.877-.235 1.943-.915 3.011-1.92-1.503.208-2.637.317-3.522.317-.468 0-.821-.048-1.037-.145.021-.01.031.065.04.28zM19.06 6.815c0 .35-.046.726-.141 1.139-.074.32-.196.7-.354 1.119-.488 1.285-1.248 2.518-2.164 3.513-.783.85-1.678 1.528-2.573 1.956.76-.713 1.488-1.597 2.086-2.535.532-.835.952-1.74 1.205-2.6.216-.732.288-1.391.204-1.874-.08-.458-.337-.812-.731-1.009-.434-.216-1.011-.237-1.62-.061-.836.241-1.785.826-2.671 1.646-.867.8-1.643 1.815-2.203 2.882l.859.608c.556-1.081 1.328-2.102 2.189-2.898.771-.715 1.59-1.22 2.296-1.424.316-.091.616-.109.84-.05.275.074.457.25.568.513.061.144.119.349.123.606l.088-.43v-.001h2.001z"/>
    </svg>
  );
}

const INTEGRATIONS = [
  {
    id: "github",
    name: "GitHub",
    description: "Sync repositories, track commits, and trigger deployments automatically on push.",
    icon: GithubLogo,
    status: "connected",
    color: "text-white dark:text-zinc-900",
    bg: "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900",
  },
  {
    id: "vercel",
    name: "Vercel",
    description: "Deploy Next.js apps globally. View preview URLs and live streaming build logs.",
    icon: VercelLogo,
    status: "connected",
    color: "text-white dark:text-zinc-900",
    bg: "bg-black dark:bg-white text-white dark:text-zinc-900",
  },
  {
    id: "supabase",
    name: "Supabase",
    description: "Connect your PostgreSQL database, authentication, and realtime subscriptions.",
    icon: SupabaseLogo,
    status: "disconnected",
    color: "", // SVG handles its own colors
    bg: "bg-emerald-600",
  },
  {
    id: "railway",
    name: "Railway",
    description: "Deploy backend services, worker dynos, and databases instantly.",
    icon: RailwayLogo,
    status: "disconnected",
    color: "text-white",
    bg: "bg-[#0b0d0e]", // Railway almost black
  },
  {
    id: "render",
    name: "Render",
    description: "Unified cloud to build and run all your apps and websites.",
    icon: RenderLogo,
    status: "disconnected",
    color: "text-white",
    bg: "bg-[#000000]",
  },
  {
    id: "aws",
    name: "AWS EC2",
    description: "Deploy and manage containerized infrastructure on Amazon Web Services.",
    icon: AwsLogo,
    status: "disconnected",
    color: "text-white",
    bg: "bg-[#232F3E]", // AWS color
  },
];

export function IntegrationsGrid() {
  const [loading, setLoading] = useState<string | null>(null);

  const toggleConnection = (id: string) => {
    setLoading(id);
    // Simulate API call
    setTimeout(() => {
      setLoading(null);
    }, 1500);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {INTEGRATIONS.map((integration) => (
        <div
          key={integration.id}
          className="bg-white dark:bg-zinc-900/60 p-5 rounded-2xl border border-zinc-200 dark:border-white/10 hover:border-blue-500/30 transition-all group flex flex-col shadow-sm"
        >
          <div className="flex items-start justify-between mb-4">
            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0", integration.bg)}>
              <integration.icon className={cn("w-6 h-6", integration.color)} />
            </div>
            {integration.status === "connected" ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-500/20">
                <CheckCircle2 className="w-3 h-3" />
                Connected
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-medium bg-zinc-100 dark:bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-500/20">
                Not Connected
              </span>
            )}
          </div>
          
          <h3 className="font-semibold text-foreground text-base mb-1.5">{integration.name}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed flex-1">
            {integration.description}
          </p>

          <div className="mt-6 pt-4 border-t border-zinc-200 dark:border-white/10 flex items-center justify-between">
            <button className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
              <Settings className="w-3.5 h-3.5" /> Configure
            </button>
            <button
              onClick={() => toggleConnection(integration.id)}
              disabled={loading === integration.id}
              className={cn(
                "px-4 py-2 rounded-lg text-xs font-semibold transition-all disabled:opacity-50",
                integration.status === "connected"
                  ? "bg-zinc-900 dark:bg-white/10 hover:bg-zinc-800 dark:hover:bg-white/20 text-white"
                  : "bg-foreground text-background hover:opacity-90"
              )}
            >
              {loading === integration.id 
                ? "Connecting..." 
                : integration.status === "connected" ? "Disconnect" : "Connect"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
