import type { Metadata } from "next";
import Link from "next/link";
import ScrollExpandMedia from "@/components/ui/scroll-expansion-hero";

export const metadata: Metadata = {
  title: "Showcase — Immersive Portfolio Experience",
  description:
    "An immersive, scroll-driven showcase of Vaibhav Bansal's work — AI engineering, full-stack systems, and production ML pipelines.",
  alternates: { canonical: "https://www.thevaibhavbansal.com/showcase" },
};

export default function ShowcasePage() {
  return (
    <div className="min-h-screen">
      <ScrollExpandMedia
        mediaType="image"
        mediaSrc="/themes/arcane.png"
        bgImageSrc="/themes/kingdoms.png"
        title="Building Intelligent Systems"
        date="Vaibhav Bansal"
        scrollToExpand="Scroll to expand"
        textBlend
      >
        <div className="max-w-4xl mx-auto">
          <h2
            className="text-3xl font-bold mb-6"
            style={{ color: "var(--text)", fontFamily: "var(--font-display)" }}
          >
            The Work Behind the Curtain
          </h2>
          <p className="text-lg mb-8" style={{ color: "var(--text-muted)" }}>
            5+ years shipping production AI and full-stack systems — RAG
            pipelines, LLM applications, real-time data platforms, and cloud
            infrastructure. From research at SUNY Buffalo to products used in
            the real world.
          </p>
          <p className="text-lg mb-8" style={{ color: "var(--text-muted)" }}>
            Explore the full portfolio of 50+ projects spanning AI engineering,
            data engineering, DevSecOps, and modern web development.
          </p>
          <Link
            href="/portfolio"
            className="inline-block px-6 py-3 font-medium rounded-lg border transition-colors"
            style={{
              color: "var(--accent)",
              borderColor: "var(--border-bright)",
            }}
          >
            View all projects →
          </Link>
        </div>
      </ScrollExpandMedia>
    </div>
  );
}
