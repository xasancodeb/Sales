import { NextRequest, NextResponse } from "next/server";
import { runAgent } from "@/lib/agent";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  let body: { product?: string; audience?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const product = (body.product ?? "").trim();
  const audience = (body.audience ?? "").trim();

  if (product.length < 10) {
    return NextResponse.json(
      { error: "Describe what you sell in at least a sentence." },
      { status: 400 },
    );
  }

  const result = await runAgent(product, audience);
  return NextResponse.json(result);
}
