import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "next-themes";
import "../styles/globals.css";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import CustomCursor from "@/components/ui/CustomCursor";
import Chatbot from "@/components/ui/Chatbot";
import PageTransition from "@/components/ui/PageTransition";
import EasterEgg from "@/components/ui/EasterEgg";
import PatronusEgg from "@/components/ui/PatronusEgg";
import AccioEgg from "@/components/ui/AccioEgg";
import BootLoader from "@/components/ui/BootLoader";
import ScrollProgress from "@/components/ui/ScrollProgress";
import SmoothScroll from "@/components/ui/SmoothScroll";
import { BackgroundJourney, Grain } from "@/components/ui/FlowStack";
import PersonaPicker from "@/components/ui/PersonaPicker";
import CommandPalette from "@/components/ui/CommandPalette";
import UITicks from "@/components/ui/UITicks";
import FridayTour from "@/components/ui/FridayTour";
import SimulationMode from "@/components/ui/SimulationMode";
import ProactiveFriday from "@/components/ui/ProactiveFriday";
import { ViewTransitions } from "next-view-transitions";
import AmbientSound from "@/components/ui/AmbientSound";
import ThemeSwitcher from "@/components/ui/ThemeSwitcher";
import { Analytics } from "@vercel/analytics/react";
import AnalyticsProvider from "@/components/ui/AnalyticsProvider";
import { SpeedInsights } from "@vercel/speed-insights/next";

