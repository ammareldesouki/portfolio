"use client";

import Link from "next/link";
import { Chip } from "@/components/ui/Chip";
import type { Project } from "@/lib/api/projects";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link href={`/projects/${project.slug}`}>
      <div className="card-border rounded-xl overflow-hidden group transition-all duration-300 flex flex-col h-full cursor-pointer">
        <div className="aspect-video relative overflow-hidden bg-surface-container-low">
          {project.imageUrl ? (
            <img
              src={project.imageUrl}
              alt={project.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-on-surface-variant">
              <span className="material-symbols-outlined text-4xl">image</span>
            </div>
          )}
        </div>

        <div className="p-6 flex flex-col flex-grow">
          <div className="flex gap-2 mb-4 flex-wrap">
            {project.techStack.slice(0, 3).map((tech) => (
              <Chip key={tech} label={tech} />
            ))}
          </div>

          <h3 className="font-headline-md text-xl text-on-surface mb-2 font-semibold">
            {project.title}
          </h3>

          <p className="font-body-base text-sm text-on-surface-variant mb-6 flex-grow line-clamp-2">
            {project.description}
          </p>

          <div className="flex items-center justify-between mt-auto">
            <span className="font-code-sm text-sm text-primary hover:text-primary-fixed transition-colors flex items-center gap-1">
              Case Study{" "}
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                arrow_outward
              </span>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
