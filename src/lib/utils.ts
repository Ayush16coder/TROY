import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const then = new Date(date);
  const diff = now.getTime() - then.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return `${seconds}s ago`;
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return formatDate(date);
}

export function truncate(str: string, length: number): string {
  return str.length > length ? `${str.slice(0, length)}...` : str;
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    ready: "text-emerald-400",
    success: "text-emerald-400",
    building: "text-amber-400",
    queued: "text-blue-400",
    error: "text-red-400",
    failed: "text-red-400",
    cancelled: "text-zinc-400",
    pending: "text-zinc-400",
  };
  return map[status.toLowerCase()] ?? "text-zinc-400";
}

export function getStatusBadgeClass(status: string): string {
  const map: Record<string, string> = {
    ready: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    building: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    queued: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    error: "bg-red-500/10 text-red-400 border-red-500/20",
    failed: "bg-red-500/10 text-red-400 border-red-500/20",
    cancelled: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
    pending: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
  };
  return map[status.toLowerCase()] ?? "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";
}