const BASE_URL = "https://www.thevaibhavbansal.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  title: {
    default: "Vaibhav Bansal | AI Engineer · Software Engineer · Full Stack Developer | United States",
    template: "%s | Vaibhav Bansal",
  },

  description:
    "Vaibhav Bansal — AI Engineer, Software Engineer & Full Stack Developer in the United States. 5+ years building production systems. Python · React · Node.js · LangChain · AWS. Open to roles across the US.",

  keywords: [
    // ── Name (brand) ───────────────────────────────────────────────
    "Vaibhav Bansal",
    "vaibhav bansal ai engineer",
    "vaibhav bansal software engineer",
    "vaibhav bansal software developer",
    "vaibhav bansal backend developer",
    "vaibhav bansal frontend developer",
    "vaibhav bansal portfolio",
    "vaibhav bansal developer",
    "best software developer",
    "best full stack developer",
    "java developer",
    "python developer",
    "react developer",
    "node.js developer",
    "typescript developer",
    "aws developer",
    "azure developer",
    "ai engineer",

    // ── Hire-intent — AI / ML ──────────────────────────────────────
    "hire AI engineer United States",
    "hire AI engineer US",
    "best AI engineer United States",
    "top AI engineer US",
    "AI engineer for hire",
    "senior AI engineer",
    "hire machine learning engineer",
    "hire LLM engineer",
    "hire RAG engineer",
    "hire LangChain developer",
    "hire full stack AI developer",
    "AI software engineer available",
    "best AI software developer",
    "best LLM developer",
    "experienced AI engineer for hire",

    // ── Hire-intent — Software Engineering ────────────────────────
    "hire software engineer United States",
    "hire software developer US",
    "hire backend developer United States",
    "hire frontend developer United States",
    "hire full stack developer United States",
    "hire Python developer",
    "hire React developer",
    "hire Node.js developer",
    "hire TypeScript developer",
    "senior software engineer for hire",
    "software engineer available United States",
    "backend developer for hire US",
    "frontend developer for hire US",

    // ── Role + US ──────────────────────────────────────────────────
    "AI Engineer United States",
    "software engineer United States",
    "software developer United States",
    "backend developer United States",
    "frontend developer United States",
    "full stack developer United States",
    "Python developer United States",
    "React developer United States",
    "Node.js developer United States",
    "TypeScript developer United States",
    "remote software engineer",
    "remote backend developer",
    "remote frontend developer",
    "remote AI engineer",
    "open to work software engineer",
    "open to work AI engineer",

    // ── Tech-stack hire searches ───────────────────────────────────
    "LangChain developer",
    "RAG pipeline engineer",
    "LLM application developer",
    "generative AI developer",
    "AI chatbot developer",
    "MLOps engineer",
    "deep learning engineer",
    "NLP engineer",
    "OpenAI developer",
    "vector database engineer",
    "AWS engineer",
    "FastAPI developer",
    "Django developer",
    "Next.js developer",
    "React developer",
    "TypeScript engineer",
    "Apache Spark engineer",
    "Kafka developer",
    "Docker developer",
    "Kubernetes engineer",

    // ── Data & Analytics ──────────────────────────────────────────
    "data engineer",
    "data engineer United States",
    "hire data engineer",
    "data engineer for hire US",
    "data pipeline engineer",
    "ETL developer",
    "Apache Spark engineer",
    "Apache Airflow developer",
    "Kafka developer",
    "Snowflake developer",
    "Azure data engineer",
    "AWS data engineer",
    "dbt developer",
    "data warehouse engineer",
    "stream processing engineer",
    "real-time data engineer",

    // ── Languages ─────────────────────────────────────────────────
    "Java developer",
    "Java developer United States",
    "Spring Boot developer",
    "hire Java developer",
    "Python engineer",
    "Python developer United States",
    "hire Python engineer",

    // ── Frontend & UI ─────────────────────────────────────────────
    "React developer",
    "Next.js engineer",
    "frontend engineer",
    "frontend developer engineer",
    "FDE engineer",
    "UI engineer",
    "GraphQL developer",
    "GraphQL engineer",
    "REST API developer",

    // ── Methodology & soft skills ─────────────────────────────────
    "Agile developer",
    "Agile software engineer",
    "Scrum engineer",
    "CI/CD engineer",
    "DevOps engineer",
    "DevSecOps engineer",
    "microservices engineer",
    "distributed systems engineer",
    "system design engineer",
    "cloud engineer",
    "cloud developer United States",

    // ── AI tooling ────────────────────────────────────────────────
    "prompt engineer",
    "LLM fine-tuning engineer",
    "Hugging Face developer",
    "OpenAI API developer",
    "AI application developer",
    "conversational AI developer",
    "agentic AI developer",

    // ── Portfolio / discovery ──────────────────────────────────────
    "best AI engineer portfolio",
    "best software engineer portfolio",
    "top developer portfolio United States",
    "software developer portfolio",
    "full stack developer portfolio",
    "backend developer portfolio",
    "frontend developer portfolio",
    "data engineer portfolio",
  ],

  authors: [{ name: "Vaibhav Bansal", url: BASE_URL }],
  creator: "Vaibhav Bansal",
  publisher: "Vaibhav Bansal",

  alternates: { canonical: BASE_URL },

  openGraph: {
    type: "profile",
    url: BASE_URL,
    siteName: "Vaibhav Bansal | AI Engineer",
    title: "Vaibhav Bansal | Top AI Engineer in the United States",
    description:
      "AI Engineer & Full-Stack Developer available in the United States. 5+ years shipping production AI — LangChain · RAG · LLMs · Python · React · AWS. Open to full-time, remote & relocation.",
    images: [
      {
        url: "/avatar.jpg",
        width: 800,
        height: 800,
        alt: "Vaibhav Bansal — AI Engineer & Software Developer",
        type: "image/jpeg",
      },
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Vaibhav Bansal — AI Engineer & Software Developer, United States",
        type: "image/png",
      },
    ],
    locale: "en_US",
    firstName: "Vaibhav",
    lastName: "Bansal",
    username: "vaibhavbansal26",
  },

  twitter: {
    card: "summary_large_image",
    site: "@Vaibhavbansal26",
    creator: "@Vaibhavbansal26",
    title: "Vaibhav Bansal | Top AI Engineer in the United States",
    description:
      "AI Engineer available in the US. LangChain · RAG · LLMs · Python · React · AWS. 5+ years. Open to opportunities.",
    images: ["/avatar.jpg", "/og-image.png"],
  },

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Google Search Console: after registering at search.google.com/search-console,
  // add your code here:  verification: { google: "<your-code>" }

  manifest: "/manifest.json",

  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/icon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },

  applicationName: "Vaibhav Bansal Portfolio",
  category: "technology",
  referrer: "origin-when-cross-origin",
};

