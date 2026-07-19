/**
 * Curated catalog of technology logos (devicon CDN) for the Skills icon picker.
 * The stored value is the full SVG URL — the same shape SkillCard already
 * renders as an <img> (with a graceful fallback if a URL ever fails).
 */
export interface IconOption {
  /** Display + search label */
  name: string;
  /** devicon slug */
  slug: string;
  /** devicon variant suffix (original | plain | line ...) */
  variant?: string;
  /** extra search terms */
  aliases?: string[];
}

export function deviconUrl(slug: string, variant = "original") {
  return `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${slug}/${slug}-${variant}.svg`;
}

export function iconOptionUrl(opt: IconOption) {
  return deviconUrl(opt.slug, opt.variant);
}

export const ICON_CATALOG: IconOption[] = [
  // Mobile
  { name: "Flutter", slug: "flutter" },
  { name: "Dart", slug: "dart" },
  { name: "Android", slug: "android" },
  { name: "Kotlin", slug: "kotlin" },
  { name: "Swift", slug: "swift" },
  { name: "React Native", slug: "react", aliases: ["mobile", "expo"] },
  // Languages
  { name: "JavaScript", slug: "javascript", aliases: ["js"] },
  { name: "TypeScript", slug: "typescript", aliases: ["ts"] },
  { name: "Python", slug: "python" },
  { name: "Java", slug: "java" },
  { name: "C#", slug: "csharp", aliases: ["c sharp", "dotnet"] },
  { name: "C++", slug: "cplusplus", aliases: ["cpp"] },
  { name: "C", slug: "c" },
  { name: "Go", slug: "go", aliases: ["golang"] },
  { name: "Rust", slug: "rust" },
  { name: "Ruby", slug: "ruby" },
  { name: "PHP", slug: "php" },
  { name: "HTML5", slug: "html5", aliases: ["html"] },
  { name: "CSS3", slug: "css3", aliases: ["css"] },
  { name: "SQL", slug: "mysql", aliases: ["sql"] },
  // Web frameworks
  { name: "React", slug: "react" },
  { name: "Next.js", slug: "nextjs", aliases: ["next"] },
  { name: "Vue.js", slug: "vuejs", aliases: ["vue"] },
  { name: "Angular", slug: "angularjs", aliases: ["angular"] },
  { name: "Svelte", slug: "svelte" },
  { name: "Node.js", slug: "nodejs", aliases: ["node"] },
  { name: "Express", slug: "express", variant: "original", aliases: ["expressjs"] },
  { name: "Laravel", slug: "laravel" },
  { name: "Django", slug: "django", variant: "plain" },
  { name: "Flask", slug: "flask" },
  { name: "Spring", slug: "spring" },
  { name: "Tailwind CSS", slug: "tailwindcss", aliases: ["tailwind"] },
  { name: "Bootstrap", slug: "bootstrap" },
  { name: "Sass", slug: "sass" },
  { name: "Redux", slug: "redux" },
  { name: "GraphQL", slug: "graphql", variant: "plain" },
  // Backend / cloud / data
  { name: "Firebase", slug: "firebase", variant: "plain" },
  { name: "MongoDB", slug: "mongodb" },
  { name: "PostgreSQL", slug: "postgresql", aliases: ["postgres"] },
  { name: "MySQL", slug: "mysql" },
  { name: "Redis", slug: "redis" },
  { name: "Supabase", slug: "supabase" },
  { name: "Docker", slug: "docker" },
  { name: "Kubernetes", slug: "kubernetes", aliases: ["k8s"] },
  { name: "AWS", slug: "amazonwebservices", variant: "original-wordmark", aliases: ["amazon"] },
  { name: "Google Cloud", slug: "googlecloud", aliases: ["gcp"] },
  { name: "Azure", slug: "azure", aliases: ["microsoft azure"] },
  { name: "Linux", slug: "linux" },
  { name: "Nginx", slug: "nginx" },
  // Tools
  { name: "Git", slug: "git" },
  { name: "GitHub", slug: "github", aliases: ["gh"] },
  { name: "GitLab", slug: "gitlab" },
  { name: "Figma", slug: "figma" },
  { name: "VS Code", slug: "vscode", aliases: ["visual studio code"] },
  { name: "Android Studio", slug: "androidstudio" },
  { name: "IntelliJ", slug: "intellij", aliases: ["idea"] },
  { name: "Postman", slug: "postman" },
  { name: "Jira", slug: "jira" },
  { name: "Notion", slug: "notion" },
  { name: "Vercel", slug: "vercel" },
  { name: "npm", slug: "npm" },
];

export function searchIcons(query: string, limit = 24): IconOption[] {
  const q = query.trim().toLowerCase();
  if (!q) return ICON_CATALOG.slice(0, limit);
  return ICON_CATALOG.filter((opt) => {
    const haystack = [opt.name, opt.slug, ...(opt.aliases || [])]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  }).slice(0, limit);
}
