import type { ReactNode } from "react";

export const FsEyebrow = ({ children }: { children: ReactNode }) => <p className="fs-eyebrow m-0">{children}</p>;

export const FsSection = ({
  title,
  subtitle,
  children,
  className = "",
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}) => (
  <section className={`space-y-4 ${className}`}>
    <div className="space-y-2">
      <FsEyebrow>{title}</FsEyebrow>
      {subtitle && <p className="text-sm text-base-content/70 m-0 max-w-xl">{subtitle}</p>}
      <div className="fs-divider-gold" />
    </div>
    {children}
  </section>
);

export const FsCard = ({
  children,
  active = false,
  className = "",
}: {
  children: ReactNode;
  active?: boolean;
  className?: string;
}) => <div className={`fs-card p-5 ${active ? "fs-card-active" : ""} ${className}`}>{children}</div>;

export const FsPartners = () => (
  <div className="flex flex-wrap justify-center gap-2">
    {["World", "ENS", "Arc"].map(name => (
      <span key={name} className="fs-partner">
        {name}
      </span>
    ))}
  </div>
);

export const FsStat = ({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "ok" | "bad";
}) => (
  <div className="fs-card px-4 py-3 min-w-[7rem]">
    <p className="fs-eyebrow m-0 mb-1">{label}</p>
    <p
      className={`text-lg font-semibold m-0 tabular-nums ${
        tone === "ok" ? "text-success" : tone === "bad" ? "text-error" : "text-base-content"
      }`}
    >
      {value}
    </p>
  </div>
);
