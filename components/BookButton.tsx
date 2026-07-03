"use client";

import type { PriceConfig } from "@/lib/pricing";

type BookButtonProps = {
  route: Pick<PriceConfig, "id" | "routeName" | "pickup" | "dropoff">;
  className?: string;
  children?: React.ReactNode;
};

export default function BookButton({
  route,
  className = "",
  children = "Book Now"
}: BookButtonProps) {
  function handleClick() {
    window.dispatchEvent(
      new CustomEvent("booking-route-selected", {
        detail: route
      })
    );

    document.getElementById("book-now")?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }

  return (
    <button type="button" onClick={handleClick} className={className}>
      {children}
    </button>
  );
}
