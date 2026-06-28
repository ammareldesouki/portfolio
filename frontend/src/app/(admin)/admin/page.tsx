"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { StatCard } from "@/components/admin/StatCard";
import { ActivityTimeline } from "@/components/admin/ActivityTimeline";
import { ProjectListItem } from "@/components/admin/ProjectListItem";
import { projectsApi, Project } from "@/lib/api/projects";
import { contactApi } from "@/lib/api/contact";

export default function AdminDashboard() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [totalProjects, setTotalProjects] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [projRes, contactRes] = await Promise.all([
          projectsApi.list({ limit: 5 }),
          contactApi.list({ limit: 100, read: false }),
        ]);
        setProjects(projRes.data || []);
        setTotalProjects(projRes.pagination?.total || 0);
        setUnreadCount((contactRes.data || []).length);
      } catch (err) {
        console.error("Failed to load dashboard", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    try {
      await projectsApi.delete(id);
      setProjects((prev) => prev.filter((p) => p._id !== id));
      setTotalProjects((prev) => prev - 1);
    } catch (err) {
      console.error("Failed to delete", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      {/* Analytics Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter mb-12">
        <StatCard
          title="Total Projects"
          value={totalProjects}
          icon="folder_open"
          trend="+3 this month"
          color="primary"
        />
        <StatCard
          title="Site Views"
          value="12.4K"
          icon="visibility"
          trend="+15% vs last week"
          color="tertiary"
        />
        <StatCard
          title="Inquiries"
          value={unreadCount}
          icon="mail"
          trend={unreadCount > 0 ? `${unreadCount} unread` : undefined}
          color="error"
        />
        <StatCard
          title="Avg. Load Time"
          value="0.8s"
          icon="speed"
          trend="Optimal"
          color="primary"
        />
      </section>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
        {/* Recent Projects */}
        <section className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center border-b border-white/5 pb-4">
            <h3 className="font-headline-md text-lg font-bold text-on-surface">
              Recent Projects
            </h3>
            <button
              onClick={() => router.push("/admin/projects")}
              className="text-primary font-code-sm text-sm hover:underline flex items-center gap-1"
            >
              View All <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
          <div className="space-y-4">
            {projects.length === 0 ? (
              <p className="text-on-surface-variant text-sm py-8 text-center">
                No projects yet. Create your first one.
              </p>
            ) : (
              projects.map((project) => (
                <ProjectListItem
                  key={project._id}
                  project={project}
                  onEdit={(id) => router.push(`/admin/projects/${id}/edit`)}
                  onDelete={handleDelete}
                />
              ))
            )}
          </div>
        </section>

        {/* Activity Sidebar */}
        <section className="lg:col-span-1 space-y-6">
          <div className="flex justify-between items-center border-b border-white/5 pb-4">
            <h3 className="font-headline-md text-lg font-bold text-on-surface">
              System Activity
            </h3>
            <span className="material-symbols-outlined text-on-surface-variant text-[18px]">
              history
            </span>
          </div>

          <ActivityTimeline
            events={[
              {
                time: "2 hours ago",
                description: (
                  <>
                    <span className="font-bold">Deployed v2.4</span> to production server.
                  </>
                ),
                type: "primary",
              },
              {
                time: "5 hours ago",
                description: (
                  <>
                    New inquiry from{" "}
                    <span className="text-primary cursor-pointer hover:underline">
                      sarah@techcorp.io
                    </span>
                  </>
                ),
              },
              {
                time: "Yesterday, 14:30",
                description: (
                  <>
                    Updated <span className="font-code-sm text-xs bg-white/5 px-1 rounded">Nexus Mobile</span> repository.
                  </>
                ),
              },
              {
                time: "Oct 12, 09:00",
                description: <>Weekly backup completed successfully.</>,
                type: "success",
              },
            ]}
          />

          <div className="bg-[#0A0C10] border border-white/10 rounded-xl p-6 mt-8">
            <h4 className="font-bold text-on-surface mb-4">Quick Actions</h4>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => router.push("/admin/projects/new")}
                className="bg-transparent border border-white/10 rounded-lg py-3 flex flex-col items-center justify-center gap-2 group hover:border-primary/50 transition-colors"
              >
                <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">
                  add
                </span>
                <span className="text-xs font-code-sm">New Project</span>
              </button>
              <button className="bg-transparent border border-white/10 rounded-lg py-3 flex flex-col items-center justify-center gap-2 group hover:border-primary/50 transition-colors">
                <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">
                  cloud_upload
                </span>
                <span className="text-xs font-code-sm">Deploy</span>
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
