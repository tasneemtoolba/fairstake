import { NextResponse } from "next/server";
import type { IDKitResult } from "@worldcoin/idkit";
import type { WorldVerifyRequest } from "~~/lib/world/types";
import { verifyIdKitResult, verifyWorldProof } from "~~/lib/world/verify";

function isIdKitResult(body: unknown): body is IDKitResult {
  return typeof body === "object" && body !== null && "protocol_version" in body && "responses" in body;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (isIdKitResult(body)) {
      const result = await verifyIdKitResult(body);
      return NextResponse.json({ ok: true, result });
    }

    const legacyResult = await verifyWorldProof(body as WorldVerifyRequest);
    if (!legacyResult.verified) {
      return NextResponse.json({ ok: false, error: "Verification failed" }, { status: 401 });
    }

    return NextResponse.json({ ok: true, result: legacyResult });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
