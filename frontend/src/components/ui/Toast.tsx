"use client";

import { useCallback, useEffect, useState } from "react";

export type ToastKind = "success" | "error" | "info";
export interface ToastState {
  msg: string;
  kind: ToastKind;
  id: number;
}

/** Minimal toast: one message at a time, auto-dismisses. Replaces alert(). */
export function useToast() {
  const [toast, setToast] = useState<ToastState | null>(null);

  const show = useCallback((msg: string, kind: ToastKind = "success") => {
    setToast({ msg, kind, id: Date.now() });
  }, []);

  const clear = useCallback(() => setToast(null), []);

  return { toast, show, clear };
}

const KIND_STYLES: Record<ToastKind, { icon: string; ring: string; text: string }> = {
  success: { icon: "check_circle", ring: "border-tertiary/40", text: "text-tertiary" },
  error: { icon: "error", ring: "border-error/40", text: "text-error" },
  info: { icon: "info", ring: "border-primary/40", text: "text-primary" },
};

export function ToastHost({
  toast,
  onClose,
  duration = 3000,
}: {
  toast: ToastState | null;
  onClose: () => void;
  duration?: number;
}) {
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(onClose, duration);
    return () => clearTimeout(t);
  }, [toast, duration, onClose]);

  if (!toast) return null;
  const style = KIND_STYLES[toast.kind];

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 right-6 z-[100] max-w-sm animate-[page-fade-in_0.2s_ease-out]"
    >
      <div
        className={`flex items-start gap-3 bg-[#14181F] border ${style.ring} rounded-xl px-4 py-3 shadow-2xl backdrop-blur-sm`}
      >
        <span className={`material-symbols-outlined text-[20px] ${style.text}`}>
          {style.icon}
        </span>
        <p className="font-code-sm text-code-sm text-on-surface flex-1">{toast.msg}</p>
        <button
          type="button"
          onClick={onClose}
          className="text-on-surface-variant hover:text-on-surface transition-colors"
          aria-label="Dismiss"
        >
          <span className="material-symbols-outlined text-[16px]">close</span>
        </button>
      </div>
    </div>
  );
}
