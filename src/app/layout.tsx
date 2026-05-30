import type { Metadata } from "next";
import { Inter, Geist, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: { default: "TROY", template: "%s | TROY" },
  description:
    "The Operating System For Modern Development. Connect GitHub, Vercel, Supabase, AWS, and your entire stack into one synchronized control center.",
  keywords: ["developer platform", "CI/CD", "deployment", "infrastructure", "DevOps", "GitHub", "Vercel"],
  authors: [{ name: "TROY" }],
  openGraph: {
    title: "TROY — The Operating System For Modern Development",
    description: "Unified infrastructure control center for elite engineering teams.",
    type: "website",
    siteName: "TROY",
  },
  twitter: { card: "summary_large_image", title: "TROY" },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("font-sans", geist.variable, inter.variable, jetbrains.variable)}>
      <body className="antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem enableColorScheme>
          <QueryProvider>
            {children}
            <Toaster
              position="bottom-right"
              toastOptions={{
                className: "bg-background text-foreground border-border",
              }}
            />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