// Next 14 requires themeColor/colorScheme in the viewport export, not metadata
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "dark light",
  themeColor: [
    { media: "(prefers-color-scheme: dark)",  color: "#0e0e0e" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransitions>
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "Person",
                name: "Vaibhav Bansal",
                url: BASE_URL,
                image: {
                  "@type": "ImageObject",
                  url: `${BASE_URL}/avatar.jpg`,
                  width: 800,
                  height: 800,
                  caption: "Vaibhav Bansal — AI Engineer & Software Developer",
                },
                sameAs: [
                  "https://github.com/VaibhavBansal26",
                  "https://www.linkedin.com/in/vaibhavbansal-profile",
                  "https://leetcode.com/vaibhav_bansal26",
                  "https://orcid.org/0000-0002-5433-0385",
                  "https://www.youtube.com/@VaibhavBansalCode",
                ],
                jobTitle: "AI Engineer",
                description: "AI Engineer and Software Developer with 5+ years of experience in the United States. Specializes in LangChain, RAG, LLMs, Python, React, and AWS.",
                worksFor: {
                  "@type": "Organization",
                  name: "Open to Opportunities — United States",
                },
                alumniOf: [
                  {
                    "@type": "CollegeOrUniversity",
                    name: "University at Buffalo, SUNY",
                    sameAs: "https://www.buffalo.edu",
                  },
                  { "@type": "CollegeOrUniversity", name: "VIT University" },
                ],
                knowsAbout: [
                  "Artificial Intelligence",
                  "Machine Learning",
                  "Deep Learning",
                  "Natural Language Processing",
                  "Large Language Models",
                  "LangChain",
                  "Retrieval-Augmented Generation",
                  "Generative AI",
                  "Python",
                  "React",
                  "Next.js",
                  "TypeScript",
                  "AWS",
                  "Docker",
                  "FastAPI",
                  "Apache Spark",
                  "Kafka",
                  "PostgreSQL",
                  "MLOps",
                  "Vector Databases",
                ],
                address: {
                  "@type": "PostalAddress",
                  addressCountry: "US",
                  addressRegion: "United States",
                },
                nationality: "Indian",
                email: "vaibhav.bansal945@gmail.com",
                // Offer — makes you appear in "hire" searches
                makesOffer: {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "AI Engineering & Software Development",
                    description: "Full-stack AI application development, LLM integration, RAG pipelines, MLOps, and software engineering services.",
                    areaServed: "United States",
                  },
                },
              },
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                url: BASE_URL,
                name: "Vaibhav Bansal | AI Engineer",
                description: "Portfolio of Vaibhav Bansal — Top AI Engineer in the United States. LangChain · RAG · Python · React · AWS.",
                author: { "@type": "Person", name: "Vaibhav Bansal" },
                potentialAction: {
                  "@type": "SearchAction",
                  target: {
                    "@type": "EntryPoint",
                    urlTemplate: `${BASE_URL}/portfolio?q={search_term_string}`,
                  },
                  "query-input": "required name=search_term_string",
                },
                inLanguage: "en-US",
                audience: {
                  "@type": "Audience",
                  geographicArea: { "@type": "Country", name: "United States" },
                },
              },
              {
                "@context": "https://schema.org",
                "@type": "ProfilePage",
                url: BASE_URL,
                name: "Vaibhav Bansal — AI Engineer Portfolio",
                mainEntity: {
                  "@type": "Person",
                  name: "Vaibhav Bansal",
                  jobTitle: "AI Engineer",
                  description: "Senior AI Engineer in the United States with expertise in LLMs, RAG, and full-stack development.",
                },
              },
              {
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                itemListElement: [
                  { "@type": "ListItem", position: 1, name: "Home",      item: BASE_URL },
                  { "@type": "ListItem", position: 2, name: "About",     item: `${BASE_URL}/about` },
                  { "@type": "ListItem", position: 3, name: "Portfolio", item: `${BASE_URL}/portfolio` },
                  { "@type": "ListItem", position: 4, name: "Blog",      item: `${BASE_URL}/blog` },
                  { "@type": "ListItem", position: 5, name: "Contact",   item: `${BASE_URL}/contact` },
                ],
              },
            ]),
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://avatars.githubusercontent.com" />
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link rel="preconnect" href="https://cdn.fontshare.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://github-readme-stats.vercel.app" />
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          themes={["dark", "light", "studio", "arcane", "kingdoms", "ironman", "ai", "aurora", "swiss", "onyx"]}
        >
          <BackgroundJourney />
          <Grain />
          <BootLoader />
          <CustomCursor />
          <PatronusEgg />
          <AccioEgg />
          <EasterEgg />
          <ScrollProgress />
          <Navbar />
          <SmoothScroll><main><PageTransition>{children}</PageTransition></main></SmoothScroll>
          <Footer />
          <Chatbot />
          <PersonaPicker />
          <CommandPalette />
          <FridayTour />
          <SimulationMode />
          <ProactiveFriday />
          <UITicks />
          <ThemeSwitcher />
          <AmbientSound />
          <Analytics />
          <AnalyticsProvider />
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
    </ViewTransitions>
  );
}
