export const metadata = { title: "Logs" };
import { LogsTerminal } from "@/components/logs/logs-terminal";

export default function LogsPage() {
  return (
    <div className="max-w-7xl mx-auto h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Logs Terminal</h1>
        <p className="text-sm text-zinc-500 mt-0.5">Live streaming deployment logs from all providers</p>
      </div>
      <LogsTerminal />
    </div>
  );
}
