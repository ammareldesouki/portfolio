"use client";

import { useEffect, useRef, useState } from "react";
import { searchIcons, iconOptionUrl } from "@/lib/iconCatalog";

function IconPreview({ icon, size = 20 }: { icon?: string; size?: number }) {
  const isUrl = icon?.startsWith("http://") || icon?.startsWith("https://");
  if (icon && isUrl) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={icon}
        alt=""
        style={{ width: size, height: size }}
        className="object-contain"
      />
    );
  }
  if (icon) {
    return (
      <span className="material-symbols-outlined text-primary" style={{ fontSize: size }}>
        {icon}
      </span>
    );
  }
  return (
    <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: size }}>
      image
    </span>
  );
}

/**
 * Searchable icon picker with live preview. Selecting a result stores its
 * devicon SVG URL (the existing `icon` shape). A manual field still allows
 * pasting a custom URL or a Material Symbols name.
 */
export function IconPicker({
  value,
  onChange,
}: {
  value?: string;
  onChange: (icon: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  const results = searchIcons(query);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex items-center gap-2 h-9 px-2 rounded-lg bg-[#1E242D] border border-white/10 hover:border-primary/50 transition-colors min-w-[3rem]"
        title="Choose an icon"
      >
        <IconPreview icon={value} />
        <span className="material-symbols-outlined text-[16px] text-on-surface-variant">
          {open ? "expand_less" : "expand_more"}
        </span>
      </button>

      {open && (
        <div className="absolute z-30 mt-2 w-72 bg-[#0F131A] border border-white/10 rounded-xl shadow-2xl p-3 space-y-3">
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search icons (flutter, react, aws…)"
            className="w-full bg-[#1E242D] border border-white/10 rounded-lg px-3 py-2 font-code-sm text-code-sm text-on-surface outline-none focus:border-primary/50"
          />

          <div className="grid grid-cols-6 gap-1.5 max-h-48 overflow-y-auto no-scrollbar">
            {results.length === 0 ? (
              <p className="col-span-6 text-center text-on-surface-variant text-xs py-4">
                No matches. Paste a URL below.
              </p>
            ) : (
              results.map((opt) => {
                const url = iconOptionUrl(opt);
                const selected = value === url;
                return (
                  <button
                    key={opt.name}
                    type="button"
                    onClick={() => {
                      onChange(url);
                      setOpen(false);
                      setQuery("");
                    }}
                    title={opt.name}
                    className={`aspect-square flex items-center justify-center rounded-lg border transition-colors ${
                      selected
                        ? "border-primary bg-primary/10"
                        : "border-white/5 bg-[#1E242D] hover:border-primary/50"
                    }`}
                  >
                    <IconPreview icon={url} size={22} />
                  </button>
                );
              })
            )}
          </div>

          <div className="pt-1 border-t border-white/5 space-y-1.5">
            <label className="font-label-caps text-label-caps text-on-surface-variant">
              Custom URL or Material icon name
            </label>
            <input
              type="text"
              value={value || ""}
              onChange={(e) => onChange(e.target.value)}
              placeholder="https://… or e.g. code"
              className="w-full bg-[#1E242D] border border-white/10 rounded-lg px-3 py-2 font-code-sm text-code-sm text-on-surface outline-none focus:border-primary/50"
            />
          </div>
        </div>
      )}
    </div>
  );
}
