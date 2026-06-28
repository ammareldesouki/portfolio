"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { contactApi } from "@/lib/api/contact";

const resumeSections = [
  { id: "experience", label: "01 // Experience" },
  { id: "education", label: "02 // Education" },
  { id: "certifications", label: "03 // Certifications" },
];

const experiences = [
  {
    role: "Lead Core Engineer",
    company: "Nexus Dynamics",
    period: "2021 - Present",
    description:
      "Architected distributed microservices handling 50M+ daily events. Optimized latency by 40% through rigorous profiling and rewriting critical paths in Rust. Established engineering standards for the global team.",
  },
  {
    role: "Senior Frontend Developer",
    company: "Vanguard Tech Group",
    period: "2018 - 2021",
    description:
      "Led the migration of a legacy monolithic frontend to a modern React-based architecture. Implemented a comprehensive design system reducing UI inconsistencies by 80%.",
  },
];

const testimonials = [
  {
    quote:
      "An exceptional talent. They don't just write code; they engineer robust solutions that scale effortlessly. Their attention to detail and commitment to clean architecture elevated our entire product line.",
    name: "Sarah Jenkins",
    title: "CTO, Nexus Dynamics",
  },
  {
    quote:
      "Rarely do you find an engineer who possesses both deep technical expertise and a refined sense of design. Their work bridges the gap between high performance and user experience seamlessly.",
    name: "David Chen",
    title: "VP Engineering, Vanguard Tech",
  },
];

export default function AboutPage() {
  const [activeSection, setActiveSection] = useState("experience");
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
  const [contactSent, setContactSent] = useState(false);
  const [contactError, setContactError] = useState("");

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
    <main className="pt-32 pb-24 px-margin-mobile md:px-margin-desktop max-w-content mx-auto space-y-32">
      {/* About Section */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-gutter" id="about">
        <div className="md:col-span-7 space-y-8 flex flex-col justify-center">
          <div className="space-y-4">
            <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface">
              Architecting <span className="text-primary">Precision</span>.
            </h1>
            <p className="font-headline-md text-headline-md text-on-surface-variant font-normal max-w-2xl">
              I build high-performance digital infrastructure with a focus on
              rigorous engineering and elegant execution.
            </p>
          </div>

          <div className="bg-surface-container border border-white/10 rounded-xl p-8 space-y-4 inner-glow">
            <h3 className="font-label-caps text-label-caps text-tertiary">
              Mission Statement
            </h3>
            <p className="text-on-surface-variant leading-relaxed">
              To merge the utility of complex developer tools with the refined
              experience of a premium product. I believe that code should be as
              clean and structurally sound as the interfaces it powers.
            </p>
          </div>

          <div className="flex gap-4 flex-wrap">
            {["TypeScript", "Rust", "Flutter", "System Design"].map((tech) => (
              <span
                key={tech}
                className="bg-[#16181D] text-[#666666] font-code-sm text-code-sm px-3 py-1 rounded border border-white/5"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div className="md:col-span-5 relative h-[500px] rounded-xl overflow-hidden border border-white/10 inner-glow bg-surface-container-low flex items-center justify-center">
          <span className="material-symbols-outlined text-8xl text-primary/20">
            person
          </span>
        </div>
      </section>

      {/* Resume Section */}
      <section className="space-y-12" id="resume">
        <div className="flex justify-between items-end border-b border-white/10 pb-4">
          <h2 className="font-headline-md text-headline-md text-on-surface">
            Curriculum Vitae
          </h2>
          <button className="flex items-center gap-2 bg-primary-container text-on-primary-container px-5 py-2.5 rounded-lg inner-glow hover:bg-inverse-primary transition-all duration-300">
            <span className="material-symbols-outlined text-sm">download</span>
            <span className="font-code-sm text-code-sm font-semibold">
              Download PDF
            </span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1 space-y-2">
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

          <div className="md:col-span-2 space-y-12 pl-0 md:pl-8 border-l border-white/5">
            {activeSection === "experience" &&
              experiences.map((exp, i) => (
                <div key={i} className="space-y-4 relative">
                  <div className="absolute -left-[33px] top-2 w-2 h-2 bg-primary rounded-full hidden md:block ring-4 ring-background" />
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-body-base text-body-base font-bold text-on-surface">
                      {exp.role}
                    </h3>
                    <span className="font-code-sm text-code-sm text-tertiary">
                      {exp.period}
                    </span>
                  </div>
                  <p className="font-body-base text-body-base text-on-surface-variant font-medium">
                    {exp.company}
                  </p>
                  <p className="text-on-surface-variant/80 text-sm leading-relaxed">
                    {exp.description}
                  </p>
                </div>
              ))}

            {activeSection === "education" && (
              <p className="text-on-surface-variant">Education details coming soon.</p>
            )}

            {activeSection === "certifications" && (
              <p className="text-on-surface-variant">Certifications coming soon.</p>
            )}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="space-y-12">
        <div className="flex flex-col items-center text-center space-y-4">
          <h2 className="font-headline-md text-headline-md text-on-surface">
            Peer Reviews
          </h2>
          <div className="w-12 h-1 bg-primary/30" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-surface-container border border-white/5 rounded-xl p-8 space-y-6 hover:border-primary/50 transition-colors duration-500 group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <span
                  className="material-symbols-outlined text-6xl"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  format_quote
                </span>
              </div>
              <p className="font-body-base text-body-base text-on-surface-variant italic relative z-10">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-4 pt-4 border-t border-white/5 relative z-10">
                <div className="w-12 h-12 rounded-full bg-surface-bright/30 border border-white/10 flex items-center justify-center text-on-surface font-bold">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-body-base text-body-base font-semibold text-on-surface">
                    {t.name}
                  </h4>
                  <p className="font-code-sm text-code-sm text-on-surface-variant/70">
                    {t.title}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
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
            className="space-y-6 bg-surface-container/50 border border-white/5 p-8 rounded-xl backdrop-blur-sm"
          >
            {contactError && (
              <div className="p-4 bg-error-container/20 border border-error/30 rounded-lg">
                <p className="font-code-sm text-code-sm text-error">{contactError}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
    </main>
  );
}
