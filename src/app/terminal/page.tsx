import type { Metadata } from "next";
import TerminalApp from "./TerminalApp";

export const metadata: Metadata = {
  title: "Terminal — FRIDAY shell",
  description: "Explore Vaibhav Bansal's portfolio as an interactive terminal. Browse projects, skills and experience from the command line.",
  alternates: { canonical: "https://www.thevaibhavbansal.com/terminal" },
  openGraph: {
    title: "Terminal — FRIDAY shell | Vaibhav Bansal",
    description: "The portfolio as a TUI. friday ls projects.",
    url: "https://www.thevaibhavbansal.com/terminal",
    type: "website",
  },
};

export default function TerminalPage() {
  return <TerminalApp />;
}
