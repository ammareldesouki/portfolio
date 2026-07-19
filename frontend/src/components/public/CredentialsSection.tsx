"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { settingsApi, Settings } from "@/lib/api/settings";
import { Reveal } from "@/components/ui/Reveal";

export function CredentialsSection() {
  const [s, setS] = useState<Settings | null>(null);

  useEffect(() => {
    settingsApi
      .getPublic()
      .then((res) => setS(res.data || null))
      .catch(() => {});
  }, []);

  const experience = s?.showExperience !== false ? s?.experience ?? [] : [];
  const education = s?.showEducation !== false ? s?.education ?? [] : [];
  const certifications =
    s?.showCertifications !== false ? s?.certifications ?? [] : [];

  // Hide the whole section until there's at least one entry — no placeholders.
  if (
    experience.length === 0 &&
    education.length === 0 &&
    certifications.length === 0
  ) {
    return null;
  }

  return (
    <Reveal
      as="section"
      id="credentials"
      className="py-16 md:py-24 px-margin-mobile md:px-margin-desktop relative z-10"
    >
      <div className="max-w-content mx-auto space-y-12">
        <div className="flex items-center gap-4">
          <h2 className="font-headline-md text-headline-md text-on-surface">
            Experience &amp; Credentials
          </h2>
          <div className="h-px flex-grow bg-hairline/10" />
          <Link
            href="/about#resume"
            className="shrink-0 font-code-sm text-code-sm text-primary hover:text-primary-fixed transition-colors inline-flex items-center gap-1"
          >
            Full résumé
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
              arrow_forward
            </span>
          </Link>
        </div>

        {/* Experience */}
        {experience.length > 0 && (
          <div className="space-y-6">
            <h3 className="font-label-caps text-label-caps text-tertiary">
              Experience
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
              {experience.map((exp, i) => (
                <div
                  key={i}
                  className="bg-surface-container border border-hairline/10 rounded-xl p-6 space-y-3 inner-glow"
                >
                  <div className="flex justify-between items-start gap-3">
                    <h4 className="font-body-base text-body-base font-bold text-on-surface">
                      {exp.role}
                    </h4>
                    <span className="font-code-sm text-code-sm text-tertiary shrink-0">
                      {exp.startDate} — {exp.current ? "Present" : exp.endDate}
                    </span>
                  </div>
                  <p className="font-body-base text-sm text-on-surface-variant font-medium">
                    {exp.company}
                  </p>
                  {exp.description && (
                    <p className="text-on-surface-variant/80 text-sm leading-relaxed line-clamp-3">
                      {exp.description}
                    </p>
                  )}
                  {exp.technologies && exp.technologies.length > 0 && (
                    <div className="flex gap-2 flex-wrap pt-1">
                      {exp.technologies.map((tech, j) => (
                        <span
                          key={j}
                          className="chip font-code-sm text-[10px] px-2 py-0.5 rounded"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div className="space-y-6">
            <h3 className="font-label-caps text-label-caps text-tertiary">
              Education
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
              {education.map((edu, i) => (
                <div
                  key={i}
                  className="bg-surface-container border border-hairline/10 rounded-xl p-6 space-y-2 inner-glow"
                >
                  <div className="flex justify-between items-start gap-3">
                    <h4 className="font-body-base text-body-base font-bold text-on-surface">
                      {edu.degree}
                      {edu.field ? ` in ${edu.field}` : ""}
                    </h4>
                    <span className="font-code-sm text-code-sm text-tertiary shrink-0">
                      {edu.startDate} — {edu.current ? "Present" : edu.endDate}
                    </span>
                  </div>
                  <p className="font-body-base text-sm text-on-surface-variant font-medium">
                    {edu.institution}
                  </p>
                  {edu.description && (
                    <p className="text-on-surface-variant/80 text-sm leading-relaxed">
                      {edu.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <div className="space-y-6">
            <h3 className="font-label-caps text-label-caps text-tertiary">
              Certifications
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
              {certifications.map((cert, i) => (
                <div
                  key={i}
                  className="bg-surface-container border border-hairline/10 rounded-xl p-6 space-y-2 inner-glow h-full"
                >
                  <div className="flex justify-between items-start gap-3">
                    <h4 className="font-body-base text-body-base font-bold text-on-surface">
                      {cert.url ? (
                        <a
                          href={cert.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-primary transition-colors"
                        >
                          {cert.name}
                        </a>
                      ) : (
                        cert.name
                      )}
                    </h4>
                    <span className="font-code-sm text-code-sm text-tertiary shrink-0">
                      {cert.date}
                    </span>
                  </div>
                  <p className="font-body-base text-sm text-on-surface-variant font-medium">
                    {cert.issuer}
                  </p>
                  {cert.description && (
                    <p className="text-on-surface-variant/80 text-sm leading-relaxed line-clamp-4">
                      {cert.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Reveal>
  );
}
