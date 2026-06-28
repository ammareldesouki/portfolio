"use client";

import { useEffect, useState, useRef } from "react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Toggle } from "@/components/ui/Toggle";
import { settingsApi } from "@/lib/api/settings";
import { mediaApi, LocalMediaResource } from "@/lib/api/media";

export default function AdminSettingsPage() {
  const [media, setMedia] = useState<LocalMediaResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    displayName: "",
    tagline: "",
    siteTitle: "",
    metaDescription: "",
    forceDarkMode: true,
    socialLinks: [{ name: "", icon: "link", url: "" }],
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
            siteTitle: s.siteTitle,
            metaDescription: s.metaDescription || "",
            forceDarkMode: s.forceDarkMode ?? true,
            socialLinks: s.socialLinks?.length ? s.socialLinks : [{ name: "", icon: "link", url: "" }],
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

  const handleChange = (field: string, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSocialChange = (index: number, field: "name" | "icon" | "url", value: string) => {
    const links = [...form.socialLinks];
    links[index] = { ...links[index], [field]: value };
    handleChange("socialLinks", links);
  };

  const addSocialLink = () => {
    handleChange("socialLinks", [...form.socialLinks, { name: "", icon: "link", url: "" }]);
  };

  const removeSocialLink = (index: number) => {
    const links = form.socialLinks.filter((_, i) => i !== index);
    handleChange("socialLinks", links);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await settingsApi.update(form);
      alert("Settings saved");
    } catch (err) {
      console.error("Failed to save settings", err);
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
      {/* Media Library */}
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
          {/* Upload Dropzone */}
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

          {/* Asset Grid */}
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

      {/* Settings */}
      <section>
        <div className="mb-8">
          <h3 className="font-headline-md text-headline-md text-on-surface">
            Global Settings
          </h3>
          <p className="font-code-sm text-code-sm text-on-surface-variant mt-1">
            Configure your portfolio identity and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Form Area */}
          <div className="lg:col-span-8 space-y-8">
            {/* Profile */}
            <div className="bg-[#0A0C10] p-6 rounded-xl border border-white/10">
              <h4 className="font-body-base text-body-base font-semibold text-on-surface mb-6 border-b border-white/5 pb-2">
                Profile & Identity
              </h4>
              <div className="space-y-4">
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
              </div>
            </div>

            {/* SEO */}
            <div className="bg-[#0A0C10] p-6 rounded-xl border border-white/10">
              <h4 className="font-body-base text-body-base font-semibold text-on-surface mb-6 border-b border-white/5 pb-2">
                SEO Metadata
              </h4>
              <div className="space-y-4">
                <Input
                  id="siteTitle"
                  label="Site Title"
                  value={form.siteTitle}
                  onChange={(e) => handleChange("siteTitle", e.target.value)}
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
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            {/* Social Links */}
            <div className="bg-[#0A0C10] p-6 rounded-xl border border-white/10">
              <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-2">
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
              <div className="space-y-3">
                {form.socialLinks.map((link, i) => (
                  <div key={i} className="flex flex-col gap-2 bg-[#050505] border border-white/5 p-3 rounded-lg">
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
                        placeholder="Icon name"
                        className="w-24 bg-transparent border border-white/5 rounded text-on-surface-variant font-code-sm text-[10px] px-2 py-1 focus:ring-0 outline-none text-center"
                        title="Material Symbols icon name"
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
                      placeholder="URL or phone (e.g. https://github.com/... or tel:+1234567890)"
                      className="w-full bg-transparent border border-white/5 rounded text-on-surface font-code-sm text-code-sm px-2 py-1 focus:ring-0 outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Preferences */}
            <div className="bg-[#0A0C10] p-6 rounded-xl border border-white/10">
              <h4 className="font-body-base text-body-base font-semibold text-on-surface mb-6 border-b border-white/5 pb-2">
                Preferences
              </h4>
              <Toggle
                label="Force Dark Mode"
                description="Always show dark mode for viewers"
                checked={form.forceDarkMode}
                onChange={(v) => handleChange("forceDarkMode", v)}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4">
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
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
