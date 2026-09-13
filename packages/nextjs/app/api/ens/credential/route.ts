import { NextResponse } from "next/server";
import { getEnsCredential } from "~~/lib/credential/store";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get("address");

  if (!address) {
    return NextResponse.json({ ok: false, error: "address query param required" }, { status: 400 });
  }

  const credential = getEnsCredential(address);
  if (!credential) {
    return NextResponse.json({ ok: false, error: "No credential found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true, credential });
}
