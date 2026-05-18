import { ReactNode } from "react";
import { AuthVisuals } from "@/components/auth/auth-visuals";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#0a0f18] text-white overflow-hidden">
      <AuthVisuals />
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 relative">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
}
