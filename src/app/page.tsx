import dynamic from "next/dynamic";
import HeroSection from "@/components/sections/HeroSection";
import StatsSection from "@/components/sections/StatsSection";
import FeaturedProjects from "@/components/sections/FeaturedProjects";

// Below-the-fold — lazy loaded to keep initial JS bundle small
const NpmPackageSection = dynamic(() => import("@/components/sections/NpmPackageSection"), { ssr: false });
const SkillsPreview      = dynamic(() => import("@/components/sections/SkillsPreview"));
const ResearchSection    = dynamic(() => import("@/components/sections/ResearchSection"));
const TimesSquareSection = dynamic(() => import("@/components/sections/TimesSquareSection"), { ssr: false });
const InlineMiniGame     = dynamic(() => import("@/components/sections/InlineMiniGame"),     { ssr: false });

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
