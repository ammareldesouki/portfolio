"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { projectsApi, ProjectFormData } from "@/lib/api/projects";
import { mediaApi } from "@/lib/api/media";

const statusOptions = [
  { value: "draft", label: "Draft" },
  { value: "in_progress", label: "In Progress" },
  { value: "published", label: "Published" },
  { value: "archived", label: "Archived" },
];

const categoryOptions = [
  { value: "mobile", label: "Mobile Application" },
  { value: "web", label: "Web Platform" },
  { value: "library", label: "Open Source Library" },
  { value: "tooling", label: "Developer Tooling" },
];

const tabs = [
  { id: "details", label: "Details", icon: "info" },
  { id: "links", label: "Links", icon: "link" },
  { id: "media", label: "Media", icon: "imagesmode" },
  { id: "tech", label: "Tech Stack", icon: "code" },
];

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const isNew = !params?.id || params.id === "new";
  const [activeTab, setActiveTab] = useState("details");
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [techInput, setTechInput] = useState("");
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverFileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<ProjectFormData>({
    title: "",
    slug: "",
    description: "",
    category: "mobile",
    status: "draft",
    techStack: [],
    imageUrl: "",
    galleryUrls: [],
    links: { github: "", live: "", caseStudy: "" },
    featured: false,
    role: "",
    timeline: "",
    challenge: "",
  });

  useEffect(() => {
    if (!isNew) {
      projectsApi
        .getById(params.id as string)
        .then((res) => {
          if (res.data) {
            const p = res.data;
            setForm({
              title: p.title,
              slug: p.slug,
              description: p.description,
              category: p.category,
              status: p.status,
              techStack: p.techStack,
              imageUrl: p.imageUrl || "",
              galleryUrls: p.galleryUrls || [],
              links: {
                github: p.links?.github || "",
                live: p.links?.live || "",
                caseStudy: p.links?.caseStudy || "",
              },
              featured: p.featured,
              role: p.role || "",
              timeline: p.timeline || "",
              challenge: p.challenge || "",
            });
          }
        })
        .catch(() => router.push("/admin/projects"))
        .finally(() => setLoading(false));
    }
  }, [isNew, params?.id, router]);

  const slugify = (text: string) =>
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

  const handleChange = (field: keyof ProjectFormData, value: unknown) => {
    setForm((prev) => {
      const update: Partial<ProjectFormData> = { [field]: value };
      if (field === "title" && isNew && typeof value === "string") {
        update.slug = slugify(value);
      }
      return { ...prev, ...update };
    });
  };

  const handleLinkChange = (field: "github" | "live" | "caseStudy", value: string) => {
    setForm((prev) => ({
      ...prev,
      links: { ...prev.links!, [field]: value || null },
    }));
  };

  const addTech = () => {
    const t = techInput.trim();
    if (t && !form.techStack?.includes(t)) {
      handleChange("techStack", [...(form.techStack || []), t]);
      setTechInput("");
    }
  };

  const removeTech = (tech: string) => {
    handleChange("techStack", form.techStack?.filter((t) => t !== tech) || []);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    try {
      const urls: string[] = [];
      for (const file of Array.from(files)) {
        const res = await mediaApi.upload(file);
        if (res.data?.url) urls.push(res.data.url);
      }
      handleChange("galleryUrls", [...(form.galleryUrls || []), ...urls]);
    } catch {
      setError("Failed to upload files");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCover(true);
    try {
      const res = await mediaApi.upload(file);
      if (res.data?.url) handleChange("imageUrl", res.data.url);
    } catch {
      setError("Failed to upload cover image");
    } finally {
      setUploadingCover(false);
      if (coverFileInputRef.current) coverFileInputRef.current.value = "";
    }
  };

  const removeGalleryImage = (url: string) => {
    handleChange("galleryUrls", (form.galleryUrls || []).filter((u) => u !== url));
  };

  const sanitize = (data: ProjectFormData): ProjectFormData => ({
    ...data,
    imageUrl: data.imageUrl || null,
    role: data.role || null,
    timeline: data.timeline || null,
    challenge: data.challenge || null,
    links: {
      github: data.links?.github || null,
      live: data.links?.live || null,
      caseStudy: data.links?.caseStudy || null,
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = sanitize(form);
      if (isNew) {
        await projectsApi.create(payload);
      } else {
        await projectsApi.update(params.id as string, payload);
      }
      router.push("/admin/projects");
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to save project");
      }
    } finally {
      setSaving(false);
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
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 font-code-sm text-code-sm text-on-surface-variant mb-2">
        <button onClick={() => router.push("/admin/projects")} className="hover:text-primary transition-colors">
          Projects
        </button>
        <span className="material-symbols-outlined text-sm">chevron_right</span>
        <span className="text-primary">{isNew ? "New Project" : "Edit Configuration"}</span>
      </div>

      <h2 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface tracking-tighter mb-2">
        {isNew ? "Create Project" : form.title}
      </h2>
      <p className="font-body-base text-body-base text-on-surface-variant mt-2 max-w-2xl mb-8">
        Configure project details, manage deployment links, and update media assets.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="bg-surface border border-white/10 rounded-2xl shadow-2xl overflow-hidden relative inner-glow">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-container/10 rounded-full blur-[100px] pointer-events-none" />

          {/* Tabs */}
          <div className="flex border-b border-white/5 px-6 pt-4 gap-8 overflow-x-auto no-scrollbar relative z-10">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`pb-4 font-code-sm text-code-sm transition-colors ${
                  activeTab === tab.id
                    ? "text-primary border-b-2 border-primary"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">{tab.icon}</span>
                  {tab.label}
                </span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6 md:p-8 relative z-10">
            {error && (
              <div className="mb-6 p-4 bg-error-container/20 border border-error/30 rounded-lg">
                <p className="font-code-sm text-code-sm text-error">{error}</p>
              </div>
            )}

            {/* Details Tab */}
            {activeTab === "details" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 flex flex-col gap-6">
                  <Input
                    id="title"
                    label="Project Name *"
                    value={form.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    placeholder="e.g. Finance Dashboard"
                    required
                  />
                  <Input
                    id="slug"
                    label="Slug *"
                    value={form.slug}
                    onChange={(e) => handleChange("slug", e.target.value)}
                    placeholder="e.g. finance-dashboard"
                    required
                  />
                  <div className="flex flex-col gap-2">
                    <label className="font-label-caps text-label-caps text-on-surface-variant">
                      Description
                    </label>
                    <Textarea
                      id="description"
                      value={form.description}
                      onChange={(e) => handleChange("description", e.target.value)}
                      placeholder="Provide a comprehensive overview of the project..."
                      rows={5}
                    />
                    <div className="flex justify-between">
                      <span className="font-code-sm text-[10px] text-on-surface-variant/70">
                        Supports Markdown formatting
                      </span>
                      <span className="font-code-sm text-[10px] text-on-surface-variant/70">
                        {form.description.length} / 5000
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-label-caps text-label-caps text-on-surface-variant">
                      Challenge / Overview
                    </label>
                    <Textarea
                      id="challenge"
                      value={form.challenge || ""}
                      onChange={(e) => handleChange("challenge", e.target.value)}
                      placeholder="Describe the problem the project solves..."
                      rows={4}
                    />
                  </div>
                </div>
                <div className="lg:col-span-4 flex flex-col gap-6">
                  <Select
                    id="status"
                    label="Status"
                    options={statusOptions}
                    value={form.status}
                    onChange={(e) => handleChange("status", e.target.value)}
                  />
                  <Select
                    id="category"
                    label="Category"
                    options={categoryOptions}
                    value={form.category}
                    onChange={(e) => handleChange("category", e.target.value)}
                  />
                  <Input
                    id="role"
                    label="Role"
                    value={form.role || ""}
                    onChange={(e) => handleChange("role", e.target.value)}
                    placeholder="e.g. Lead Mobile Engineer"
                  />
                  <Input
                    id="timeline"
                    label="Timeline"
                    value={form.timeline || ""}
                    onChange={(e) => handleChange("timeline", e.target.value)}
                    placeholder="e.g. 4 Months"
                  />
                  <label className="flex items-center gap-3 cursor-pointer mt-4">
                    <input
                      type="checkbox"
                      checked={form.featured}
                      onChange={(e) => handleChange("featured", e.target.checked)}
                      className="w-4 h-4 rounded border-white/10 bg-[#050505] text-primary-container focus:ring-primary"
                    />
                    <span className="font-code-sm text-code-sm text-on-surface">
                      Featured project
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* Links Tab */}
            {activeTab === "links" && (
              <div className="max-w-xl space-y-6">
                <Input
                  id="github"
                  label="GitHub URL"
                  value={form.links?.github || ""}
                  onChange={(e) => handleLinkChange("github", e.target.value)}
                  placeholder="https://github.com/user/repo"
                />
                <Input
                  id="live"
                  label="Live URL"
                  value={form.links?.live || ""}
                  onChange={(e) => handleLinkChange("live", e.target.value)}
                  placeholder="https://myapp.com"
                />
                <Input
                  id="caseStudy"
                  label="Case Study URL"
                  value={form.links?.caseStudy || ""}
                  onChange={(e) => handleLinkChange("caseStudy", e.target.value)}
                  placeholder="https://myblog.com/case-study"
                />
              </div>
            )}

            {/* Media Tab */}
            {activeTab === "media" && (
              <div className="space-y-6">
                <div className="flex flex-col gap-4">
                  <label className="font-label-caps text-label-caps text-on-surface-variant">
                    Cover Image
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <Input
                        id="imageUrl"
                        value={form.imageUrl || ""}
                        onChange={(e) => handleChange("imageUrl", e.target.value || null)}
                        placeholder="https://example.com/cover.jpg"
                      />
                    </div>
                    <input
                      ref={coverFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleCoverUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => coverFileInputRef.current?.click()}
                      disabled={uploadingCover}
                      className="px-4 py-3 rounded-xl border border-white/10 text-on-surface-variant font-code-sm text-code-sm hover:text-on-surface hover:bg-surface transition-all shrink-0"
                    >
                      {uploadingCover ? "Uploading..." : "Upload"}
                    </button>
                  </div>
                  {form.imageUrl && (
                    <div className="w-full max-w-md aspect-video rounded-xl overflow-hidden border border-white/10">
                      <img
                        src={form.imageUrl}
                        alt="Cover preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>

                <div className="border-t border-white/5 pt-6">
                  <label className="font-label-caps text-label-caps text-on-surface-variant mb-3 block">
                    Upload Gallery Images from Device
                  </label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-2 block">cloud_upload</span>
                    <p className="font-body-base text-body-base text-on-surface-variant">
                      {uploading ? "Uploading..." : "Tap or click to select images"}
                    </p>
                    <p className="font-code-sm text-code-sm text-on-surface-variant/50 mt-1">
                      Supports JPG, PNG, GIF, WebP — select multiple
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <label className="font-label-caps text-label-caps text-on-surface-variant">
                    Gallery Images
                  </label>
                  {(form.galleryUrls || []).length === 0 ? (
                    <p className="text-on-surface-variant/50 text-sm">No images added yet.</p>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {(form.galleryUrls || []).map((url, i) => (
                        <div key={i} className="relative group aspect-video rounded-lg overflow-hidden border border-white/10">
                          <img src={url} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeGalleryImage(url)}
                            className="absolute top-1 right-1 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <span className="material-symbols-outlined text-sm">close</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-label-caps text-label-caps text-on-surface-variant">
                    Or paste image URLs (one per line)
                  </label>
                  <Textarea
                    value={(form.galleryUrls || []).join("\n")}
                    onChange={(e) =>
                      handleChange(
                        "galleryUrls",
                        e.target.value.split("\n").filter((u) => u.trim())
                      )
                    }
                    placeholder="https://example.com/img1.jpg"
                    rows={3}
                  />
                </div>
              </div>
            )}

            {/* Tech Stack Tab */}
            {activeTab === "tech" && (
              <div className="max-w-xl space-y-6">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTech(); } }}
                    placeholder="Type a technology and press Enter..."
                    className="flex-1 bg-background border border-white/10 rounded-xl px-4 py-3 font-body-base text-body-base text-on-surface focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all placeholder:text-on-surface-variant/50"
                  />
                  <button
                    type="button"
                    onClick={addTech}
                    className="px-4 py-3 bg-primary-container text-on-primary-container rounded-xl font-code-sm text-code-sm font-bold hover:opacity-90 transition-opacity"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {(form.techStack || []).length === 0 ? (
                    <p className="text-on-surface-variant text-sm">
                      No technologies added yet.
                    </p>
                  ) : (
                    (form.techStack || []).map((tech) => (
                      <span
                        key={tech}
                        className="chip px-3 py-1.5 rounded-lg font-code-sm text-xs flex items-center gap-2"
                      >
                        {tech}
                        <button
                          type="button"
                          onClick={() => removeTech(tech)}
                          className="text-on-surface-variant hover:text-error transition-colors"
                        >
                          <span className="material-symbols-outlined text-sm">close</span>
                        </button>
                      </span>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-6 md:p-8 border-t border-white/5 bg-surface-container-lowest flex flex-col-reverse md:flex-row justify-between items-center gap-4 relative z-10">
            <button
              type="button"
              onClick={() => router.push("/admin/projects")}
              className="w-full md:w-auto px-6 py-3 rounded-xl border border-white/10 text-on-surface-variant font-code-sm text-code-sm hover:text-on-surface hover:bg-surface transition-all"
            >
              Cancel
            </button>
            <div className="flex items-center gap-3 w-full md:w-auto">
              {!isNew && form.slug && (
                <a
                  href={`/projects/${form.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full md:w-auto px-6 py-3 rounded-xl border border-primary/30 text-primary font-code-sm text-code-sm flex items-center justify-center gap-2 hover:bg-primary/10 transition-all"
                >
                  <span className="material-symbols-outlined text-sm">open_in_new</span>
                  Preview
                </a>
              )}
              <button
                type="submit"
                disabled={saving}
                className="w-full md:w-auto px-8 py-3 rounded-xl bg-primary-container text-on-primary-container font-code-sm text-code-sm font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity inner-glow shadow-[0_0_20px_rgba(0,112,243,0.3)] disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-sm">save</span>
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
