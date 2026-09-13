import { NextResponse } from "next/server";
import { readPassport } from "~~/lib/ens/passport-registry";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get("address") as `0x${string}` | null;

  if (!address) {
    return NextResponse.json({ ok: false, error: "address required" }, { status: 400 });
  }

  const passport = await readPassport(address);
  if (!passport) {
    return NextResponse.json({ ok: false, error: "No on-chain passport" }, { status: 404 });
  }

  return NextResponse.json({ ok: true, passport });
}
