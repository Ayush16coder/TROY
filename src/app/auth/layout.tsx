import { ReactNode } from "react";
import { AuthVisuals } from "@/components/auth/auth-visuals";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background text-foreground overflow-hidden">
      <AuthVisuals />
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 relative">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
}
