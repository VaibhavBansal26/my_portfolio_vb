import { projects } from "@/data/portfolio";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ProjectCaseStudy from "@/components/sections/ProjectCaseStudy";

export async function generateStaticParams() {
  return projects.map(p => ({ id: p.id }));
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const project = projects.find(p => p.id === params.id);
  if (!project) return {};
  return {
    title: `${project.title} — Case Study`,
    description: project.description,
    keywords: [...project.tech, project.category, "case study", "Vaibhav Bansal"],
    alternates: { canonical: `https://www.thevaibhavbansal.com/projects/${project.id}` },
    openGraph: {
      title: `${project.title} | Vaibhav Bansal`,
      description: project.description,
      url: `https://www.thevaibhavbansal.com/projects/${project.id}`,
    },
  };
}

export default function ProjectPage({ params }: { params: { id: string } }) {
  const project = projects.find(p => p.id === params.id);
  if (!project) notFound();
  return <ProjectCaseStudy project={project}/>;
}
