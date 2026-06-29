import { HeroSection } from "@/components/public/HeroSection";
import { SkillsSection } from "@/components/public/SkillsSection";
import { FeaturedProjects } from "@/components/public/FeaturedProjects";

export default function Home() {
  return (
    <>
      <HeroSection />
      <SkillsSection />
      <FeaturedProjects />
    </>
  );
}
