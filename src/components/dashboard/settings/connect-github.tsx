"use client";

import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export function ConnectGithubButton() {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleConnect = async () => {
    setLoading(true);
    const { error } = await supabase.auth.linkIdentity({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/dashboard/integrations?sync=github`,
      }
    });
    if (error) {
      toast.error(error.message);
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleConnect}
      disabled={loading}
      className="h-9 px-4 flex items-center justify-center gap-2 bg-zinc-900 dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      Connect GitHub
    </button>
  );
}
