import { HeroSection } from "@/components/public/HeroSection";
import { AboutPreview } from "@/components/public/AboutPreview";
import { SkillsSection } from "@/components/public/SkillsSection";
import { CredentialsSection } from "@/components/public/CredentialsSection";
import { FeaturedProjects } from "@/components/public/FeaturedProjects";

export default function Home() {
  return (
    <>
      <HeroSection />
      <AboutPreview />
      <SkillsSection />
      <CredentialsSection />
      <FeaturedProjects />
    </>
  );
}
