import type { Metadata } from "next";
import ContactSection from "@/components/sections/ContactSection";

export const metadata: Metadata = {
  title: "Contact — Hire AI Engineer",
  description:
    "Hire Vaibhav Bansal — Senior AI Engineer available in the United States. Open to full-time, contract, freelance, and remote roles. Specializes in LLMs, RAG, LangChain, Python, React, AWS. Contact now.",
  keywords: [
    "hire AI engineer", "hire AI engineer United States", "hire LangChain developer",
    "hire RAG engineer", "hire LLM developer", "hire machine learning engineer US",
    "hire full stack developer United States", "senior AI engineer available",
    "AI engineer open to work", "contact Vaibhav Bansal",
  ],
  alternates: { canonical: "https://www.thevaibhavbansal.com/contact" },
  openGraph: {
    title: "Hire Vaibhav Bansal | Senior AI Engineer — United States",
    description: "Available for full-time, contract & remote roles. AI Engineer · LLMs · RAG · Python · React · AWS. Contact now.",
    url: "https://www.thevaibhavbansal.com/contact",
  },
};

export default function ContactPage() {
  return (
    <main className="pt-32 pb-24 max-w-6xl mx-auto px-6">
      <ContactSection />
    </main>
  );
}
