import { NextRequest, NextResponse } from "next/server";
import { runAgent } from "@/lib/agent";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  let body: { profile?: string; goals?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const profile = (body.profile ?? "").trim();
  const goals = (body.goals ?? "").trim();

  if (profile.length < 10) {
    return NextResponse.json(
      { error: "Describe your skills in at least a sentence so AURUM can match properly." },
      { status: 400 },
    );
  }

  const result = await runAgent(profile, goals);
  return NextResponse.json(result);
}
