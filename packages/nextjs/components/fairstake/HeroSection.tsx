"use client";

import Link from "next/link";
import { FsEyebrow, FsPartners } from "./ui/Design";

export const HeroSection = () => (
  <header className="text-center space-y-6 max-w-2xl mx-auto pt-4 pb-2">
    <FsEyebrow>Investor eligibility for fair launches</FsEyebrow>
    <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-base-content m-0">
      Proof of person,
      <span className="block text-accent mt-1">not proof of passport</span>
    </h1>
    <p className="text-base text-base-content/70 leading-relaxed m-0 max-w-lg mx-auto">
      Verify once with World. Carry an ENS-shaped passport. Commit USDC on Arc — sybils fail closed on-chain.
    </p>
    <FsPartners />
    <div className="flex flex-wrap justify-center gap-3 pt-1">
      <Link href="/theater" className="btn btn-primary btn-sm px-6">
        Judge Theater
      </Link>
      <Link href="/demo" className="btn btn-outline btn-sm px-6">
        Live demo
      </Link>
    </div>
  </header>
);
