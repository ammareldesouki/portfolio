import type { Metadata } from "next";
import "./globals.css";
import { connectDatabase } from "@/lib/server/config/database";
import { Settings } from "@/lib/server/models/Settings";

export async function generateMetadata(): Promise<Metadata> {
  try {
    await connectDatabase();
    const settings = await Settings.findOne().sort({ createdAt: -1 }).lean();
    if (settings) {
      return {
        title: settings.siteTitle || "Portfolio",
        description: settings.metaDescription || "",
        icons: settings.favicon ? { icon: settings.favicon } : undefined,
      };
    }
  } catch {
    // fall back to defaults
  }
  return {
    title: "Portfolio",
    description: "Personal portfolio",
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Geist:wght@400;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;600&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-background text-on-background font-body-base antialiased selection:bg-primary-container selection:text-on-primary-container">
        {children}
      </body>
    </html>
  );
}
