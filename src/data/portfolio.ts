// src/data/portfolio.ts

export const personal = {
  name: "Vaibhav Bansal",
  title: "Software Engineer & AI Engineer",
  tagline: "Building scalable systems. Shipping intelligent products.",
  bio: "Software Engineer and AI Engineer with 5+ years of experience building scalable applications and AI-powered systems. M.S. in Engineering Science & Data Science from SUNY Buffalo. Experienced in architecting production-grade platforms using Python, Java, React, Docker, AWS, and cloud-native technologies.",
  location: "United States",
  email: "vaibhav.bansal945@gmail.com",
  website: "https://www.vaibhavbansal.in",
  github: "https://github.com/VaibhavBansal26",
  linkedin: "https://www.linkedin.com/in/vaibhavbansal-profile/",
  leetcode: "https://leetcode.com/vaibhav_bansal26",
  medium: "https://medium.com/@vaibhav.bansal945",
  twitter: "https://twitter.com/Vaibhavbansal26",
  orcid: "https://orcid.org/0000-0002-5433-0385",
  npmPackage: "https://www.npmjs.com/package/grapesjs-advance-components",
  timesquare: "/videos/timesquare.mp4", // replace with actual video path
  avatar: "https://avatars.githubusercontent.com/u/31563651?v=4",
};

export const stats = [
  { label: "Years Experience", value: 5 },
  { label: "Projects Built", value: 40 },
  { label: "GitHub Repos", value: 95 },
  { label: "LeetCode Solved", value: 200 },
];

export const skills = {
  languages: ["Python", "JavaScript", "TypeScript", "Java", "SQL", "Bash"],
  frontend: ["React", "Next.js", "Tailwind CSS", "Redux", "HTML5", "CSS3", "Framer Motion"],
  backend: ["Node.js", "Flask", "FastAPI", "Spring Boot", "REST APIs", "GraphQL"],
  ai_ml: ["LangChain", "RAG", "LLMs", "TensorFlow", "PyTorch", "Scikit-learn", "OpenAI API", "Hugging Face"],
  data: ["Apache Spark", "Kafka", "Airflow", "Snowflake", "PostgreSQL", "MongoDB", "Redis"],
  devops: ["Docker", "Kubernetes", "AWS", "Azure", "CI/CD", "Jenkins", "Terraform"],
  tools: ["Git", "GitHub Copilot", "MLflow", "Postman", "Jira", "Confluence"],
};

export const experience = [
  {
    company: "University at Buffalo (SUNY)",
    role: "Research Assistant & Graduate Teaching Assistant",
    period: "2023 – 2025",
    location: "United States",
    description: "Research Assistant on AI/ML projects. Graduate Teaching Assistant for EAS 503 (Programming & Database Fundamentals) and CDA 500 (Applied Machine Learning at Scale).",
    tech: ["Python", "ML", "Data Science", "PostgreSQL"],
  },
  {
    company: "DashClicks",
    role: "Software Engineer",
    period: "2021 – 2023",
    location: "Remote / India",
    description: "Architected and deployed scalable, user-centric web applications. Built full-stack features using React, Node.js, and AWS. Led frontend development initiatives that improved user engagement.",
    tech: ["React", "Node.js", "AWS", "Docker", "TypeScript"],
  },
  {
    company: "Wipro Technologies",
    role: "Software Engineer",
    period: "2019 – 2021",
    location: "India",
    description: "Full-stack development using Java and React. Worked on enterprise-level applications, REST API design, and deployment pipelines for Fortune 500 clients.",
    tech: ["Java", "Spring Boot", "React", "SQL", "Docker"],
  },
];

export const education = [
  {
    institution: "State University of New York at Buffalo",
    degree: "M.S. in Engineering Science & Data Science",
    period: "2023 – 2025",
    location: "United States",
    gpa: "GPA: 3.8/4.0",
  },
  {
    institution: "Vellore Institute of Technology (VIT University)",
    degree: "B.Tech in Computer Science & Engineering",
    period: "2015 – 2019",
    location: "Vellore, India",
  },
];

