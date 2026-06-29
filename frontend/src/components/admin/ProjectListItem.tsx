"use client";

import { Project } from "@/lib/api/projects";
import { Chip } from "@/components/ui/Chip";

interface ProjectListItemProps {
  project: Project;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const statusConfig: Record<string, { label: string; variant: "default" | "primary" | "success" }> = {
  published: { label: "Published", variant: "success" },
  draft: { label: "Draft", variant: "default" },
  in_progress: { label: "In Progress", variant: "primary" },
  archived: { label: "Archived", variant: "default" },
};

export function ProjectListItem({ project, onEdit, onDelete }: ProjectListItemProps) {
  const status = statusConfig[project.status] || statusConfig.draft;

  return (
    <div className="group flex flex-col md:flex-row gap-4 p-4 md:p-6 bg-[#0A0C10] rounded-xl border border-white/10 inner-glow hover:border-primary/50 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] transition-all duration-300 relative overflow-hidden cursor-grab active:cursor-grabbing">
      <div className="absolute inset-0 bg-gradient-to-r from-primary-container/0 to-primary-container/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className="flex items-center gap-2 absolute left-0 top-0 bottom-0 pl-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="material-symbols-outlined text-on-surface-variant text-[16px]" style={{ fontVariationSettings: "'FILL' 0" }}>
          grip_vertical
        </span>
      </div>

      <div className="ml-0 md:ml-4 w-full md:w-48 h-32 md:h-auto rounded-lg overflow-hidden border border-white/5 flex-shrink-0 relative bg-surface-container">
        {project.imageUrl ? (
          <img
            src={project.imageUrl}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-on-surface-variant">
            <span className="material-symbols-outlined text-3xl">image</span>
          </div>
        )}
        <div className="absolute top-2 left-2 px-2 py-1 bg-[#16181D]/80 backdrop-blur-md rounded text-[#666666] font-code-sm text-[10px] border border-white/5">
          {project.category}
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-between min-w-0 z-10">
        <div>
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-headline-md text-xl md:text-2xl text-on-surface font-semibold truncate pr-4">
              {project.title}
            </h3>
            <div className="flex items-center gap-2 shrink-0">
              <Chip label={status.label} variant={status.variant} />
              {project.featured && (
                <span className="material-symbols-outlined text-primary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                  star
                </span>
              )}
            </div>
          </div>
          <p className="text-on-surface-variant text-sm line-clamp-2 mt-2">
            {project.description}
          </p>
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
          <div className="flex flex-wrap gap-2">
            {project.techStack.slice(0, 3).map((tech) => (
              <span
                key={tech}
                className="px-2 py-1 rounded bg-[#16181D] text-[#666666] font-code-sm text-xs border border-white/5"
              >
                {tech}
              </span>
            ))}
            {project.techStack.length > 3 && (
              <span className="px-2 py-1 rounded bg-[#16181D] text-[#666666] font-code-sm text-xs border border-white/5">
                +{project.techStack.length - 3}
              </span>
            )}
          </div>
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={() => onEdit(project._id)}
              className="p-2 rounded-lg bg-transparent border border-white/10 hover:bg-primary-container hover:border-primary-container text-on-surface transition-all"
              title="Edit"
            >
              <span className="material-symbols-outlined text-sm">edit</span>
            </button>
            <button
              onClick={() => onDelete(project._id)}
              className="p-2 rounded-lg bg-transparent border border-error/20 hover:bg-error hover:border-error text-error hover:text-on-error transition-all"
              title="Delete"
            >
              <span className="material-symbols-outlined text-sm">delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
