import type { Skill } from "@/lib/api/settings";

/**
 * Groups skills by their category (trimmed). Skills with no category fall
 * under "Other". Category order follows first appearance in the list.
 */
export function groupSkillsByCategory(skills: Skill[]): Record<string, Skill[]> {
  const grouped: Record<string, Skill[]> = {};
  for (const skill of skills) {
    const category = skill.category?.trim() || "Other";
    (grouped[category] ||= []).push(skill);
  }
  return grouped;
}
