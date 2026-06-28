"use client";

import { useEffect, useState } from "react";
import { settingsApi, Settings } from "@/lib/api/settings";

export function HeroSection() {
  const [settings, setSettings] = useState<Settings | null>(null);

  useEffect(() => {
    settingsApi.getPublic()
      .then((res) => setSettings(res.data || null))
      .catch(() => {});
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center px-margin-mobile md:px-margin-desktop overflow-hidden" id="home">
      <div className="absolute inset-0 hero-glow z-0" />

      <div className="relative z-10 w-full max-w-content mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="flex flex-col gap-8 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-surface-container-low w-max">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="font-code-sm text-code-sm text-on-surface-variant">
              Available for new projects
            </span>
          </div>

          <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface">
            {settings?.tagline || "Building the future of mobile with Flutter."}
          </h1>

          <p className="font-body-base text-body-base text-on-surface-variant max-w-xl">
            {settings?.metaDescription || "I engineer high-performance, cross-platform applications with a focus on fluid animations, native-like feel, and scalable architecture."}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-4">
            <a href="/projects" className="btn-primary px-8 py-4 rounded-xl font-code-sm text-code-sm font-bold tracking-wide transition-all">
              View Work
            </a>
            {settings?.socialLinks?.map((link, i) => (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost px-8 py-4 rounded-xl font-code-sm text-code-sm font-bold tracking-wide transition-all flex items-center gap-2"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                  {link.icon || "open_in_new"}
                </span>
                <span>{link.name || link.url}</span>
              </a>
            ))}
          </div>
        </div>

        <div className="relative w-full aspect-[4/5] lg:aspect-square flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary-container/20 to-transparent rounded-full blur-3xl opacity-50" />
          <div className="relative z-10 w-[280px] h-[320px] md:h-[600px] rounded-[40px] border-[8px] border-surface-container-high bg-black shadow-2xl overflow-hidden flex items-center justify-center">
            {settings?.avatar ? (
              <img
                src={settings.avatar}
                alt={settings.displayName || "Profile"}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="material-symbols-outlined text-6xl text-primary/30">
                phone_iphone
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