export const projects = [
  {
    id: "disaster-copilot",
    title: "Disaster Response AI Copilot",
    description: "An AI-powered emergency response system leveraging LLMs and RAG to provide real-time decision support during natural disasters. Integrates multiple data sources for situational awareness.",
    tech: ["Python", "LangChain", "RAG", "OpenAI", "FastAPI", "Docker"],
    github: "https://github.com/VaibhavBansal26/Disaster-Response-AI-Copilot",
    featured: true,
    category: "AI/ML",
    year: 2024,
  },
  {
    id: "salary-prediction",
    title: "Data Science Salary Prediction Platform",
    description: "End-to-end MLOps pipeline with real-time salary predictions. Uses Apache Airflow, Kafka, Spark, Snowflake, and EC2. Features a React frontend with live model predictions via Flask API.",
    tech: ["Python", "Apache Spark", "Kafka", "Airflow", "Snowflake", "React", "Flask", "Docker", "AWS"],
    github: "https://github.com/VaibhavBansal26/data_science_salary_prediction_v2",
    featured: true,
    category: "Data Engineering",
    year: 2024,
  },
  {
    id: "heart-disease",
    title: "Heart Disease Prediction System",
    description: "Production ML system with MLflow experiment tracking, Streamlit UI, deployed on DigitalOcean with Docker. Achieves high accuracy with ensemble methods.",
    tech: ["Python", "Streamlit", "MLflow", "Docker", "DigitalOcean"],
    github: "https://github.com/VaibhavBansal26/heart_disease_prediction_version2",
    featured: true,
    category: "AI/ML",
    year: 2023,
  },
  {
    id: "amazon-clone",
    title: "Amazon Clone with Stripe Payments",
    description: "Full-stack e-commerce platform mirroring Amazon's core features. Built with React, Next.js, Firebase auth, Stripe payments, and Tailwind CSS.",
    tech: ["React", "Next.js", "Firebase", "Tailwind CSS", "Stripe", "JavaScript"],
    github: "https://github.com/VaibhavBansal26/amazon-clone-stripe",
    featured: false,
    category: "Full Stack",
    year: 2023,
  },
  {
    id: "natural-disaster-pred",
    title: "Natural Disaster Prediction (VIT Capstone)",
    description: "Deep learning system for predicting natural disasters using satellite imagery and sensor data. Built with CNNs and RNNs for multi-class classification.",
    tech: ["Python", "TensorFlow", "Deep Learning", "CNN", "RNN"],
    github: "https://github.com/VaibhavBansal26/Capstone-2020-Natural-Disaster-Prediction",
    featured: true,
    category: "AI/ML",
    year: 2020,
  },
  {
    id: "grapesjs-plugin",
    title: "GrapesJS Advance Components (npm)",
    description: "Open-source npm plugin extending GrapesJS with advanced drag-and-drop UI components. Published on npm. Enables richer web builder experiences with minimal config.",
    tech: ["JavaScript", "GrapesJS", "npm", "Open Source"],
    github: "https://github.com/VaibhavBansal26/grapesjs-advance-components",
    npm: "https://www.npmjs.com/package/grapesjs-advance-components",
    featured: true,
    category: "Open Source",
    year: 2023,
  },
  {
    id: "portfolio-v1",
    title: "Personal Portfolio Website",
    description: "Previous portfolio built with React, showcasing projects and skills. Deployed on Vercel with CI/CD integration.",
    tech: ["React", "JavaScript", "CSS3"],
    github: "https://github.com/VaibhavBansal26/new-portfolio-vb",
    live: "https://www.vaibhavbansal.in",
    featured: false,
    category: "Full Stack",
    year: 2023,
  },
];

export const certifications = [
  {
    title: "Microsoft Certified: Azure Fundamentals (AZ-900)",
    issuer: "Microsoft",
    year: "2023",
    badge: "https://learn.microsoft.com/media/learn/certification/badges/microsoft-certified-fundamentals-badge.svg",
    url: "https://learn.microsoft.com/en-us/certifications/azure-fundamentals/",
  },
  {
    title: "AWS Solutions Architect",
    issuer: "Amazon Web Services",
    year: "2023",
    url: "https://aws.amazon.com/certification/",
  },
  {
    title: "Deep Learning Specialization",
    issuer: "Coursera / deeplearning.ai",
    year: "2022",
    url: "https://www.coursera.org/specializations/deep-learning",
  },
  {
    title: "Machine Learning",
    issuer: "Stanford / Coursera",
    year: "2021",
    url: "https://www.coursera.org/learn/machine-learning",
  },
];

