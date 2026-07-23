"use client";

import {
  trackCallClicked,
  trackWhatsappClicked
} from "@/lib/analytics";
import type { AnchorHTMLAttributes, ReactNode } from "react";

type ContactActionLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  action: "call" | "whatsapp";
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
        if (action === "call") {
          trackCallClicked(placement);
        } else {
          trackWhatsappClicked(placement);
        }

        onClick?.(event);
      }}
    >
      {children}
    </a>
  );
}
