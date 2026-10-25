import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { DemoControlBar } from "@/components/demo-control-bar";

export const metadata: Metadata = {
  title: "UM SkillBridge | Learn One. Teach One. Grow Together.",
  description: "UM SkillBridge is a proposed student-powered skill exchange platform connecting Universiti Malaya students through free, collaborative peer learning. Exchange skills using time-based SkillCredits — no money required.",
  keywords: ["UM SkillBridge", "Universiti Malaya", "skill exchange", "peer learning", "time banking", "student platform"],
  openGraph: {
    title: "UM SkillBridge | Learn One. Teach One. Grow Together.",
    description: "Connect with students across Universiti Malaya. Teach what you know, learn what you love, and grow together — without spending a ringgit.",
    type: "website",
    locale: "en_MY",
    siteName: "UM SkillBridge",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var params = new URLSearchParams(window.location.search);
                var q = params.get('theme');
                var t = q || localStorage.getItem('um-skillbridge-theme');
                if (t) { document.documentElement.setAttribute('data-theme', t); }
                else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                  document.documentElement.setAttribute('data-theme', 'dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased" style={{ fontFamily: 'var(--font-body)' }}>
        <ThemeProvider>
          {children}
          <DemoControlBar />
        </ThemeProvider>
      </body>
    </html>
  );
}
