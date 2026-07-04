import type { Metadata } from "next";
import TerminalApp from "./TerminalApp";

export const metadata: Metadata = {
  title: "Terminal — FRIDAY shell",
  description: "The portfolio as a TUI. friday ls projects.",
};

export default function TerminalPage() {
  return <TerminalApp />;
}
