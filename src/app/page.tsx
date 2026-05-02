import HeroSection from "@/components/sections/HeroSection";
import StatsSection from "@/components/sections/StatsSection";
import FeaturedProjects from "@/components/sections/FeaturedProjects";
import NpmPackageSection from "@/components/sections/NpmPackageSection";
import SkillsPreview from "@/components/sections/SkillsPreview";
import ResearchSection from "@/components/sections/ResearchSection";
import TimesSquareSection from "@/components/sections/TimesSquareSection";
import InlineMiniGame from "@/components/sections/InlineMiniGame";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <FeaturedProjects />
      <NpmPackageSection />
      <SkillsPreview />
      <ResearchSection />
      <TimesSquareSection />
      <InlineMiniGame />
    </>
  );
}
