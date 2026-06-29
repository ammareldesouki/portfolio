"use client";

import { useEffect, useState } from "react";
import { settingsApi, type Skill } from "@/lib/api/settings";
import { SkillCard } from "@/components/ui/SkillCard";

function groupByCategory(skills: Skill[]): Record<string, Skill[]> {
  const grouped: Record<string, Skill[]> = {};
  for (const skill of skills) {
    const cat = skill.category || "Other";
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(skill);
  }
  return grouped;
}

export function SkillsSection() {
  const [skills, setSkills] = useState<Skill[]>([]);

  useEffect(() => {
    settingsApi
      .getPublic()
      .then((res) => setSkills(res.data?.skills || []))
      .catch(() => {});
  }, []);

  if (skills.length === 0) return null;

  const grouped = groupByCategory(skills);
  const categories = Object.keys(grouped);

  return (
    <section className="relative z-10" id="skills">
      <div className="max-w-content mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <h2 className="font-headline-md text-headline-md text-on-surface">
            Skills & Tooling
          </h2>
          <div className="h-px flex-grow bg-white/10" />
        </div>
        <div className="space-y-12">
          {categories.map((category) => (
            <div key={category} className="space-y-6">
              <h3 className="font-label-caps text-label-caps text-tertiary text-left">
                {category}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {grouped[category].map((skill, i) => (
                  <SkillCard key={i} name={skill.name} icon={skill.icon} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
