import { NextResponse } from "next/server";
import { getServerWorldConfig } from "~~/lib/world/config";
import { createRpContext } from "~~/lib/world/rp-sign";

export async function GET() {
  try {
    const config = getServerWorldConfig();
    if (!config) {
      return NextResponse.json({ ok: false, error: "World RP not configured" }, { status: 503 });
    }

    const rp_context = createRpContext();

    return NextResponse.json({
      ok: true,
      app_id: config.appId,
      action: config.action,
      environment: config.environment,
      allow_legacy_proofs: true,
      rp_context,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
