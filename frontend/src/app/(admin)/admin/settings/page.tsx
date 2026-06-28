"use client";

import { useEffect, useState, useRef } from "react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Toggle } from "@/components/ui/Toggle";
import { settingsApi } from "@/lib/api/settings";
import { mediaApi, LocalMediaResource } from "@/lib/api/media";
import type { Settings, Skill, Experience, Education, Certification, SocialLink } from "@/lib/api/settings";

const tabs = [
  { id: "general", label: "General", icon: "settings" },
  { id: "profile", label: "Profile", icon: "person" },
  { id: "skills", label: "Skills", icon: "psychology" },
  { id: "experience", label: "Experience", icon: "work_history" },
  { id: "education", label: "Education", icon: "school" },
  { id: "certifications", label: "Certifications", icon: "verified" },
  { id: "social", label: "Social Links", icon: "share" },
];

type FormState = Omit<Settings, "_id">;

export default function AdminSettingsPage() {
  const [media, setMedia] = useState<LocalMediaResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<FormState>({
    displayName: "",
    tagline: "",
    avatar: "",
    favicon: "",
    siteTitle: "",
    metaDescription: "",
    bio: "",
    aboutContent: "",
    location: "",
    email: "",
    phone: "",
    resumeUrl: "",
    skills: [],
    socialLinks: [{ name: "", icon: "link", url: "" }],
    experience: [],
    education: [],
    certifications: [],
    forceDarkMode: true,
    contactEnabled: true,
    showSkills: true,
    showExperience: true,
    showEducation: true,
    showCertifications: true,
  });

  useEffect(() => {
    async function load() {
      try {
        const [settingsRes, mediaRes] = await Promise.all([
          settingsApi.getAll(),
          mediaApi.list(),
        ]);
        if (settingsRes.data) {
          const s = settingsRes.data;
          setForm({
            displayName: s.displayName,
            tagline: s.tagline || "",
            avatar: s.avatar || "",
            favicon: s.favicon || "",
            siteTitle: s.siteTitle,
            metaDescription: s.metaDescription || "",
            bio: s.bio || "",
            aboutContent: s.aboutContent || "",
            location: s.location || "",
            email: s.email || "",
            phone: s.phone || "",
            resumeUrl: s.resumeUrl || "",
            skills: s.skills || [],
            socialLinks: s.socialLinks?.length ? s.socialLinks : [{ name: "", icon: "link", url: "" }],
            experience: s.experience || [],
            education: s.education || [],
            certifications: s.certifications || [],
            forceDarkMode: s.forceDarkMode ?? true,
            contactEnabled: s.contactEnabled ?? true,
            showSkills: s.showSkills ?? true,
            showExperience: s.showExperience ?? true,
            showEducation: s.showEducation ?? true,
            showCertifications: s.showCertifications ?? true,
          });
        }
        setMedia(mediaRes.data || []);
      } catch (err) {
        console.error("Failed to load settings", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  function handleChange(field: keyof FormState, value: unknown) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSocialChange(index: number, field: keyof SocialLink, value: string) {
    const links = [...form.socialLinks];
    links[index] = { ...links[index], [field]: value };
    handleChange("socialLinks", links);
  }

  function addSocialLink() {
    handleChange("socialLinks", [...form.socialLinks, { name: "", icon: "link", url: "" }]);
  }

  function removeSocialLink(index: number) {
    handleChange("socialLinks", form.socialLinks.filter((_, i) => i !== index));
  }

  function handleSkillChange(index: number, field: keyof Skill, value: string | number) {
    const skills = [...form.skills];
    skills[index] = { ...skills[index], [field]: value as never };
    handleChange("skills", skills);
  }

  function addSkill() {
    handleChange("skills", [...form.skills, { name: "", level: 50 }]);
  }

  function removeSkill(index: number) {
    handleChange("skills", form.skills.filter((_, i) => i !== index));
  }

  function handleExpChange(index: number, field: keyof Experience, value: unknown) {
    const items = [...form.experience];
    items[index] = { ...items[index], [field]: value as never };
    handleChange("experience", items);
  }

  function addExperience() {
    handleChange("experience", [...form.experience, {
      company: "", role: "", startDate: "", endDate: "",
      current: false, description: "", technologies: [],
    }]);
  }

  function removeExperience(index: number) {
    handleChange("experience", form.experience.filter((_, i) => i !== index));
  }

  function handleEduChange(index: number, field: keyof Education, value: unknown) {
    const items = [...form.education];
    items[index] = { ...items[index], [field]: value as never };
    handleChange("education", items);
  }

  function addEducation() {
    handleChange("education", [...form.education, {
      institution: "", degree: "", field: "", startDate: "", endDate: "",
      current: false, description: "",
    }]);
  }

  function removeEducation(index: number) {
    handleChange("education", form.education.filter((_, i) => i !== index));
  }

  function handleCertChange(index: number, field: keyof Certification, value: string) {
    const items = [...form.certifications];
    items[index] = { ...items[index], [field]: value };
    handleChange("certifications", items);
  }

  function addCertification() {
    handleChange("certifications", [...form.certifications, {
      name: "", issuer: "", date: "", url: "", description: "",
    }]);
  }

  function removeCertification(index: number) {
    handleChange("certifications", form.certifications.filter((_, i) => i !== index));
  }

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await settingsApi.update(form);
      if (res.success) {
        alert("Settings saved");
      } else {
        alert("Error: " + (res.error || res.message || "Unknown error"));
      }
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { error?: string } }; message?: string };
      const msg = axiosErr.response?.data?.error || axiosErr.message || "Unknown error";
      alert("Failed to save: " + msg);
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      await mediaApi.upload(file);
      const mediaRes = await mediaApi.list();
      setMedia(mediaRes.data || []);
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDeleteMedia = async (publicId: string) => {
    if (!confirm("Delete this file?")) return;
    try {
      await mediaApi.delete(publicId);
      setMedia((prev) => prev.filter((m) => m.public_id !== publicId));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-24">
      <section>
        <div className="flex justify-between items-end mb-6">
          <div>
            <h3 className="font-headline-md text-headline-md text-on-surface">
              Media Library
            </h3>
            <p className="font-code-sm text-code-sm text-on-surface-variant mt-1">
              Manage your uploaded assets
            </p>
          </div>
          <div className="text-right">
            <span className="font-label-caps text-label-caps text-tertiary">
              Storage Usage
            </span>
            <p className="font-code-sm text-code-sm text-on-surface-variant mt-1">
              {media.length} files
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="md:col-span-4 bg-[#0A0C10] border border-dashed border-white/20 rounded-xl flex flex-col items-center justify-center p-8 text-center min-h-[250px] transition-colors hover:border-primary cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-full bg-surface-bright/20 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
              <span className="material-symbols-outlined text-primary text-[24px]">
                {uploading ? "hourglass_top" : "cloud_upload"}
              </span>
            </div>
            <h4 className="font-body-base text-body-base font-semibold text-on-surface mb-2">
              {uploading ? "Uploading..." : "Drag & Drop files here"}
            </h4>
            <p className="font-code-sm text-code-sm text-on-surface-variant mb-6">
              or click to browse from your computer
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              type="button"
              disabled={uploading}
              className="px-6 py-2 bg-transparent border border-white/10 rounded-lg font-code-sm text-code-sm text-on-surface hover:bg-white/5 transition-colors disabled:opacity-50"
            >
              Select Files
            </button>
          </div>

          <div className="md:col-span-8 grid grid-cols-2 lg:grid-cols-3 gap-4">
            {media.length === 0 ? (
              <div className="col-span-full flex items-center justify-center h-[250px] text-on-surface-variant text-sm">
                No media uploaded yet.
              </div>
            ) : (
              media.map((asset) => (
                <div
                  key={asset.public_id}
                  className="bg-[#0A0C10] rounded-xl overflow-hidden border border-white/10 group relative aspect-square"
                >
                  {asset.resource_type === "video" ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-surface-bright/20">
                      <span className="material-symbols-outlined text-4xl text-on-surface-variant">
                        play_circle
                      </span>
                    </div>
                  ) : (
                    <img
                      src={asset.secure_url}
                      alt={asset.original_filename}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                    <div className="flex justify-between items-center w-full">
                      <span className="font-code-sm text-[10px] text-white bg-[#16181D]/80 px-2 py-0.5 rounded backdrop-blur-sm truncate max-w-[70%]">
                        {asset.original_filename}.{asset.format}
                      </span>
                      <span className="font-code-sm text-[10px] text-white bg-[#16181D]/80 px-2 py-0.5 rounded backdrop-blur-sm">
                        {formatBytes(asset.bytes)}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDeleteMedia(asset.public_id)}
                      className="absolute top-2 right-2 text-white hover:text-error transition-colors"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <hr className="border-t border-white/5" />

      <section>
        <div className="mb-8">
          <h3 className="font-headline-md text-headline-md text-on-surface">
            Global Settings
          </h3>
          <p className="font-code-sm text-code-sm text-on-surface-variant mt-1">
            Configure your portfolio identity and content
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-code-sm text-code-sm whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? "bg-primary-container text-on-primary-container"
                  : "text-on-surface-variant hover:bg-surface-bright/10 hover:text-on-surface"
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 space-y-8">
            {/* General Tab */}
            {activeTab === "general" && (
              <div className="bg-[#0A0C10] p-6 rounded-xl border border-white/10 space-y-4">
                <h4 className="font-body-base text-body-base font-semibold text-on-surface mb-4 border-b border-white/5 pb-2">
                  Site & SEO
                </h4>
                <Input
                  id="siteTitle"
                  label="Site Title"
                  value={form.siteTitle}
                  onChange={(e) => handleChange("siteTitle", e.target.value)}
                />
                <Input
                  id="favicon"
                  label="Favicon URL"
                  value={form.favicon || ""}
                  onChange={(e) => handleChange("favicon", e.target.value)}
                  placeholder="https://example.com/favicon.ico"
                />
                <div className="flex flex-col gap-2">
                  <label className="font-label-caps text-label-caps text-on-surface-variant">
                    Meta Description
                  </label>
                  <Textarea
                    id="metaDescription"
                    value={form.metaDescription}
                    onChange={(e) => handleChange("metaDescription", e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="space-y-4 pt-4 border-t border-white/5">
                  <h4 className="font-body-base text-body-base font-semibold text-on-surface mb-4">
                    Preferences
                  </h4>
                  <Toggle
                    label="Force Dark Mode"
                    description="Always show dark mode for viewers"
                    checked={form.forceDarkMode}
                    onChange={(v) => handleChange("forceDarkMode", v)}
                  />
                  <Toggle
                    label="Contact Form Enabled"
                    description="Show the contact form on the About page"
                    checked={form.contactEnabled}
                    onChange={(v) => handleChange("contactEnabled", v)}
                  />
                </div>
                <div className="space-y-4 pt-4 border-t border-white/5">
                  <h4 className="font-body-base text-body-base font-semibold text-on-surface mb-4">
                    Section Visibility
                  </h4>
                  <p className="font-code-sm text-code-sm text-on-surface-variant mb-2">
                    Toggle which sections appear on the public About page
                  </p>
                  <Toggle
                    label="Show Skills"
                    description="Display the skills section on About page"
                    checked={form.showSkills}
                    onChange={(v) => handleChange("showSkills", v)}
                  />
                  <Toggle
                    label="Show Experience"
                    description="Display the experience section"
                    checked={form.showExperience}
                    onChange={(v) => handleChange("showExperience", v)}
                  />
                  <Toggle
                    label="Show Education"
                    description="Display the education section"
                    checked={form.showEducation}
                    onChange={(v) => handleChange("showEducation", v)}
                  />
                  <Toggle
                    label="Show Certifications"
                    description="Display the certifications section"
                    checked={form.showCertifications}
                    onChange={(v) => handleChange("showCertifications", v)}
                  />
                </div>
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="bg-[#0A0C10] p-6 rounded-xl border border-white/10 space-y-4">
                <h4 className="font-body-base text-body-base font-semibold text-on-surface mb-4 border-b border-white/5 pb-2">
                  Personal Information
                </h4>
                <Input
                  id="displayName"
                  label="Display Name"
                  value={form.displayName}
                  onChange={(e) => handleChange("displayName", e.target.value)}
                />
                <Input
                  id="tagline"
                  label="Tagline"
                  value={form.tagline}
                  onChange={(e) => handleChange("tagline", e.target.value)}
                  placeholder="Senior Flutter Engineer"
                />
                <Input
                  id="location"
                  label="Location"
                  value={form.location}
                  onChange={(e) => handleChange("location", e.target.value)}
                  placeholder="San Francisco, CA"
                />
                <Input
                  id="email"
                  label="Email"
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="hello@example.com"
                />
                <Input
                  id="phone"
                  label="Phone"
                  value={form.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="+1 (555) 123-4567"
                />
                <Input
                  id="avatar"
                  label="Avatar URL"
                  value={form.avatar || ""}
                  onChange={(e) => handleChange("avatar", e.target.value)}
                  placeholder="https://example.com/avatar.jpg"
                />
                <div className="flex flex-col gap-2">
                  <label className="font-label-caps text-label-caps text-on-surface-variant">
                    Bio
                  </label>
                  <Textarea
                    id="bio"
                    value={form.bio}
                    onChange={(e) => handleChange("bio", e.target.value)}
                    rows={4}
                    placeholder="A short bio about yourself..."
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-label-caps text-label-caps text-on-surface-variant">
                    About Page Content
                  </label>
                  <Textarea
                    id="aboutContent"
                    value={form.aboutContent}
                    onChange={(e) => handleChange("aboutContent", e.target.value)}
                    rows={6}
                    placeholder="Full about section content..."
                  />
                </div>
              </div>
            )}

            {/* Skills Tab */}
            {activeTab === "skills" && (
              <div className="bg-[#0A0C10] p-6 rounded-xl border border-white/10 space-y-4">
                <div className="flex justify-between items-center border-b border-white/5 pb-2 mb-4">
                  <h4 className="font-body-base text-body-base font-semibold text-on-surface">
                    Skills
                  </h4>
                  <button
                    type="button"
                    onClick={addSkill}
                    className="text-primary hover:text-primary-fixed transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">add</span>
                  </button>
                </div>
                {form.skills.length === 0 && (
                  <p className="text-on-surface-variant text-sm text-center py-8">
                    No skills added yet. Click + to add one.
                  </p>
                )}
                {form.skills.map((skill, i) => (
                  <div key={i} className="flex items-center gap-3 bg-[#050505] border border-white/5 p-3 rounded-lg">
                    <input
                      type="text"
                      value={skill.name}
                      onChange={(e) => handleSkillChange(i, "name", e.target.value)}
                      placeholder="Skill name"
                      className="flex-1 bg-transparent border border-white/5 rounded text-on-surface font-code-sm text-code-sm px-2 py-1 outline-none focus:border-primary/50"
                    />
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={skill.level}
                        onChange={(e) => handleSkillChange(i, "level", parseInt(e.target.value))}
                        className="w-20 accent-primary"
                      />
                      <span className="font-code-sm text-code-sm text-on-surface-variant w-8 text-right">
                        {skill.level}%
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeSkill(i)}
                      className="text-on-surface-variant hover:text-error transition-colors flex-shrink-0"
                    >
                      <span className="material-symbols-outlined text-[16px]">close</span>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Experience Tab */}
            {activeTab === "experience" && (
              <div className="bg-[#0A0C10] p-6 rounded-xl border border-white/10 space-y-4">
                <div className="flex justify-between items-center border-b border-white/5 pb-2 mb-4">
                  <h4 className="font-body-base text-body-base font-semibold text-on-surface">
                    Work Experience
                  </h4>
                  <button
                    type="button"
                    onClick={addExperience}
                    className="text-primary hover:text-primary-fixed transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">add</span>
                  </button>
                </div>
                {form.experience.length === 0 && (
                  <p className="text-on-surface-variant text-sm text-center py-8">
                    No experience entries yet. Click + to add one.
                  </p>
                )}
                {form.experience.map((exp, i) => (
                  <div key={i} className="bg-[#050505] border border-white/5 p-4 rounded-lg space-y-3">
                    <div className="flex justify-between items-start">
                      <h5 className="font-code-sm text-code-sm font-semibold text-on-surface">
                        {exp.role || "New Role"} {exp.current && <span className="text-tertiary ml-2">(Current)</span>}
                      </h5>
                      <button
                        type="button"
                        onClick={() => removeExperience(i)}
                        className="text-on-surface-variant hover:text-error transition-colors"
                      >
                        <span className="material-symbols-outlined text-[16px]">close</span>
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={exp.role}
                        onChange={(e) => handleExpChange(i, "role", e.target.value)}
                        placeholder="Role (e.g. Lead Engineer)"
                        className="bg-transparent border border-white/5 rounded text-on-surface font-code-sm text-code-sm px-2 py-1 outline-none focus:border-primary/50"
                      />
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => handleExpChange(i, "company", e.target.value)}
                        placeholder="Company"
                        className="bg-transparent border border-white/5 rounded text-on-surface font-code-sm text-code-sm px-2 py-1 outline-none focus:border-primary/50"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <input
                        type="text"
                        value={exp.startDate}
                        onChange={(e) => handleExpChange(i, "startDate", e.target.value)}
                        placeholder="Start (e.g. 2021)"
                        className="bg-transparent border border-white/5 rounded text-on-surface font-code-sm text-code-sm px-2 py-1 outline-none focus:border-primary/50"
                      />
                      <input
                        type="text"
                        value={exp.endDate || ""}
                        onChange={(e) => handleExpChange(i, "endDate", e.target.value)}
                        placeholder="End (e.g. 2024)"
                        className="bg-transparent border border-white/5 rounded text-on-surface font-code-sm text-code-sm px-2 py-1 outline-none focus:border-primary/50"
                      />
                      <label className="flex items-center gap-2 text-on-surface-variant font-code-sm text-code-sm">
                        <input
                          type="checkbox"
                          checked={exp.current}
                          onChange={(e) => handleExpChange(i, "current", e.target.checked)}
                          className="accent-primary"
                        />
                        Current position
                      </label>
                    </div>
                    <textarea
                      value={exp.description}
                      onChange={(e) => handleExpChange(i, "description", e.target.value)}
                      placeholder="Describe your role and achievements..."
                      rows={3}
                      className="w-full bg-transparent border border-white/5 rounded text-on-surface font-code-sm text-code-sm px-2 py-1 outline-none focus:border-primary/50 resize-none"
                    />
                    <input
                      type="text"
                      value={exp.technologies?.join(", ") || ""}
                      onChange={(e) => handleExpChange(i, "technologies", e.target.value.split(", "))}
                      placeholder="Technologies (comma separated)"
                      className="w-full bg-transparent border border-white/5 rounded text-on-surface font-code-sm text-code-sm px-2 py-1 outline-none focus:border-primary/50"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Education Tab */}
            {activeTab === "education" && (
              <div className="bg-[#0A0C10] p-6 rounded-xl border border-white/10 space-y-4">
                <div className="flex justify-between items-center border-b border-white/5 pb-2 mb-4">
                  <h4 className="font-body-base text-body-base font-semibold text-on-surface">
                    Education
                  </h4>
                  <button
                    type="button"
                    onClick={addEducation}
                    className="text-primary hover:text-primary-fixed transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">add</span>
                  </button>
                </div>
                {form.education.length === 0 && (
                  <p className="text-on-surface-variant text-sm text-center py-8">
                    No education entries yet. Click + to add one.
                  </p>
                )}
                {form.education.map((edu, i) => (
                  <div key={i} className="bg-[#050505] border border-white/5 p-4 rounded-lg space-y-3">
                    <div className="flex justify-between items-start">
                      <h5 className="font-code-sm text-code-sm font-semibold text-on-surface">
                        {edu.degree || "New Degree"} {edu.current && <span className="text-tertiary ml-2">(Current)</span>}
                      </h5>
                      <button
                        type="button"
                        onClick={() => removeEducation(i)}
                        className="text-on-surface-variant hover:text-error transition-colors"
                      >
                        <span className="material-symbols-outlined text-[16px]">close</span>
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={edu.institution}
                        onChange={(e) => handleEduChange(i, "institution", e.target.value)}
                        placeholder="Institution"
                        className="bg-transparent border border-white/5 rounded text-on-surface font-code-sm text-code-sm px-2 py-1 outline-none focus:border-primary/50"
                      />
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => handleEduChange(i, "degree", e.target.value)}
                        placeholder="Degree (e.g. B.Sc.)"
                        className="bg-transparent border border-white/5 rounded text-on-surface font-code-sm text-code-sm px-2 py-1 outline-none focus:border-primary/50"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <input
                        type="text"
                        value={edu.field}
                        onChange={(e) => handleEduChange(i, "field", e.target.value)}
                        placeholder="Field (e.g. Computer Science)"
                        className="bg-transparent border border-white/5 rounded text-on-surface font-code-sm text-code-sm px-2 py-1 outline-none focus:border-primary/50"
                      />
                      <input
                        type="text"
                        value={edu.startDate}
                        onChange={(e) => handleEduChange(i, "startDate", e.target.value)}
                        placeholder="Start (e.g. 2016)"
                        className="bg-transparent border border-white/5 rounded text-on-surface font-code-sm text-code-sm px-2 py-1 outline-none focus:border-primary/50"
                      />
                      <input
                        type="text"
                        value={edu.endDate || ""}
                        onChange={(e) => handleEduChange(i, "endDate", e.target.value)}
                        placeholder="End (e.g. 2020)"
                        className="bg-transparent border border-white/5 rounded text-on-surface font-code-sm text-code-sm px-2 py-1 outline-none focus:border-primary/50"
                      />
                    </div>
                    <label className="flex items-center gap-2 text-on-surface-variant font-code-sm text-code-sm">
                      <input
                        type="checkbox"
                        checked={edu.current || false}
                        onChange={(e) => handleEduChange(i, "current", e.target.checked)}
                        className="accent-primary"
                      />
                      Currently enrolled
                    </label>
                    <textarea
                      value={edu.description || ""}
                      onChange={(e) => handleEduChange(i, "description", e.target.value)}
                      placeholder="Additional details..."
                      rows={2}
                      className="w-full bg-transparent border border-white/5 rounded text-on-surface font-code-sm text-code-sm px-2 py-1 outline-none focus:border-primary/50 resize-none"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Certifications Tab */}
            {activeTab === "certifications" && (
              <div className="bg-[#0A0C10] p-6 rounded-xl border border-white/10 space-y-4">
                <div className="flex justify-between items-center border-b border-white/5 pb-2 mb-4">
                  <h4 className="font-body-base text-body-base font-semibold text-on-surface">
                    Certifications
                  </h4>
                  <button
                    type="button"
                    onClick={addCertification}
                    className="text-primary hover:text-primary-fixed transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">add</span>
                  </button>
                </div>
                {form.certifications.length === 0 && (
                  <p className="text-on-surface-variant text-sm text-center py-8">
                    No certifications yet. Click + to add one.
                  </p>
                )}
                {form.certifications.map((cert, i) => (
                  <div key={i} className="bg-[#050505] border border-white/5 p-4 rounded-lg space-y-3">
                    <div className="flex justify-between items-start">
                      <h5 className="font-code-sm text-code-sm font-semibold text-on-surface">
                        {cert.name || "New Certification"}
                      </h5>
                      <button
                        type="button"
                        onClick={() => removeCertification(i)}
                        className="text-on-surface-variant hover:text-error transition-colors"
                      >
                        <span className="material-symbols-outlined text-[16px]">close</span>
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={cert.name}
                        onChange={(e) => handleCertChange(i, "name", e.target.value)}
                        placeholder="Certification name"
                        className="bg-transparent border border-white/5 rounded text-on-surface font-code-sm text-code-sm px-2 py-1 outline-none focus:border-primary/50"
                      />
                      <input
                        type="text"
                        value={cert.issuer}
                        onChange={(e) => handleCertChange(i, "issuer", e.target.value)}
                        placeholder="Issuer (e.g. Google)"
                        className="bg-transparent border border-white/5 rounded text-on-surface font-code-sm text-code-sm px-2 py-1 outline-none focus:border-primary/50"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={cert.date}
                        onChange={(e) => handleCertChange(i, "date", e.target.value)}
                        placeholder="Date (e.g. 2023)"
                        className="bg-transparent border border-white/5 rounded text-on-surface font-code-sm text-code-sm px-2 py-1 outline-none focus:border-primary/50"
                      />
                      <input
                        type="text"
                        value={cert.url || ""}
                        onChange={(e) => handleCertChange(i, "url", e.target.value)}
                        placeholder="Credential URL (optional)"
                        className="bg-transparent border border-white/5 rounded text-on-surface font-code-sm text-code-sm px-2 py-1 outline-none focus:border-primary/50"
                      />
                    </div>
                    <textarea
                      value={cert.description || ""}
                      onChange={(e) => handleCertChange(i, "description", e.target.value)}
                      placeholder="Description (optional)"
                      rows={2}
                      className="w-full bg-transparent border border-white/5 rounded text-on-surface font-code-sm text-code-sm px-2 py-1 outline-none focus:border-primary/50 resize-none"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Social Links Tab */}
            {activeTab === "social" && (
              <div className="bg-[#0A0C10] p-6 rounded-xl border border-white/10 space-y-4">
                <div className="flex justify-between items-center border-b border-white/5 pb-2 mb-4">
                  <h4 className="font-body-base text-body-base font-semibold text-on-surface">
                    Social Links
                  </h4>
                  <button
                    type="button"
                    onClick={addSocialLink}
                    className="text-primary hover:text-primary-fixed transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">add</span>
                  </button>
                </div>
                {form.socialLinks.length === 0 && (
                  <p className="text-on-surface-variant text-sm text-center py-8">
                    No social links yet. Click + to add one.
                  </p>
                )}
                {form.socialLinks.map((link, i) => (
                  <div key={i} className="bg-[#050505] border border-white/5 p-3 rounded-lg space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-on-surface-variant text-[20px]">{link.icon || "link"}</span>
                      <input
                        type="text"
                        value={link.name}
                        onChange={(e) => handleSocialChange(i, "name", e.target.value)}
                        placeholder="Label (e.g. GitHub)"
                        className="flex-1 bg-transparent border-none text-on-surface font-code-sm text-code-sm focus:ring-0 p-0 outline-none"
                      />
                      <input
                        type="text"
                        value={link.icon}
                        onChange={(e) => handleSocialChange(i, "icon", e.target.value)}
                        placeholder="Icon or URL"
                        className="w-28 bg-transparent border border-white/5 rounded text-on-surface-variant font-code-sm text-[10px] px-2 py-1 text-center outline-none"
                        title="Material Symbols name (e.g. github) or image URL (e.g. https://...)"
                      />
                      <button
                        type="button"
                        onClick={() => removeSocialLink(i)}
                        className="text-on-surface-variant hover:text-error transition-colors"
                      >
                        <span className="material-symbols-outlined text-[16px]">close</span>
                      </button>
                    </div>
                    <input
                      type="text"
                      value={link.url}
                      onChange={(e) => handleSocialChange(i, "url", e.target.value)}
                      placeholder="URL or phone"
                      className="w-full bg-transparent border border-white/5 rounded text-on-surface font-code-sm text-code-sm px-2 py-1 outline-none"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar actions */}
          <div className="lg:col-span-4">
            <div className="bg-[#0A0C10] p-6 rounded-xl border border-white/10 sticky top-24 space-y-4">
              <h4 className="font-body-base text-body-base font-semibold text-on-surface border-b border-white/5 pb-2">
                Actions
              </h4>
              <p className="font-code-sm text-code-sm text-on-surface-variant">
                Tab: <span className="text-on-surface capitalize">{activeTab}</span>
              </p>
              <div className="flex gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="flex-1 py-3 px-4 bg-transparent border border-white/10 text-on-surface font-code-sm text-code-sm rounded-lg hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 py-3 px-4 bg-primary-container text-on-primary-container font-code-sm text-code-sm rounded-lg inner-glow hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save All"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
