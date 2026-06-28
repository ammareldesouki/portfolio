"use client";

import { useEffect, useState } from "react";
import { ProjectCard } from "@/components/public/ProjectCard";
import { projectsApi, Project } from "@/lib/api/projects";

const filterOptions = [
  { value: "all", label: "All" },
  { value: "Flutter", label: "Flutter" },
  { value: "Firebase", label: "Firebase" },
  { value: "AI", label: "AI" },
  { value: "Open Source", label: "Open Source" },
];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const limit = 9;

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await projectsApi.list({
          page,
          limit,
          status: "published",
        });
        let filtered = res.data || [];
        if (filter !== "all") {
          filtered = filtered.filter((p) =>
            p.techStack.some((t) => t.toLowerCase() === filter.toLowerCase())
          );
        }
        setProjects(filtered);
        setTotal(res.pagination?.total || 0);
      } catch {
        setProjects([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [page, filter]);

  const totalPages = Math.ceil(total / limit);

  return (
    <main className="flex-grow w-full max-w-content mx-auto px-margin-mobile md:px-margin-desktop py-16">
      <div className="mb-12">
        <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface mb-6">
          Projects
        </h1>

        <div className="flex flex-wrap gap-4 items-center">
          {filterOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => { setFilter(opt.value); setPage(1); }}
              className={`px-4 py-2 rounded-full font-code-sm text-code-sm font-bold transition-colors ${
                filter === opt.value
                  ? "bg-primary text-on-primary inner-glow"
                  : "bg-transparent text-on-surface-variant border border-white/10 hover:border-primary/50"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="card-border rounded-xl overflow-hidden flex flex-col h-full animate-pulse">
              <div className="aspect-video bg-surface-container-low" />
              <div className="p-6 space-y-4">
                <div className="h-4 bg-surface-container-high rounded w-3/4" />
                <div className="h-3 bg-surface-container-high rounded w-full" />
                <div className="h-3 bg-surface-container-high rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : projects.length === 0 ? (
        <p className="text-on-surface-variant text-center py-24">
          No projects found.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
            {projects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-16">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="p-2 rounded bg-transparent border border-white/10 text-on-surface-variant hover:bg-white/10 disabled:opacity-50 transition-all"
              >
                <span className="material-symbols-outlined text-sm">chevron_left</span>
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                .map((p, idx, arr) => (
                  <span key={p} className="flex items-center">
                    {idx > 0 && arr[idx - 1] !== p - 1 && (
                      <span className="w-8 text-center text-on-surface-variant font-code-sm text-xs">...</span>
                    )}
                    <button
                      onClick={() => setPage(p)}
                      className={`w-8 h-8 rounded font-code-sm text-xs flex items-center justify-center transition-all ${
                        p === page
                          ? "bg-primary-container text-on-primary-container"
                          : "bg-transparent border border-white/10 text-on-surface-variant hover:bg-white/10"
                      }`}
                    >
                      {p}
                    </button>
                  </span>
                ))}
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="p-2 rounded bg-transparent border border-white/10 text-on-surface-variant hover:bg-white/10 disabled:opacity-50 transition-all"
              >
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
}
