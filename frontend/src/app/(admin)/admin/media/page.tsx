"use client";

import { useEffect, useRef, useState } from "react";
import { mediaApi, LocalMediaResource } from "@/lib/api/media";
import { useToast, ToastHost } from "@/components/ui/Toast";

export default function AdminMediaPage() {
  const [media, setMedia] = useState<LocalMediaResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast, show, clear } = useToast();

  useEffect(() => {
    mediaApi
      .list()
      .then((res) => setMedia(res.data || []))
      .catch((err) => console.error("Failed to load media", err))
      .finally(() => setLoading(false));
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      await mediaApi.upload(file);
      const mediaRes = await mediaApi.list();
      setMedia(mediaRes.data || []);
      show("File uploaded", "success");
    } catch (err) {
      show("Upload failed: " + (err instanceof Error ? err.message : "Unknown error"), "error");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDeleteMedia = async (publicId: string) => {
    if (!confirm("Delete this file? This cannot be undone.")) return;
    try {
      await mediaApi.delete(publicId);
      setMedia((prev) => prev.filter((m) => m.public_id !== publicId));
      show("File deleted", "info");
    } catch {
      show("Delete failed", "error");
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    show("URL copied to clipboard", "success");
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
    <div className="pb-24">
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

      <div className="flex flex-col gap-6">
        <div
          onClick={() => fileInputRef.current?.click()}
          className="bg-[#0F131A] border border-dashed border-white/20 rounded-xl flex flex-col items-center justify-center p-8 text-center min-h-[200px] transition-colors hover:border-primary cursor-pointer group"
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
            accept="image/*,video/*,application/pdf"
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            type="button"
            disabled={uploading}
            className="px-6 py-2 bg-[#1E242D] border border-white/10 rounded-lg font-code-sm text-code-sm text-on-surface hover:border-primary/50 transition-colors disabled:opacity-50"
          >
            Select Files
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {media.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center h-[200px] text-on-surface-variant text-sm gap-2">
              <span className="material-symbols-outlined text-3xl opacity-60">
                image
              </span>
              No media uploaded yet.
            </div>
          ) : (
            media.map((asset) => (
              <div
                key={asset.public_id}
                className="bg-[#0F131A] rounded-xl overflow-hidden border border-white/10 group relative aspect-square"
              >
                {asset.resource_type === "video" ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-surface-bright/20">
                    <span className="material-symbols-outlined text-4xl text-on-surface-variant">
                      play_circle
                    </span>
                  </div>
                ) : asset.format === "pdf" ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-surface-bright/20">
                    <span className="material-symbols-outlined text-4xl text-on-surface-variant">
                      picture_as_pdf
                    </span>
                  </div>
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={asset.secure_url}
                    alt={asset.original_filename}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                  <button
                    onClick={() => handleDeleteMedia(asset.public_id)}
                    className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-error hover:text-on-error transition-colors"
                    aria-label="Delete file"
                  >
                    <span className="material-symbols-outlined text-[16px]">delete</span>
                  </button>
                  <div className="flex flex-col gap-1 w-full">
                    <div className="flex justify-between items-center w-full gap-1">
                      <span className="font-code-sm text-[10px] text-white bg-[#16181D]/80 px-2 py-0.5 rounded backdrop-blur-sm truncate max-w-[65%]">
                        {asset.original_filename}.{asset.format}
                      </span>
                      <span className="font-code-sm text-[10px] text-white bg-[#16181D]/80 px-2 py-0.5 rounded backdrop-blur-sm shrink-0">
                        {formatBytes(asset.bytes)}
                      </span>
                    </div>
                    <button
                      onClick={() => copyUrl(asset.secure_url)}
                      className="font-code-sm text-[10px] text-primary bg-primary/20 px-2 py-1 rounded backdrop-blur-sm hover:bg-primary/30 transition-colors"
                    >
                      Copy URL
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <ToastHost toast={toast} onClose={clear} />
    </div>
  );
}
