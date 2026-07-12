"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import HeroSection from "@/components/sections/HeroSection";
import BentoSection from "@/components/sections/BentoSection";
import FeaturedProjects from "@/components/sections/FeaturedProjects";
import HomeFlow from "@/components/sections/HomeFlow";
import Marquee from "@/components/ui/Marquee";
import { Flow } from "@/components/ui/FlowStack";
import SkillGraph from "@/components/sections/SkillGraph";
import EditorialHome from "@/components/sections/EditorialHome";
import OnyxHome from "@/components/sections/OnyxHome";
// import GitHubCity from "@/components/sections/GitHubCity"; // "26 weeks of shipping" — temporarily disabled

// Below-the-fold — lazy loaded to keep initial JS bundle small
const NpmPackageSection  = dynamic(() => import("@/components/sections/NpmPackageSection"), { ssr: false });
const SkillsPreview      = dynamic(() => import("@/components/sections/SkillsPreview"));
const ResearchSection    = dynamic(() => import("@/components/sections/ResearchSection"));
const TimesSquareSection = dynamic(() => import("@/components/sections/TimesSquareSection"), { ssr: false });
const InlineMiniGame     = dynamic(() => import("@/components/sections/InlineMiniGame"),     { ssr: false });

function ClassicHome() {
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
          city:     null, // <Flow><GitHubCity /></Flow> — "26 weeks of shipping" temporarily disabled
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

/**
 * Swaps the entire homepage when the Swiss Editorial atmosphere is
 * active. The classic tree still server-renders its HTML (client
 * components SSR by default), so SEO is unchanged; the editorial
 * redesign mounts only while html.swiss is set.
 */
export default function ThemeHomeGate() {
  const [mode, setMode] = useState<"classic" | "swiss" | "onyx">("classic");

  useEffect(() => {
    const root = document.documentElement;
    const check = () =>
      setMode(root.classList.contains("swiss") ? "swiss" : root.classList.contains("onyx") ? "onyx" : "classic");
    check();
    const mo = new MutationObserver(check);
    mo.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => mo.disconnect();
  }, []);

  if (mode === "swiss") return <EditorialHome />;
  if (mode === "onyx") return <OnyxHome />;
  return <ClassicHome />;
}
