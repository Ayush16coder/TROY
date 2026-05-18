export const metadata = { title: "AI Workspace" };

export default function AIPage() {
  return (
    <div className="max-w-7xl mx-auto h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">AI Workspace</h1>
        <p className="text-sm text-zinc-500 mt-0.5">
          Multi-model AI — debug deployments, analyze logs, get infrastructure advice
        </p>
      </div>
      <AIWorkspaceClient />
    </div>
  );
}

import { AIWorkspaceClient } from "@/components/ai/ai-workspace";
