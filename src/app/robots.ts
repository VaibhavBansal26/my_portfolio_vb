import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/"],
      },
      {
        // Allow AI crawlers for better LLM indexing
        userAgent: ["GPTBot", "ChatGPT-User", "Google-Extended", "PerplexityBot"],
        allow: "/",
      },
    ],
    sitemap: "https://www.thevaibhavbansal.com/sitemap.xml",
    host: "https://www.thevaibhavbansal.com",
  };
}
