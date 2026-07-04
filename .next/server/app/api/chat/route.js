"use strict";(()=>{var e={};e.id=744,e.ids=[744],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},69262:(e,a,n)=>{n.r(a),n.d(a,{originalPathname:()=>m,patchFetch:()=>b,requestAsyncStorage:()=>u,routeModule:()=>p,serverHooks:()=>h,staticGenerationAsyncStorage:()=>d});var t={};n.r(t),n.d(t,{POST:()=>c});var o=n(49303),i=n(88716),r=n(60670),s=n(87070);let l=`You are Vaibhav Bansal's personal AI assistant on his portfolio website. Be concise, warm, and knowledgeable about Vaibhav. Keep answers under 3 sentences unless more detail is specifically needed.

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

Answer questions about Vaibhav's background, skills, projects, experience, and contact info. If asked about unrelated topics, politely redirect to Vaibhav's portfolio.`;async function c(e){try{let{messages:a}=await e.json(),n=process.env.ANTHROPIC_API_KEY;if(!n)return s.NextResponse.json({reply:"I'm Vaibhav's AI assistant! To enable real AI responses, add your ANTHROPIC_API_KEY to .env.local. For now: Vaibhav is a Software & AI Engineer with 5+ years experience, M.S. from SUNY Buffalo. Email: vaibhav.bansal945@gmail.com"});let t=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json","x-api-key":n,"anthropic-version":"2023-06-01"},body:JSON.stringify({model:"claude-haiku-4-5-20251001",max_tokens:400,system:l,messages:a.slice(-10)})});if(!t.ok){let e=await t.text();return console.error("Anthropic API error:",e),s.NextResponse.json({reply:"I'm having a moment! Try again shortly. In the meantime, reach Vaibhav at vaibhav.bansal945@gmail.com"})}let o=await t.json(),i=o.content?.[0]?.text??"Sorry, I couldn't generate a response.";return s.NextResponse.json({reply:i})}catch(e){return console.error("Chat route error:",e),s.NextResponse.json({reply:"Connection issue! Reach Vaibhav directly at vaibhav.bansal945@gmail.com or linkedin.com/in/vaibhavbansal-profile"})}}let p=new o.AppRouteRouteModule({definition:{kind:i.x.APP_ROUTE,page:"/api/chat/route",pathname:"/api/chat",filename:"route",bundlePath:"app/api/chat/route"},resolvedPagePath:"/home/runner/work/my_portfolio_vb/my_portfolio_vb/src/app/api/chat/route.ts",nextConfigOutput:"standalone",userland:t}),{requestAsyncStorage:u,staticGenerationAsyncStorage:d,serverHooks:h}=p,m="/api/chat/route";function b(){return(0,r.patchFetch)({serverHooks:h,staticGenerationAsyncStorage:d})}}};var a=require("../../../webpack-runtime.js");a.C(e);var n=e=>a(a.s=e),t=a.X(0,[948,972],()=>n(69262));module.exports=t})();