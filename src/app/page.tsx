import dynamic from "next/dynamic";
import HeroSection from "@/components/sections/HeroSection";
import BentoSection from "@/components/sections/BentoSection";
import FeaturedProjects from "@/components/sections/FeaturedProjects";
import HomeFlow from "@/components/sections/HomeFlow";
import Marquee from "@/components/ui/Marquee";
import { Flow } from "@/components/ui/FlowStack";
import SkillGraph from "@/components/sections/SkillGraph";
import GitHubCity from "@/components/sections/GitHubCity";

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
      <Marquee />
      {/* FRIDAY adaptive ordering — visual order follows the visitor persona */}
      <HomeFlow
        slots={{
          bento:    <Flow><BentoSection /></Flow>,
          projects: <FeaturedProjects />, /* pins its own scroll scene — no transform wrapper */
          graph:    <Flow><SkillGraph /></Flow>,
          city:     <Flow><GitHubCity /></Flow>,
          npm:      <Flow><NpmPackageSection /></Flow>,
          skills:   <Flow><SkillsPreview /></Flow>,
          research: <Flow><ResearchSection /></Flow>,
          times:    <Flow><TimesSquareSection /></Flow>,
          game:     <Flow><InlineMiniGame /></Flow>,
        }}
      />
    </>
  );
}
