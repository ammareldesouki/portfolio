/**
 * Seeds the settings document with a starter skill set (with logo images from
 * the devicon CDN) so the Skills section renders. These are DEMO defaults for a
 * Flutter developer — edit them in the admin CMS, or replace the array below
 * with your real CV skills and re-run.
 *
 * Local:      npx tsx seed-content.ts
 * Production: MONGODB_URI="<your prod uri>" npx tsx seed-content.ts
 */
import mongoose from "mongoose";

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/portfolio-cms";

const devicon = (slug: string, variant = "original") =>
  `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${slug}/${slug}-${variant}.svg`;

const skills = [
  // Languages
  { name: "Dart", category: "Languages", icon: devicon("dart") },
  { name: "JavaScript", category: "Languages", icon: devicon("javascript") },
  { name: "TypeScript", category: "Languages", icon: devicon("typescript") },
  { name: "Python", category: "Languages", icon: devicon("python") },
  // Mobile & Frameworks
  { name: "Flutter", category: "Mobile & Frameworks", icon: devicon("flutter") },
  { name: "Android", category: "Mobile & Frameworks", icon: devicon("android") },
  // Backend & Cloud
  { name: "Firebase", category: "Backend & Cloud", icon: devicon("firebase", "plain") },
  { name: "Node.js", category: "Backend & Cloud", icon: devicon("nodejs") },
  { name: "MongoDB", category: "Backend & Cloud", icon: devicon("mongodb") },
  // Tools
  { name: "Git", category: "Tools", icon: devicon("git") },
  { name: "Figma", category: "Tools", icon: devicon("figma") },
  { name: "VS Code", category: "Tools", icon: devicon("vscode") },
];

const education = [
  {
    institution: "Helwan University",
    degree: "Bachelor's Degree",
    field: "Computer Science",
    startDate: "2022",
    endDate: "2026",
    current: false,
    description: "",
  },
];

const certifications = [
  {
    name: "Flutter Developer",
    issuer: "Route",
    date: "Aug 2025",
    url: "",
    description:
      "Completed a foundational Flutter & Dart course covering widget architecture, state management basics, navigation, and building responsive cross-platform UIs — the starting point before moving into production apps like CVScout.",
  },
  {
    name: "Full Stack Web Development Using PHP",
    issuer: "Information Technology Institute (ITI)",
    date: "Jan 2025",
    url: "",
    description:
      "60-hour intensive course covering MySQL database design, PHP fundamentals, and the Laravel framework for building full-stack web applications. Hands-on experience with server-side logic, database integration, and MVC architecture principles.",
  },
  {
    name: "Flutter Developer",
    issuer: "Sprints",
    date: "Aug 2025",
    url: "",
    description:
      "Foundational Flutter & Dart course — widgets, state management, navigation, and responsive UI fundamentals.",
  },
];

async function run() {
  await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 8000 });
  const db = mongoose.connection.db;
  if (!db) throw new Error("No database connection");

  const settings = db.collection("settings");
  const existing = await settings.findOne({});

  if (!existing) {
    console.error(
      "No settings document found. Create your settings in the admin panel first, then re-run."
    );
    process.exit(1);
  }

  await settings.updateOne(
    { _id: existing._id },
    {
      $set: {
        skills,
        education,
        certifications,
        showSkills: true,
        showEducation: true,
        showCertifications: true,
        updatedAt: new Date(),
      },
    }
  );

  console.log(
    `Seeded ${skills.length} skills, ${education.length} education, ${certifications.length} certifications into settings (${MONGODB_URI.split("@").pop()}).`
  );
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
