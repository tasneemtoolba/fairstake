import { NextResponse } from "next/server";
import { keccak256, toBytes } from "viem";
import { hardhat } from "viem/chains";
import { sepolia } from "viem/chains";
import { issueOnChainCredential } from "~~/lib/blockchain/pool";
import { arcTestnet } from "~~/lib/chains/arcTestnet";
import { registerEnsCredential } from "~~/lib/ens/mint-credential";
import { issuePassportOnChain } from "~~/lib/ens/passport-registry";

type IssueRequest = {
  walletAddress: `0x${string}`;
  nullifierHash: string;
  chainId?: number;
  maxCommitUsd?: number;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as IssueRequest;

    if (!body.walletAddress || !body.nullifierHash) {
      return NextResponse.json({ ok: false, error: "walletAddress and nullifierHash required" }, { status: 400 });
    }

    const chainId = body.chainId ?? hardhat.id;
    if (chainId !== hardhat.id && chainId !== arcTestnet.id) {
      return NextResponse.json({ ok: false, error: "Unsupported chainId" }, { status: 400 });
    }

    const nullifierHash = body.nullifierHash.startsWith("0x")
      ? (body.nullifierHash as `0x${string}`)
      : keccak256(toBytes(body.nullifierHash));

    const maxCommitUsd = body.maxCommitUsd ?? 100;
    const expiresInSeconds = 86400 * 30;

    const onChain = await issueOnChainCredential({
      chainId,
      investor: body.walletAddress,
      nullifierHash,
      maxCommitUsd,
      expiresInSeconds,
    });

    const ens = await registerEnsCredential({
      walletAddress: body.walletAddress,
      maxCommitUsd,
      roundId: "1",
      expiresAt: Number(onChain.expiresAt),
    });

    // Passport on Sepolia (submission) with Hardhat fallback (local dev)
    const passportChainId = chainId === hardhat.id ? hardhat.id : sepolia.id;
    const passport = await issuePassportOnChain({
      passportChainId,
      holder: body.walletAddress,
      ensName: ens.ensName,
      maxCommitUsd,
      expiresAt: Number(onChain.expiresAt),
      worldNullifier: nullifierHash,
    });

    return NextResponse.json({
      ok: true,
      txHash: onChain.hash,
      ensName: ens.ensName,
      maxCommitUsd,
      expiresAt: Number(onChain.expiresAt),
      passportTx: passport.skipped ? null : passport.hash,
      passportExplorer: passport.skipped ? null : passport.explorer,
      passportChainId: passport.skipped ? null : passport.chainId,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
