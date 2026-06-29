"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { contactApi } from "@/lib/api/contact";
import { settingsApi } from "@/lib/api/settings";
import type { Settings } from "@/lib/api/settings";

const allResumeSections = [
  { id: "experience", label: "01 // Experience", key: "showExperience" as const },
  { id: "education", label: "02 // Education", key: "showEducation" as const },
  { id: "certifications", label: "03 // Certifications", key: "showCertifications" as const },
];

export default function AboutPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [activeSection, setActiveSection] = useState("experience");
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
  const [contactSent, setContactSent] = useState(false);
  const [contactError, setContactError] = useState("");

  useEffect(() => {
    settingsApi.getPublic().then((res) => {
      if (res.data) setSettings(res.data);
    }).catch(() => {});
  }, []);

  const s = settings;

  const resumeSections = allResumeSections.filter((sec) => s ? (s as unknown as Record<string, boolean | undefined>)[sec.key] !== false : true);

  useEffect(() => {
    if (s && resumeSections.length > 0 && !resumeSections.find((sec) => sec.id === activeSection)) {
      setActiveSection(resumeSections[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [s]);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactError("");
    try {
      await contactApi.submit(contactForm);
      setContactSent(true);
      setContactForm({ name: "", email: "", message: "" });
    } catch {
      setContactError("Failed to send message. Try again.");
    }
  };

  return (
    <main className="pt-24 md:pt-32 pb-24 px-margin-mobile md:px-margin-desktop max-w-content mx-auto space-y-16 md:space-y-32">
      {/* About Section */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-gutter" id="about">
        <div className="md:col-span-7 space-y-6 md:space-y-8 flex flex-col justify-center order-2 md:order-1">
          <div className="space-y-4">
            <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface">
              {s?.displayName ? (
                <>
                  {s.displayName}
                </>
              ) : (
                <>
                  Architecting <span className="text-primary">Precision</span>.
                </>
              )}
            </h1>
            {s?.tagline && (
              <p className="font-headline-md text-headline-md text-on-surface-variant font-normal max-w-2xl">
                {s.tagline}
              </p>
            )}
          </div>

          {s?.bio && (
            <div className="bg-surface-container border border-white/10 rounded-xl p-8 inner-glow">
              <p className="text-on-surface-variant leading-relaxed whitespace-pre-line">
                {s.bio}
              </p>
            </div>
          )}

          {s?.showSkills !== false && s?.skills && s.skills.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-label-caps text-label-caps text-tertiary">
                Skills
              </h3>
              <div className="flex flex-wrap gap-3">
                {s.skills.map((skill, i) => (
                  <div key={i} className="flex flex-col gap-1">
                    <div className="bg-[#16181D] text-on-surface-variant font-code-sm text-code-sm px-3 py-1.5 rounded border border-white/5">
                      {skill.name}
                    </div>
                    <div className="w-full h-1 bg-[#16181D] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="md:col-span-5 relative h-[300px] md:h-[500px] rounded-xl overflow-hidden border border-white/10 inner-glow bg-surface-container-low flex items-center justify-center order-1 md:order-2">
          {s?.avatar ? (
            <img
              src={s.avatar}
              alt={s.displayName || "Avatar"}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <span className="material-symbols-outlined text-8xl text-primary/20">
              person
            </span>
          )}
        </div>
      </section>

      {/* Resume Section */}
      {resumeSections.length > 0 && (
      <section className="space-y-12" id="resume">
        <div className="flex justify-between items-end border-b border-white/10 pb-4">
          <h2 className="font-headline-md text-headline-md text-on-surface">
            Curriculum Vitae
          </h2>
          {s?.resumeUrl && (
            <a
              href={s.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-primary-container text-on-primary-container px-5 py-2.5 rounded-lg inner-glow hover:bg-inverse-primary transition-all duration-300"
            >
              <span className="material-symbols-outlined text-sm">download</span>
              <span className="font-code-sm text-code-sm font-semibold">
                Download PDF
              </span>
            </a>
          )}
        </div>

        <div className="flex flex-col md:flex-row md:grid md:grid-cols-3 gap-0 md:gap-8">
          {/* Mobile: horizontal tabs */}
          <div className="flex md:hidden gap-1 mb-6 overflow-x-auto pb-2 -mx-px">
            {resumeSections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`whitespace-nowrap px-4 py-2 rounded-lg font-code-sm text-code-sm transition-colors ${
                  activeSection === section.id
                    ? "bg-primary-container text-on-primary-container"
                    : "text-on-surface-variant hover:bg-surface-bright/10"
                }`}
              >
                {section.label.replace(/^\d+ \/\//, "").trim()}
              </button>
            ))}
          </div>
          {/* Desktop: vertical sidebar */}
          <div className="hidden md:block md:col-span-1 space-y-2">
            {resumeSections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full text-left px-4 py-3 font-code-sm text-code-sm transition-colors ${
                  activeSection === section.id
                    ? "bg-surface-bright/10 text-primary border-l-2 border-primary"
                    : "text-on-surface-variant hover:bg-surface-bright/5 hover:text-on-surface border-l-2 border-transparent"
                }`}
              >
                {section.label}
              </button>
            ))}
          </div>

          <div className="md:col-span-2 space-y-12 pl-0 md:pl-8 border-l-0 md:border-l border-white/5">
            {activeSection === "experience" && (
              s?.experience && s.experience.length > 0 ? (
                s.experience.map((exp, i) => (
                  <div key={i} className="space-y-4 relative">
                    <div className="absolute -left-[33px] top-2 w-2 h-2 bg-primary rounded-full hidden md:block ring-4 ring-background" />
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-body-base text-body-base font-bold text-on-surface">
                        {exp.role}
                      </h3>
                      <span className="font-code-sm text-code-sm text-tertiary">
                        {exp.startDate} — {exp.current ? "Present" : exp.endDate}
                      </span>
                    </div>
                    <p className="font-body-base text-body-base text-on-surface-variant font-medium">
                      {exp.company}
                    </p>
                    <p className="text-on-surface-variant/80 text-sm leading-relaxed">
                      {exp.description}
                    </p>
                    {exp.technologies && exp.technologies.length > 0 && (
                      <div className="flex gap-2 flex-wrap">
                        {exp.technologies.map((tech, j) => (
                          <span
                            key={j}
                            className="bg-[#16181D] text-[#666666] font-code-sm text-[10px] px-2 py-0.5 rounded"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-on-surface-variant">Experience details coming soon.</p>
              )
            )}

            {activeSection === "education" && (
              s?.education && s.education.length > 0 ? (
                s.education.map((edu, i) => (
                  <div key={i} className="space-y-2 relative">
                    <div className="absolute -left-[33px] top-2 w-2 h-2 bg-primary rounded-full hidden md:block ring-4 ring-background" />
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-body-base text-body-base font-bold text-on-surface">
                        {edu.degree} in {edu.field}
                      </h3>
                      <span className="font-code-sm text-code-sm text-tertiary">
                        {edu.startDate} — {edu.current ? "Present" : edu.endDate}
                      </span>
                    </div>
                    <p className="font-body-base text-body-base text-on-surface-variant font-medium">
                      {edu.institution}
                    </p>
                    {edu.description && (
                      <p className="text-on-surface-variant/80 text-sm leading-relaxed">
                        {edu.description}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-on-surface-variant">Education details coming soon.</p>
              )
            )}

            {activeSection === "certifications" && (
              s?.certifications && s.certifications.length > 0 ? (
                s.certifications.map((cert, i) => (
                  <div key={i} className="space-y-2 relative">
                    <div className="absolute -left-[33px] top-2 w-2 h-2 bg-primary rounded-full hidden md:block ring-4 ring-background" />
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-body-base text-body-base font-bold text-on-surface">
                        {cert.url ? (
                          <a href={cert.url} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                            {cert.name}
                          </a>
                        ) : (
                          cert.name
                        )}
                      </h3>
                      <span className="font-code-sm text-code-sm text-tertiary">
                        {cert.date}
                      </span>
                    </div>
                    <p className="font-body-base text-body-base text-on-surface-variant font-medium">
                      {cert.issuer}
                    </p>
                    {cert.description && (
                      <p className="text-on-surface-variant/80 text-sm leading-relaxed">
                        {cert.description}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-on-surface-variant">Certifications coming soon.</p>
              )
            )}
          </div>
        </div>
      </section>
      )}
      {s?.contactEnabled !== false && (
        <section className="max-w-3xl mx-auto space-y-12" id="contact">
          <div className="text-center space-y-4">
            <h2 className="font-headline-md text-headline-md text-on-surface">
              Initiate Connection
            </h2>
            <p className="font-body-base text-body-base text-on-surface-variant">
              For inquiries regarding architectural consultation or engineering roles.
            </p>
          </div>

          {contactSent ? (
            <div className="text-center py-16">
              <span className="material-symbols-outlined text-6xl text-tertiary">
                check_circle
              </span>
              <p className="font-headline-md text-headline-md text-on-surface mt-4">
                Message Sent
              </p>
              <p className="text-on-surface-variant mt-2">
                Thank you for reaching out. I&apos;ll respond promptly.
              </p>
              <button
                onClick={() => setContactSent(false)}
                className="mt-8 text-primary hover:underline font-code-sm"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleContactSubmit}
              className="space-y-6 bg-surface-container/50 border border-white/5 p-4 md:p-8 rounded-xl backdrop-blur-sm"
            >
              {contactError && (
                <div className="p-4 bg-error-container/20 border border-error/30 rounded-lg">
                  <p className="font-code-sm text-code-sm text-error">{contactError}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <Input
                  id="contact-name"
                  label="Identification"
                  value={contactForm.name}
                  onChange={(e) =>
                    setContactForm((f) => ({ ...f, name: e.target.value }))
                  }
                  placeholder="John Doe"
                  required
                />
                <Input
                  id="contact-email"
                  label="Comm Channel"
                  type="email"
                  value={contactForm.email}
                  onChange={(e) =>
                    setContactForm((f) => ({ ...f, email: e.target.value }))
                  }
                  placeholder="john@domain.com"
                  required
                />
              </div>

              <Textarea
                id="contact-message"
                label="Payload"
                value={contactForm.message}
                onChange={(e) =>
                  setContactForm((f) => ({ ...f, message: e.target.value }))
                }
                placeholder="Transmit your message here..."
                rows={5}
                required
              />

              <button
                type="submit"
                className="w-full py-4 bg-transparent border border-white/10 text-on-surface font-code-sm text-code-sm rounded-xl hover:bg-white/5 hover:border-primary transition-all duration-300 flex justify-center items-center gap-2"
              >
                Transmit{" "}
                <span className="material-symbols-outlined text-sm">send</span>
              </button>
            </form>
          )}
        </section>
      )}
    </main>
  );
}
