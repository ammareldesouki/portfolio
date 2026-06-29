"use client";

interface TopAppBarProps {
  title: string;
  onMenuToggle?: () => void;
}

export function TopAppBar({ title, onMenuToggle }: TopAppBarProps) {
  return (
    <header className="bg-surface/80 backdrop-blur-xl border-b border-white/5 flex justify-between items-center px-gutter py-4 sticky top-0 z-30 transition-all">
      <div className="flex items-center gap-4">
        <button
          className="md:hidden text-on-surface-variant hover:text-primary transition-colors"
          onClick={onMenuToggle}
          aria-label="Toggle sidebar"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
        <h2 className="font-headline-md text-headline-md text-primary tracking-tighter font-extrabold hidden md:block">
          {title}
        </h2>
      </div>
      <div className="flex items-center gap-4">
        <button className="text-on-surface-variant hover:text-primary transition-colors p-2 rounded-full hover:bg-surface-bright/10">
          <span className="material-symbols-outlined">notifications</span>
        </button>
        <button className="text-on-surface-variant hover:text-primary transition-colors p-2 rounded-full hover:bg-surface-bright/10">
          <span className="material-symbols-outlined">apps</span>
        </button>
      </div>
    </header>
  );
}
