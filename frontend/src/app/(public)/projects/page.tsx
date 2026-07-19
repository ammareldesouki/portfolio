"use client";

import { useEffect, useMemo, useState } from "react";
import { ProjectCard } from "@/components/public/ProjectCard";
import { projectsApi, Project } from "@/lib/api/projects";

const PAGE_SIZE = 9;

function titleCase(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export default function ProjectsPage() {
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // Fetch all published projects once; filtering + pagination happen client-side
  // so the filter tabs always reflect the actual data (and never mis-count).
  useEffect(() => {
    projectsApi
      .list({ status: "published", limit: 100, sort: "sortOrder" })
      .then((res) => setAllProjects(res.data || []))
      .catch(() => setAllProjects([]))
      .finally(() => setLoading(false));
  }, []);

  // Derive filter tabs from the categories and tech present in the data, so we
  // never show a tab (e.g. "Flutter") that matches zero projects.
  const filterOptions = useMemo(() => {
    const seen = new Map<string, string>(); // lowercase key -> display label
    allProjects.forEach((p) => {
      if (p.category) seen.set(p.category.toLowerCase(), titleCase(p.category));
      p.techStack.forEach((t) => seen.set(t.toLowerCase(), t));
    });
    return [
      { value: "all", label: "All" },
      ...Array.from(seen.entries()).map(([value, label]) => ({ value, label })),
    ];
  }, [allProjects]);

  const filtered = useMemo(() => {
    if (filter === "all") return allProjects;
    const key = filter.toLowerCase();
    return allProjects.filter(
      (p) =>
        p.category?.toLowerCase() === key ||
        p.techStack.some((t) => t.toLowerCase() === key)
    );
  }, [allProjects, filter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="w-full max-w-content mx-auto px-margin-mobile md:px-margin-desktop py-16">
      <div className="mb-12">
        <h1 className="font-display-lg-mobile md:font-display-lg text-4xl md:text-display-lg text-on-surface mb-6">
          Projects
        </h1>

        {filterOptions.length > 1 && (
          <div className="flex flex-wrap gap-3 md:gap-4 items-center">
            {filterOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  setFilter(opt.value);
                  setPage(1);
                }}
                className={`min-h-[44px] px-4 py-2 rounded-full font-code-sm text-code-sm font-bold transition-colors ${
                  filter === opt.value
                    ? "bg-primary text-on-primary inner-glow"
                    : "bg-transparent text-on-surface-variant border border-hairline/10 hover:border-primary/50"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gutter">
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
      ) : visible.length === 0 ? (
        <p className="text-on-surface-variant text-center py-24">
          No projects found.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gutter">
            {visible.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-16">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="p-2 rounded bg-transparent border border-hairline/10 text-on-surface-variant hover:bg-hairline/10 disabled:opacity-50 transition-all"
                aria-label="Previous page"
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
                      className={`w-9 h-9 rounded font-code-sm text-xs flex items-center justify-center transition-all ${
                        p === page
                          ? "bg-primary-container text-on-primary-container"
                          : "bg-transparent border border-hairline/10 text-on-surface-variant hover:bg-hairline/10"
                      }`}
                    >
                      {p}
                    </button>
                  </span>
                ))}
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="p-2 rounded bg-transparent border border-hairline/10 text-on-surface-variant hover:bg-hairline/10 disabled:opacity-50 transition-all"
                aria-label="Next page"
              >
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
