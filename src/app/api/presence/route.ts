import { NextResponse } from "next/server";

/** Best-effort daily visitor counter (in-memory; resets on redeploy). */
let day = "";
let count = 0;

export const dynamic = "force-dynamic";

export async function GET() {
  const today = new Date().toISOString().slice(0, 10);
  if (today !== day) { day = today; count = 0; }
  count++;
  return NextResponse.json({ today: count });
}
