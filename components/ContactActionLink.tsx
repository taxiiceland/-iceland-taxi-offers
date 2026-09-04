"use client";

import {
  trackCallClicked
} from "@/lib/analytics";
import type { AnchorHTMLAttributes, ReactNode } from "react";

type ContactActionLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  action: "call";
  placement: string;
  children: ReactNode;
};

export default function ContactActionLink({
  action,
  placement,
  onClick,
  children,
  ...props
}: ContactActionLinkProps) {
  return (
    <a
      {...props}
      onClick={(event) => {
        trackCallClicked(placement);

        onClick?.(event);
      }}
    >
      {children}
    </a>
  );
}