export const research = [
  {
    title: "Managing the Infodemic: Leveraging Deep Learning to Evaluate AI-Based COVID-19 Publications for Knowledge Surveillance",
    journal: "medRxiv / SUNY Buffalo Research",
    year: "2023",
    orcid: "https://orcid.org/0000-0002-5433-0385",
    description: "Evaluated quality and maturity of AI-based COVID-19 publications using deep learning techniques to support disease surveillance and policy decisions.",
    tags: ["Deep Learning", "NLP", "COVID-19", "Surveillance"],
  },
];

export const blogs = [
  {
    title: "Building a Production RAG Pipeline with LangChain and OpenAI",
    date: "2024-03-15",
    url: "https://medium.com/@vaibhav.bansal945",
    readTime: "8 min",
    tags: ["AI", "LangChain", "RAG", "Python"],
  },
  {
    title: "End-to-End MLOps with Airflow, Kafka, and Snowflake",
    date: "2024-01-10",
    url: "https://medium.com/@vaibhav.bansal945",
    readTime: "12 min",
    tags: ["MLOps", "Kafka", "Snowflake", "Airflow"],
  },
  {
    title: "Why I Published My First npm Package (and What I Learned)",
    date: "2023-09-05",
    url: "https://medium.com/@vaibhav.bansal945",
    readTime: "5 min",
    tags: ["Open Source", "npm", "JavaScript"],
  },
  {
    title: "GitHub Copilot for Full-Stack AI Development: A Practical Guide",
    date: "2023-06-20",
    url: "https://medium.com/@vaibhav.bansal945",
    readTime: "7 min",
    tags: ["AI", "GitHub Copilot", "Productivity"],
  },
];

export const youtubeVideos = [
  {
    id: "yt-1",
    title: "Building a Production RAG Pipeline with LangChain — Full Tutorial",
    description: "End-to-end walkthrough of building a Retrieval-Augmented Generation pipeline with LangChain, Chroma, and OpenAI. From document ingestion to deployment.",
    youtubeId: "REPLACE_WITH_VIDEO_ID_1",
    thumbnail: "https://img.youtube.com/vi/REPLACE_WITH_VIDEO_ID_1/maxresdefault.jpg",
    duration: "24:18",
    views: "2.4K",
    date: "2024-04-10",
    tags: ["LangChain", "RAG", "Python", "AI"],
  },
  {
    id: "yt-2",
    title: "MLOps Pipeline: Airflow + Kafka + Snowflake from Scratch",
    description: "Building a complete MLOps data pipeline using Apache Airflow for orchestration, Kafka for streaming, and Snowflake as the data warehouse.",
    youtubeId: "REPLACE_WITH_VIDEO_ID_2",
    thumbnail: "https://img.youtube.com/vi/REPLACE_WITH_VIDEO_ID_2/maxresdefault.jpg",
    duration: "31:07",
    views: "1.1K",
    date: "2024-02-22",
    tags: ["MLOps", "Kafka", "Airflow", "Snowflake"],
  },
  {
    id: "yt-3",
    title: "LangChain in 20 Minutes — Complete Beginner Guide",
    description: "A fast-paced introduction to LangChain covering chains, agents, memory, and tools. Build your first LLM application in under 20 minutes.",
    youtubeId: "REPLACE_WITH_VIDEO_ID_3",
    thumbnail: "https://img.youtube.com/vi/REPLACE_WITH_VIDEO_ID_3/maxresdefault.jpg",
    duration: "19:52",
    views: "3.8K",
    date: "2024-01-15",
    tags: ["LangChain", "LLM", "Python", "Tutorial"],
  },
  {
    id: "yt-4",
    title: "FastAPI for ML Engineers — Deploy Your Model in 30 Minutes",
    description: "Learn how to wrap your ML model in a production-ready FastAPI service with authentication, validation, async endpoints, and Docker deployment.",
    youtubeId: "REPLACE_WITH_VIDEO_ID_4",
    thumbnail: "https://img.youtube.com/vi/REPLACE_WITH_VIDEO_ID_4/maxresdefault.jpg",
    duration: "28:44",
    views: "1.9K",
    date: "2023-11-08",
    tags: ["FastAPI", "Python", "MLOps", "Docker"],
  },
];
