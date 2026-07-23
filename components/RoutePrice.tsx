import {
  formatPrice,
  getDiscountedPrice,
  getSavings,
  type PriceConfig
} from "@/lib/pricing";

type RoutePriceProps = {
  price: PriceConfig;
  compact?: boolean;
};

export default function RoutePrice({ price, compact = false }: RoutePriceProps) {
  const discountedPrice = getDiscountedPrice(price);
  const savings = getSavings(price);
  const hasPrice = price.normalPrice !== null;

  if (!hasPrice) {
    return (
      <div className={`grid gap-2 ${compact ? "text-sm" : ""}`}>
        <div className="rounded-lg bg-midnight px-3 py-3 text-center text-sm font-black text-white">
          Price confirmed before pickup
        </div>
      </div>
    );
  }

  return (
    <div className={`grid gap-2 ${compact ? "text-sm" : ""}`}>
      <div className="w-fit rounded-full bg-gold px-3 py-1 text-xs font-black text-midnight">
        {price.discountPercent}% ☀️ Summer Discount
      </div>
      <div className="flex items-center justify-between gap-4 rounded-lg bg-slate-50 px-3 py-2">
        <span className="font-semibold text-slate-500">Regular Price</span>
        <span className="font-extrabold text-slate-500 line-through decoration-2">
          {formatPrice(price.normalPrice, price.currency)}
        </span>
      </div>
      <div className="flex justify-center text-gold" aria-hidden="true">
        ↓
      </div>
      <div className="flex items-center justify-between gap-4 rounded-lg bg-gold/[0.14] px-3 py-2">
        <span className="font-semibold text-slate-600">Summer Price</span>
        <span className="font-extrabold text-midnight">
          {formatPrice(discountedPrice, price.currency)}
        </span>
      </div>
      <div className="rounded-lg bg-midnight px-3 py-2 text-center text-sm font-black text-white">
        {hasPrice
          ? `You Save ${formatPrice(savings, price.currency)}`
          : "Price confirmed before pickup"}
      </div>
    </div>
  );
}
