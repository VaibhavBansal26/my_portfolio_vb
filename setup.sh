#!/bin/bash
echo "Setting up Vaibhav Bansal Portfolio..."
rm -rf .next node_modules/.cache
npm install
echo ""
echo "✓ Dependencies installed"
echo ""
echo "📋 Required files to add manually:"
echo "  - public/audio/interstellar.mp3   (Cornfield Chase music)"
echo "  - public/photos/times-square.jpg"
echo "  - public/photos/graduation.jpg"
echo "  - public/photos/buffalo.jpg"
echo "  - public/photos/hackathon.jpg"
echo "  - public/photos/india.jpg"
echo "  - public/photos/team.jpg"
echo "  - public/resume/Vaibhav_Bansal_Resume.pdf"
echo ""
echo "🔑 Required env var in .env.local:"
echo "  ANTHROPIC_API_KEY=sk-ant-..."
echo ""
echo "📅 For book appointment: update Calendly URL in ContactSection.tsx"
echo ""
echo "Starting dev server..."
npm run dev
