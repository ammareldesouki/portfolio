"use client";

import { useEffect, useRef, useState, ElementType } from "react";

interface RevealProps {
  children: React.ReactNode;
  /** Render element (default div). Use "section" to preserve semantics. */
  as?: ElementType;
  className?: string;
  /** Stagger delay in ms for sequenced reveals. */
  delay?: number;
  id?: string;
}

/**
 * Scroll-reveal wrapper using IntersectionObserver (no animation library).
 * Adds `is-visible` once the element enters the viewport; the fade/translate
 * is defined in globals.css and disabled under prefers-reduced-motion.
 */
export function Reveal({ children, as, className = "", delay = 0, id }: RevealProps) {
  const Tag = (as || "div") as ElementType;
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // If the browser can't observe, or motion is reduced, just show it.
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      id={id}
      className={`reveal ${visible ? "is-visible" : ""} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
