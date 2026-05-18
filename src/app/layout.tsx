import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: { default: "NexusForge", template: "%s | NexusForge" },
  description:
    "The unified AI-powered developer operating system. Connect GitHub, Vercel, Supabase, and your entire stack into one real-time synchronized platform.",
  keywords: ["developer platform", "CI/CD", "deployment", "GitHub", "Vercel", "AI", "DevOps"],
  authors: [{ name: "NexusForge" }],
  openGraph: {
    title: "NexusForge",
    description: "The unified AI-powered developer operating system.",
    type: "website",
    siteName: "NexusForge",
  },
  twitter: { card: "summary_large_image", title: "NexusForge" },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.variable}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              className: "bg-background text-foreground border-border",
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
