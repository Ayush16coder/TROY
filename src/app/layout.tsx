import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: { default: "TROY", template: "%s | TROY" },
  description:
    "The unified AI-powered developer operating system. Connect GitHub, Vercel, Supabase, and your entire stack into one real-time synchronized platform.",
  keywords: ["developer platform", "CI/CD", "deployment", "GitHub", "Vercel", "AI", "DevOps"],
  authors: [{ name: "TROY" }],
  openGraph: {
    title: "TROY",
    description: "The unified AI-powered developer operating system.",
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
    <html lang="en" suppressHydrationWarning className={cn("font-sans", geist.variable)}>
      <body className={inter.variable}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
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
