"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Chip } from "@/components/ui/Chip";
import { projectsApi, Project } from "@/lib/api/projects";

export default function ProjectDetailPage() {
  const params = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params?.slug) return;
    projectsApi
      .getBySlug(params.slug as string)
      .then((res) => setProject(res.data || null))
      .catch(() => setProject(null))
      .finally(() => setLoading(false));
  }, [params?.slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen pt-20">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen pt-20 gap-4">
        <span className="material-symbols-outlined text-6xl text-on-surface-variant">
          folder_off
        </span>
        <p className="text-on-surface-variant">Project not found.</p>
        <Link href="/projects" className="text-primary hover:underline font-code-sm">
          Back to projects
        </Link>
      </div>
    );
  }

  const images = project.galleryUrls?.length
    ? project.galleryUrls
    : project.imageUrl
      ? [project.imageUrl]
      : [];

  return (
    <main className="flex-grow pt-20">
      {/* Hero Section */}
      <section className="relative w-full min-h-[400px] flex items-end pb-12 px-margin-mobile md:px-margin-desktop">
        <div className="absolute inset-0 z-0">
          {project.imageUrl ? (
            <img
              src={project.imageUrl}
              alt={project.title}
              className="w-full h-full object-cover opacity-60"
            />
          ) : (
            <div className="w-full h-full bg-surface-container-low" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent" />
        </div>

        <div className="relative z-10 w-full max-w-content mx-auto">
          <div className="flex flex-col gap-4">
            <div className="flex gap-2 mb-2 flex-wrap">
              {project.techStack.slice(0, 4).map((tech) => (
                <Chip key={tech} label={tech} />
              ))}
            </div>
            {/* Title/challenge overlay a permanently-dark image scrim in both
                themes, so they stay light regardless of the active theme. */}
            <h1 className="font-display-lg-mobile md:font-display-lg text-4xl md:text-display-lg text-white max-w-4xl">
              {project.title}
            </h1>
            {project.challenge && (
              <p className="font-headline-md text-headline-md text-white/80 max-w-2xl mt-4">
                {project.challenge}
              </p>
            )}
          </div>
        </div>
      </section>

      <div className="w-full max-w-content mx-auto px-margin-mobile md:px-margin-desktop py-16 flex flex-col gap-24">
        {/* Overview Bento Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          <div className="col-span-1 md:col-span-2 bg-card border border-hairline/10 p-8 rounded-xl flex flex-col justify-center">
            <h2 className="font-headline-md text-headline-md text-primary mb-4">
              {project.challenge ? "The Challenge" : "Overview"}
            </h2>
            <p className="text-on-surface-variant leading-relaxed">
              {project.description}
            </p>
          </div>

          <div className="col-span-1 bg-card border border-hairline/10 p-8 rounded-xl flex flex-col gap-6">
            {project.role && (
              <div>
                <h3 className="font-label-caps text-label-caps text-on-surface-variant mb-2 uppercase">
                  Role
                </h3>
                <p className="text-on-surface">{project.role}</p>
              </div>
            )}
            {project.timeline && (
              <div>
                <h3 className="font-label-caps text-label-caps text-on-surface-variant mb-2 uppercase">
                  Timeline
                </h3>
                <p className="text-on-surface">{project.timeline}</p>
              </div>
            )}
            <div>
              <h3 className="font-label-caps text-label-caps text-on-surface-variant mb-2 uppercase">
                Tech Stack
              </h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {project.techStack.map((tech) => (
                  <Chip key={tech} label={tech} />
                ))}
              </div>
            </div>
            {(project.links?.github || project.links?.live || project.links?.caseStudy) && (
              <div>
                <h3 className="font-label-caps text-label-caps text-on-surface-variant mb-2 uppercase">
                  Links
                </h3>
                <div className="flex gap-4 mt-2">
                  {project.links.github && (
                    <a href={project.links.github} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-fixed transition-colors">
                      <span className="material-symbols-outlined">code</span>
                    </a>
                  )}
                  {project.links.live && (
                    <a href={project.links.live} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-fixed transition-colors">
                      <span className="material-symbols-outlined">open_in_new</span>
                    </a>
                  )}
                  {project.links.caseStudy && (
                    <a href={project.links.caseStudy} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-fixed transition-colors">
                      <span className="material-symbols-outlined">article</span>
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Gallery */}
        {images.length > 0 && (
          <section>
            <h2 className="font-headline-md text-headline-md text-on-surface mb-8">
              Interface Design
            </h2>
            <div className="flex flex-wrap gap-3">
              {images.map((url, i) => (
                <div
                  key={i}
                  className="bg-card border border-hairline/10 rounded-lg overflow-hidden shrink-0"
                >
                  <img
                    src={url}
                    alt={`${project.title} screenshot ${i + 1}`}
                    className="max-h-72 w-auto h-auto"
                  />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Back link */}
      <div className="pb-16 text-center">
        <Link
          href="/projects"
          className="btn-ghost px-8 py-4 rounded-xl font-code-sm text-code-sm font-bold inline-flex items-center gap-2"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
            arrow_back
          </span>
          Back to Projects
        </Link>
      </div>
    </main>
  );
}
