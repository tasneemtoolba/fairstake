"use client";

const STATS = [
  { label: "Sybil wallets admitted", before: "50+", after: "0" },
  { label: "KYC uploads per investor", before: "Every pool", after: "Once" },
  { label: "Time to eligibility", before: "Days", after: "~60 sec" },
];

export const WhyFairStake = () => (
  <div className="grid md:grid-cols-3 gap-3">
    {STATS.map(s => (
      <div key={s.label} className="fs-card p-4 text-center">
        <p className="fs-eyebrow m-0 mb-3">{s.label}</p>
        <p className="text-sm text-base-content/40 line-through m-0">{s.before}</p>
        <p className="text-xl font-semibold text-success m-0 mt-1">{s.after}</p>
      </div>
    ))}
  </div>
);
