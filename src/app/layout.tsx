import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

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
    <html lang="en" className="dark">
      <body className={inter.variable}>
        {children}
        <Toaster
          theme="dark"
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#0d1117",
              border: "1px solid #1e2d40",
              color: "#f0f4ff",
            },
          }}
        />
      </body>
    </html>
  );
}
