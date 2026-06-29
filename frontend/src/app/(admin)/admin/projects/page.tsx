"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { FilterBar } from "@/components/admin/FilterBar";
import { ProjectListItem } from "@/components/admin/ProjectListItem";
import { projectsApi, Project } from "@/lib/api/projects";

const filterOptions = [
  { value: "all", label: "All" },
  { value: "published", label: "Published" },
  { value: "draft", label: "Draft" },
  { value: "in_progress", label: "In Progress" },
  { value: "archived", label: "Archived" },
];

export default function AdminProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const limit = 50;

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await projectsApi.list({
          page,
          limit,
          sort: "sortOrder",
          ...(status !== "all" ? { status } : {}),
        });
        setProjects(res.data || []);
        setTotal(res.pagination?.total || 0);
      } catch (err) {
        console.error("Failed to load projects", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [page, status]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this project? This cannot be undone.")) return;
    try {
      await projectsApi.delete(id);
      setProjects((prev) => prev.filter((p) => p._id !== id));
      setTotal((prev) => prev - 1);
    } catch (err) {
      console.error("Failed to delete", err);
    }
  };

  const handleDragStart = useCallback((index: number) => {
    setDragIndex(index);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;
    const items = [...projects];
    const [moved] = items.splice(dragIndex, 1);
    items.splice(index, 0, moved);
    setProjects(items);
    setDragIndex(index);
  }, [dragIndex, projects]);

  const handleDragEnd = useCallback(async () => {
    setDragIndex(null);
    const orders = projects.map((p, i) => ({ _id: p._id, sortOrder: i }));
    try {
      await projectsApi.reorder(orders);
    } catch (err) {
      console.error("Failed to reorder", err);
    }
  }, [projects]);

  const totalPages = Math.ceil(total / limit);
  const filtered = search
    ? projects.filter(
        (p) =>
          p.title.toLowerCase().includes(search.toLowerCase()) ||
          p.techStack.some((t) => t.toLowerCase().includes(search.toLowerCase()))
      )
    : projects;

  return (
    <div>
      <h2 className="font-headline-md text-headline-md text-on-surface mb-6">
        Projects
      </h2>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between w-full p-4 bg-[#0A0C10] rounded-xl border border-white/10 mb-6">
        <div className="relative w-full md:w-96">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">
            search
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects by name, tech..."
            className="w-full bg-[#050505] border border-white/5 rounded-lg py-2 pl-10 pr-4 text-code-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-transparent transition-all placeholder-on-surface-variant/50"
          />
        </div>
        <FilterBar options={filterOptions} active={status} onChange={(v) => { setStatus(v); setPage(1); }} />
        <button
          onClick={() => router.push("/admin/projects/new")}
          className="bg-primary-container text-on-primary-container px-4 py-2 rounded-lg font-code-sm text-code-sm font-bold flex items-center gap-2 hover:opacity-90 transition-opacity shrink-0"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          Add New
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-on-surface-variant text-sm py-16 text-center">
          No projects found.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {filtered.map((project, i) => (
            <div
              key={project._id}
              draggable
              onDragStart={() => handleDragStart(i)}
              onDragOver={(e) => handleDragOver(e, i)}
              onDragEnd={handleDragEnd}
              className={`transition-opacity ${dragIndex === i ? "opacity-50" : ""}`}
            >
              <ProjectListItem
                project={project}
                onEdit={(id) => router.push(`/admin/projects/${id}/edit`)}
                onDelete={handleDelete}
              />
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-4">
          <span className="text-on-surface-variant font-code-sm text-xs">
            Showing {Math.min((page - 1) * limit + 1, total)}–{Math.min(page * limit, total)} of {total} projects
          </span>
          <div className="flex gap-1">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="p-1 rounded bg-transparent border border-white/5 text-on-surface-variant hover:bg-white/10 disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-sm">chevron_left</span>
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
              .map((p, idx, arr) => (
                <span key={p} className="flex">
                  {idx > 0 && arr[idx - 1] !== p - 1 && (
                    <span className="w-6 h-6 flex items-center justify-center text-on-surface-variant font-code-sm text-xs">
                      ...
                    </span>
                  )}
                  <button
                    onClick={() => setPage(p)}
                    className={`w-6 h-6 rounded font-code-sm text-xs flex items-center justify-center ${
                      p === page
                        ? "bg-primary-container text-on-primary-container border border-primary-container"
                        : "bg-transparent border border-white/5 text-on-surface-variant hover:bg-white/10"
                    }`}
                  >
                    {p}
                  </button>
                </span>
              ))}
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="p-1 rounded bg-transparent border border-white/5 text-on-surface-variant hover:bg-white/10 disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
