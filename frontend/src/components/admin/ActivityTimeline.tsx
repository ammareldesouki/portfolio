"use client";

interface ActivityEvent {
  time: string;
  description: React.ReactNode;
  type?: "primary" | "default" | "success";
}

interface ActivityTimelineProps {
  events: ActivityEvent[];
}

export function ActivityTimeline({ events }: ActivityTimelineProps) {
  const dotColors: Record<string, string> = {
    primary: "bg-primary",
    default: "bg-surface-bright border border-white/20",
    success: "bg-tertiary",
  };

  return (
    <div className="relative border-l border-white/10 ml-3 pl-6 space-y-8 py-2">
      {events.map((event, i) => (
        <div key={i} className="relative">
          <div
            className={`absolute -left-[31px] top-1 w-3 h-3 rounded-full ring-4 ring-[#050505] ${dotColors[event.type || "default"]}`}
          />
          <p className="text-xs font-code-sm text-on-surface-variant mb-1">
            {event.time}
          </p>
          <p className="text-sm text-on-surface">{event.description}</p>
        </div>
      ))}
    </div>
  );
}
