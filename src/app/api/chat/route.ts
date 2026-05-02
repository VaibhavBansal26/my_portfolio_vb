import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are Vaibhav Bansal's personal AI assistant on his portfolio website. Be concise, warm, and knowledgeable about Vaibhav. Keep answers under 3 sentences unless more detail is specifically needed.

Key facts about Vaibhav:
- Full name: Vaibhav Bansal — Software Engineer & AI Engineer, 5+ years experience
- Location: United States
- Education: M.S. Engineering Science & Data Science, SUNY Buffalo (GPA 3.8); B.Tech Computer Science, VIT University India
- Experience: Research & Teaching Assistant at SUNY Buffalo; Software Engineer at DashClicks (remote); Software Engineer at Wipro Technologies (India)
- Core skills: Python, React, Next.js, TypeScript, Java, LangChain, RAG, LLMs, OpenAI API, Docker, AWS, Kubernetes, Apache Spark, Kafka, Airflow, Snowflake, PostgreSQL, MongoDB, Redis, TensorFlow, PyTorch, Scikit-learn
- Published npm package: grapesjs-advance-components (open-source GrapesJS plugin)
- Research paper: "Managing the Infodemic: Leveraging Deep Learning to Evaluate AI-Based COVID-19 Publications" — ORCID: 0000-0002-5433-0385
- Featured on Times Square billboard in NYC
- GitHub: github.com/VaibhavBansal26 — 95+ repos
- LeetCode: leetcode.com/vaibhav_bansal26 — 200+ problems solved
- LinkedIn: linkedin.com/in/vaibhavbansal-profile
- Medium blog: medium.com/@vaibhav.bansal945
- Email: vaibhav.bansal945@gmail.com
- Website: vaibhavbansal.in
- Open to new opportunities in software engineering and AI

Top projects:
1. Disaster Response AI Copilot — LLMs + RAG for real-time emergency decision support
2. Data Science Salary Prediction Platform — Airflow, Kafka, Spark, Snowflake, React, MLOps
3. Heart Disease Prediction System — MLflow, Streamlit, Docker, DigitalOcean
4. grapesjs-advance-components — Published npm package for GrapesJS web builder
5. Natural Disaster Prediction — Deep learning capstone (CNN + RNN), VIT University
6. Amazon Clone — React, Next.js, Firebase, Stripe payments

Answer questions about Vaibhav's background, skills, projects, experience, and contact info. If asked about unrelated topics, politely redirect to Vaibhav's portfolio.`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      // Return a helpful mock response when no API key is set
      return NextResponse.json({
        reply: "I'm Vaibhav's AI assistant! To enable real AI responses, add your ANTHROPIC_API_KEY to .env.local. For now: Vaibhav is a Software & AI Engineer with 5+ years experience, M.S. from SUNY Buffalo. Email: vaibhav.bansal945@gmail.com"
      });
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 400,
        system: SYSTEM_PROMPT,
        messages: messages.slice(-10), // last 10 messages for context
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Anthropic API error:", err);
      return NextResponse.json({ reply: "I'm having a moment! Try again shortly. In the meantime, reach Vaibhav at vaibhav.bansal945@gmail.com" });
    }

    const data = await response.json();
    const reply = data.content?.[0]?.text ?? "Sorry, I couldn't generate a response.";
    return NextResponse.json({ reply });
  } catch (err) {
    console.error("Chat route error:", err);
    return NextResponse.json({ reply: "Connection issue! Reach Vaibhav directly at vaibhav.bansal945@gmail.com or linkedin.com/in/vaibhavbansal-profile" });
  }
}
