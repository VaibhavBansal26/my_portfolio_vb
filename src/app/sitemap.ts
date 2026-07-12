import { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";
import { projects } from "@/data/portfolio";

const BASE = "https://www.thevaibhavbansal.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE,                  lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${BASE}/about`,       lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/portfolio`,   lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${BASE}/blog`,        lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
    { url: `${BASE}/resume`,      lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/contact`,     lastModified: now, changeFrequency: "yearly",  priority: 0.7 },
    { url: `${BASE}/showcase`,    lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/terminal`,    lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];

  // Every project case study — these are indexable content pages
  const projectPages: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${BASE}/projects/${project.id}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Dynamically include every published blog post
  const posts = getAllPosts();
  const blogPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${BASE}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...projectPages, ...blogPages];
}
