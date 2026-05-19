import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatRelativeTime(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
}

export function getStatusBadgeClass(status: string) {
  switch (status.toLowerCase()) {
    case "success":
    case "deployed":
      return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
    case "building":
    case "syncing":
    case "deploying":
      return "bg-blue-500/10 text-blue-500 border-blue-500/20";
    case "failed":
    case "error":
      return "bg-red-500/10 text-red-500 border-red-500/20";
    case "cancelled":
    case "stopped":
      return "bg-zinc-500/10 text-zinc-500 border-zinc-500/20";
    default:
      return "bg-secondary text-muted-foreground border-border";
  }
}
