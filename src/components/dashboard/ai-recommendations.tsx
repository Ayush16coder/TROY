"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

const RECOMMENDATIONS = [
  {
    title: "Optimize build cache for api-gateway",
    detail: "Build times increased 34% over 7 days. Enable remote caching on Vercel.",
    priority: "medium",
  },
  {
    title: "Supabase connection pool nearing limit",
    detail: "Peak connections at 87% during deploy windows. Consider PgBouncer.",
    priority: "high",
  },
  {
    title: "3 stale preview deployments",
    detail: "Branches merged >14 days ago still have active preview URLs.",
    priority: "low",
  },
];

export function AIRecommendations() {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">AI Recommendations</h3>
        </div>
        <Link href="/dashboard/ai" className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
          Open workspace <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
      <div className="space-y-3">
        {RECOMMENDATIONS.map((r, i) => (
          <motion.div
            key={r.title}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="p-3 rounded-lg bg-secondary/50 border border-border/50 hover:border-border transition-colors cursor-pointer"
          >
            <div className="flex items-start gap-2">
              <span
                className={`mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                  r.priority === "high" ? "bg-rose-500" : r.priority === "medium" ? "bg-amber-500" : "bg-muted-foreground"
                }`}
              />
              <div>
                <p className="text-sm font-medium text-foreground">{r.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{r.detail}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
