"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { hardhat } from "viem/chains";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { FaucetButton, RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { useOutsideClick, useTargetNetwork } from "~~/hooks/scaffold-eth";

type HeaderMenuLink = { label: string; href: string };

export const menuLinks: HeaderMenuLink[] = [
  { label: "Home", href: "/" },
  { label: "Theater", href: "/theater" },
  { label: "Demo", href: "/demo" },
  { label: "Architecture", href: "/architecture" },
];

export const HeaderMenuLinks = () => {
  const pathname = usePathname();

  return (
    <>
      {menuLinks.map(({ label, href }) => {
        const isActive = pathname === href;
        return (
          <li key={href}>
            <Link
              href={href}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive
                  ? "text-base-content bg-base-200"
                  : "text-base-content/65 hover:text-base-content hover:bg-base-200/60"
              }`}
            >
              {label}
            </Link>
          </li>
        );
      })}
    </>
  );
};

export const Header = () => {
  const { targetNetwork } = useTargetNetwork();
  const isLocalNetwork = targetNetwork.id === hardhat.id;
  const burgerMenuRef = useRef<HTMLDetailsElement>(null);

  useOutsideClick(burgerMenuRef, () => {
    burgerMenuRef?.current?.removeAttribute("open");
  });

  return (
    <header className="sticky top-0 z-30 border-b border-base-300 bg-base-100/95 backdrop-blur-sm">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-4 px-4 h-14">
        <div className="flex items-center gap-6">
          <details className="dropdown lg:hidden" ref={burgerMenuRef}>
            <summary className="btn btn-ghost btn-sm btn-square">
              <Bars3Icon className="h-5 w-5" />
            </summary>
            <ul
              className="dropdown-content menu p-2 shadow-lg fs-card mt-2 w-48"
              onClick={() => burgerMenuRef?.current?.removeAttribute("open")}
            >
              <HeaderMenuLinks />
            </ul>
          </details>

          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="w-2 h-2 rounded-full bg-accent" aria-hidden />
            <span className="font-semibold tracking-tight">FairStake</span>
          </Link>

          <nav className="hidden lg:block">
            <ul className="flex items-center gap-1 m-0 p-0 list-none">
              <HeaderMenuLinks />
            </ul>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <RainbowKitCustomConnectButton />
          {isLocalNetwork && <FaucetButton />}
        </div>
      </div>
    </header>
  );
};
