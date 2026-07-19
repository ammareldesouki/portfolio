"use client";

import { useEffect, useState } from "react";
import { ProjectCard } from "./ProjectCard";
import { Reveal } from "@/components/ui/Reveal";
import { projectsApi, Project } from "@/lib/api/projects";

export function FeaturedProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    projectsApi
      .list({ featured: true, limit: 3, status: "published" })
      .then((res) => setProjects(res.data || []))
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  }, []);

  // Nothing featured yet: hide the whole section rather than show endless skeletons.
  if (!loading && projects.length === 0) return null;

  return (
    <Reveal as="section" className="py-24 px-margin-mobile md:px-margin-desktop relative z-10" id="projects">
      <div className="max-w-content mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
          <div>
            <h2 className="font-headline-md text-headline-md text-on-surface mb-4">
              Featured Projects
            </h2>
            <p className="font-body-base text-body-base text-on-surface-variant max-w-xl">
              Production-grade applications built with scalable architectures
              and obsessive attention to detail.
            </p>
          </div>
          <a
            href="/projects"
            className="btn-ghost px-6 py-2 rounded-lg font-code-sm text-code-sm transition-all flex items-center gap-2 shrink-0"
          >
            View All{" "}
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
              arrow_forward
            </span>
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
          {loading ? (
            <>
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="card-border rounded-xl overflow-hidden flex flex-col h-full animate-pulse"
                >
                  <div className="aspect-video bg-surface-container-low" />
                  <div className="p-6 space-y-4">
                    <div className="h-4 bg-surface-container-high rounded w-3/4" />
                    <div className="h-3 bg-surface-container-high rounded w-full" />
                    <div className="h-3 bg-surface-container-high rounded w-1/2" />
                  </div>
                </div>
              ))}
            </>
          ) : (
            projects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))
          )}
        </div>
      </div>
    </Reveal>
  );
}
