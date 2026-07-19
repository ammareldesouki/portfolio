"use client";

import { useState } from "react";
import type { Skill } from "@/lib/api/settings";
import { IconPicker } from "@/components/admin/IconPicker";

interface Group {
  category: string;
  items: Skill[];
}

/** Group flat skills by category, preserving first-appearance order. */
function toGroups(skills: Skill[]): Group[] {
  const order: string[] = [];
  const map = new Map<string, Skill[]>();
  for (const skill of skills) {
    const cat = skill.category?.trim() || "Uncategorized";
    if (!map.has(cat)) {
      map.set(cat, []);
      order.push(cat);
    }
    map.get(cat)!.push(skill);
  }
  return order.map((category) => ({ category, items: map.get(category)! }));
}

/** Flatten groups back to a flat array, stamping each skill's category. */
function flatten(groups: Group[]): Skill[] {
  return groups.flatMap((g) =>
    g.items.map((s) => ({ ...s, category: g.category }))
  );
}

const iconBtn =
  "flex items-center justify-center w-7 h-7 rounded-md text-on-surface-variant hover:text-on-surface hover:bg-white/5 transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed";

export function SkillsEditor({
  skills,
  onChange,
}: {
  skills: Skill[];
  onChange: (skills: Skill[]) => void;
}) {
  const groups = toGroups(skills);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const commit = (next: Group[]) => onChange(flatten(next));

  function updateSkill(ci: number, pi: number, patch: Partial<Skill>) {
    const next = toGroups(skills);
    next[ci].items[pi] = { ...next[ci].items[pi], ...patch };
    commit(next);
  }

  function addSkill(ci: number) {
    const next = toGroups(skills);
    next[ci].items.push({ name: "", category: next[ci].category, icon: "" });
    commit(next);
  }

  function removeSkill(ci: number, pi: number) {
    const next = toGroups(skills);
    next[ci].items.splice(pi, 1);
    commit(next);
  }

  function moveSkill(ci: number, pi: number, dir: -1 | 1) {
    const next = toGroups(skills);
    const items = next[ci].items;
    const t = pi + dir;
    if (t < 0 || t >= items.length) return;
    [items[pi], items[t]] = [items[t], items[pi]];
    commit(next);
  }

  function moveCategory(ci: number, dir: -1 | 1) {
    const next = toGroups(skills);
    const t = ci + dir;
    if (t < 0 || t >= next.length) return;
    [next[ci], next[t]] = [next[t], next[ci]];
    commit(next);
  }

  function renameCategory(ci: number, name: string) {
    const next = toGroups(skills);
    next[ci].category = name;
    commit(next);
  }

  function removeCategory(ci: number) {
    const next = toGroups(skills);
    if (
      next[ci].items.some((s) => s.name) &&
      !confirm(`Delete category "${next[ci].category}" and its skills?`)
    ) {
      return;
    }
    next.splice(ci, 1);
    commit(next);
  }

  function addCategory() {
    const base = "New Category";
    let name = base;
    let n = 2;
    const existing = new Set(groups.map((g) => g.category));
    while (existing.has(name)) name = `${base} ${n++}`;
    onChange([...skills, { name: "", category: name, icon: "" }]);
  }

  return (
    <div className="space-y-4">
      {groups.length === 0 && (
        <div className="bg-[#0F131A] border border-dashed border-white/10 rounded-xl p-10 text-center">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant/60">
            category
          </span>
          <p className="text-on-surface-variant text-sm mt-3">
            No skills yet. Create a category to get started.
          </p>
        </div>
      )}

      {groups.map((group, ci) => {
        const isCollapsed = collapsed[group.category];
        return (
          <div
            key={ci}
            className="bg-[#0F131A] border border-white/10 rounded-xl overflow-hidden"
          >
            {/* Category header */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
              <button
                type="button"
                onClick={() =>
                  setCollapsed((c) => ({ ...c, [group.category]: !c[group.category] }))
                }
                className={iconBtn}
                aria-label={isCollapsed ? "Expand" : "Collapse"}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {isCollapsed ? "chevron_right" : "expand_more"}
                </span>
              </button>

              <input
                value={group.category}
                onChange={(e) => renameCategory(ci, e.target.value)}
                className="flex-1 bg-transparent font-body-base text-body-base font-semibold text-on-surface outline-none focus:bg-[#1E242D] rounded px-2 py-1 transition-colors"
                placeholder="Category name"
              />

              <span className="font-code-sm text-[11px] text-on-surface-variant bg-[#1E242D] px-2 py-0.5 rounded-full">
                {group.items.length}
              </span>

              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => moveCategory(ci, -1)}
                  disabled={ci === 0}
                  className={iconBtn}
                  aria-label="Move category up"
                >
                  <span className="material-symbols-outlined text-[18px]">keyboard_arrow_up</span>
                </button>
                <button
                  type="button"
                  onClick={() => moveCategory(ci, 1)}
                  disabled={ci === groups.length - 1}
                  className={iconBtn}
                  aria-label="Move category down"
                >
                  <span className="material-symbols-outlined text-[18px]">keyboard_arrow_down</span>
                </button>
                <button
                  type="button"
                  onClick={() => removeCategory(ci)}
                  className="flex items-center justify-center w-7 h-7 rounded-md text-on-surface-variant hover:text-error hover:bg-error/10 transition-colors"
                  aria-label="Delete category"
                >
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                </button>
              </div>
            </div>

            {/* Skills in category */}
            {!isCollapsed && (
              <div className="p-3 space-y-2">
                {group.items.map((skill, pi) => (
                  <div
                    key={pi}
                    className="flex items-center gap-2 bg-[#151A22] border border-white/5 rounded-lg p-2"
                  >
                    <div className="flex flex-col">
                      <button
                        type="button"
                        onClick={() => moveSkill(ci, pi, -1)}
                        disabled={pi === 0}
                        className={iconBtn + " !h-5"}
                        aria-label="Move skill up"
                      >
                        <span className="material-symbols-outlined text-[16px]">keyboard_arrow_up</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => moveSkill(ci, pi, 1)}
                        disabled={pi === group.items.length - 1}
                        className={iconBtn + " !h-5"}
                        aria-label="Move skill down"
                      >
                        <span className="material-symbols-outlined text-[16px]">keyboard_arrow_down</span>
                      </button>
                    </div>

                    <IconPicker
                      value={skill.icon}
                      onChange={(icon) => updateSkill(ci, pi, { icon })}
                    />

                    <input
                      value={skill.name}
                      onChange={(e) => updateSkill(ci, pi, { name: e.target.value })}
                      placeholder="Skill name (e.g. Flutter)"
                      className="flex-1 bg-[#1E242D] border border-white/10 rounded-lg px-3 h-9 font-code-sm text-code-sm text-on-surface outline-none focus:border-primary/50"
                    />

                    <button
                      type="button"
                      onClick={() => removeSkill(ci, pi)}
                      className="flex items-center justify-center w-8 h-8 rounded-md text-on-surface-variant hover:text-error hover:bg-error/10 transition-colors flex-shrink-0"
                      aria-label="Remove skill"
                    >
                      <span className="material-symbols-outlined text-[18px]">close</span>
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => addSkill(ci)}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-dashed border-white/10 text-on-surface-variant hover:text-primary hover:border-primary/50 transition-colors font-code-sm text-code-sm"
                >
                  <span className="material-symbols-outlined text-[16px]">add</span>
                  Add skill
                </button>
              </div>
            )}
          </div>
        );
      })}

      <button
        type="button"
        onClick={addCategory}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-white/10 text-on-surface hover:border-primary/50 hover:text-primary transition-colors font-code-sm text-code-sm"
      >
        <span className="material-symbols-outlined text-[18px]">create_new_folder</span>
        Add category
      </button>
    </div>
  );
}
