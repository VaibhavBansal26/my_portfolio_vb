import type { Metadata } from "next";
import AboutHero from "@/components/sections/AboutHero";
import PhotoStack from "@/components/sections/PhotoStack";
import ExperienceSection from "@/components/sections/ExperienceSection";
import SubwayMap from "@/components/sections/SubwayMap";
import EducationSection from "@/components/sections/EducationSection";
import FullSkillsSection from "@/components/sections/FullSkillsSection";
import CertFlipCards from "@/components/ui/CertFlipCards";
import ResearchSection from "@/components/sections/ResearchSection";
import LeetCodeStats from "@/components/sections/LeetCodeStats";
// import GitHubStats from "@/components/sections/GitHubStats"; // TODO: set up GitHub token first

export const metadata: Metadata = {
  title: "About — AI Engineer & Software Developer",
  description:
    "Vaibhav Bansal is a top AI Engineer in the United States with 5+ years of experience. M.S. Data Science, SUNY Buffalo. Specializes in LangChain, RAG, LLMs, Python, React, and AWS. Previously at Wipro and DashClicks. Open to opportunities across the US.",
  keywords: [
    "Vaibhav Bansal AI engineer", "AI engineer United States", "software engineer background",
    "LangChain engineer", "RAG developer", "LLM specialist", "machine learning engineer US",
    "full stack AI developer", "hire AI engineer", "senior software engineer", "Software developer with AI expertise", "AI consultant US", "data science background", "M.S. Data Science", "ex-Wipro AI engineer", "ex-DashClicks AI developer", "AI research assistant",
    "python developer", "react developer", "node.js developer", "typescript developer", "aws developer", "azure developer",
    "hire AI engineer", "hire AI engineer United States", "hire LangChain developer",
    "hire RAG engineer", "hire LLM developer", "hire machine learning engineer US",
    "hire full stack developer United States", "hire Python developer",
    "hire React developer", "hire Node.js developer", "hire TypeScript developer",
  ],
  openGraph: {
    title: "About Vaibhav Bansal | AI Engineer — United States",
    description: "5+ years building AI systems. M.S. Data Science. Ex-Wipro · Ex-DashClicks · Research Assistant. Available across the US.",
    url: "https://www.vaibhavbansal.in/about",
  },
};

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <PhotoStack />
      <SubwayMap />
      <ExperienceSection />
      <EducationSection />
      <FullSkillsSection />
      <CertFlipCards />
      <ResearchSection />
      <LeetCodeStats />
      {/* <GitHubStats /> */}
    </>
  );
}
