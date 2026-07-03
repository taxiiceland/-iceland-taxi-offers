export type PriceCategory = "airport" | "tour" | "custom";
export type PriceCurrency = "ISK";

export type PriceConfig = {
  id: string;
  routeName: string;
  pickup: string;
  dropoff: string;
  normalPrice: number | null;
  currency: PriceCurrency;
  discountPercent: number;
  duration: string;
  note: string;
  category: PriceCategory;
};

const airportDiscount = 20;
const tourDiscount = 25;

export const prices = {
  airportToReykjavik: {
    id: "airportToReykjavik",
    routeName: "Keflavík Airport → Reykjavík",
    pickup: "Keflavík Airport",
    dropoff: "Reykjavík",
    normalPrice: 22500,
    currency: "ISK",
    discountPercent: airportDiscount,
    duration: "45–55 min",
    note: "Airport transfer",
    category: "airport"
  },
  reykjavikToAirport: {
    id: "reykjavikToAirport",
    routeName: "Reykjavík → Keflavík Airport",
    pickup: "Reykjavík",
    dropoff: "Keflavík Airport",
    normalPrice: 22500,
    currency: "ISK",
    discountPercent: airportDiscount,
    duration: "45–55 min",
    note: "Airport drop-off",
    category: "airport"
  },
  airportToBlueLagoon: {
    id: "airportToBlueLagoon",
    routeName: "Keflavík Airport → Blue Lagoon",
    pickup: "Keflavík Airport",
    dropoff: "Blue Lagoon",
    normalPrice: 11000,
    currency: "ISK",
    discountPercent: airportDiscount,
    duration: "20–25 min",
    note: "Blue Lagoon taxi",
    category: "airport"
  },
  reykjavikToBlueLagoon: {
    id: "reykjavikToBlueLagoon",
    routeName: "Reykjavík → Blue Lagoon",
    pickup: "Reykjavík",
    dropoff: "Blue Lagoon",
    normalPrice: 22500,
    currency: "ISK",
    discountPercent: airportDiscount,
    duration: "45–55 min",
    note: "Blue Lagoon transfer",
    category: "airport"
  },
  blueLagoonToReykjavik: {
    id: "blueLagoonToReykjavik",
    routeName: "Blue Lagoon → Reykjavík",
    pickup: "Blue Lagoon",
    dropoff: "Reykjavík",
    normalPrice: 22500,
    currency: "ISK",
    discountPercent: airportDiscount,
    duration: "45–55 min",
    note: "Blue Lagoon transfer",
    category: "airport"
  },
  blueLagoonToAirport: {
    id: "blueLagoonToAirport",
    routeName: "Blue Lagoon → Keflavík Airport",
    pickup: "Blue Lagoon",
    dropoff: "Keflavík Airport",
    normalPrice: 11000,
    currency: "ISK",
    discountPercent: airportDiscount,
    duration: "20–25 min",
    note: "Airport transfer",
    category: "airport"
  },
  customAddressTransfer: {
    id: "customAddressTransfer",
    routeName: "Hotel or Private Address Transfer",
    pickup: "Hotel or private address",
    dropoff: "Custom destination",
    normalPrice: null,
    currency: "ISK",
    discountPercent: airportDiscount,
    duration: "Route dependent",
    note: "Price confirmed before pickup",
    category: "custom"
  },
  goldenCircle: {
    id: "goldenCircle",
    routeName: "Golden Circle Private Taxi",
    pickup: "Reykjavík or selected pickup",
    dropoff: "Golden Circle private tour",
    normalPrice: 97000,
    currency: "ISK",
    discountPercent: tourDiscount,
    duration: "6 hrs",
    note: "Private day trip",
    category: "tour"
  },
  southCoast: {
    id: "southCoast",
    routeName: "South Coast Private Tour",
    pickup: "Reykjavík or selected pickup",
    dropoff: "South Coast private tour",
    normalPrice: 141000,
    currency: "ISK",
    discountPercent: tourDiscount,
    duration: "12 hrs",
    note: "Waterfalls and black sand beach",
    category: "tour"
  },
  silverCircle: {
    id: "silverCircle",
    routeName: "Silver Circle Private Tour",
    pickup: "Reykjavík or selected pickup",
    dropoff: "Silver Circle private tour",
    normalPrice: 88000,
    currency: "ISK",
    discountPercent: tourDiscount,
    duration: "6 hrs",
    note: "Hidden waterfalls and hot springs",
    category: "tour"
  },
  snaefellsnes: {
    id: "snaefellsnes",
    routeName: "Snæfellsnes Peninsula Private Tour",
    pickup: "Reykjavík or selected pickup",
    dropoff: "Snæfellsnes Peninsula private tour",
    normalPrice: 183500,
    currency: "ISK",
    discountPercent: tourDiscount,
    duration: "12 hrs",
    note: "Full-day private trip",
    category: "tour"
  },
  blueLagoon: {
    id: "blueLagoon",
    routeName: "Blue Lagoon Return",
    pickup: "Reykjavík or selected pickup",
    dropoff: "Blue Lagoon return",
    normalPrice: 55350,
    currency: "ISK",
    discountPercent: tourDiscount,
    duration: "4 hrs",
    note: "Blue Lagoon return, 4 hours total",
    category: "tour"
  },
  reykjanesLavaTour: {
    id: "reykjanesLavaTour",
    routeName: "Grindavík / Reykjanes Lava Tour",
    pickup: "Reykjavík, Keflavík Airport, or selected pickup",
    dropoff: "Reykjanes / Grindavík lava tour",
    normalPrice: 67500,
    currency: "ISK",
    discountPercent: tourDiscount,
    duration: "5 hrs",
    note: "Lava fields and geothermal coast",
    category: "tour"
  },
  reykjavikSightseeing: {
    id: "reykjavikSightseeing",
    routeName: "Reykjavík Sightseeing",
    pickup: "Reykjavík",
    dropoff: "Reykjavík sightseeing route",
    normalPrice: 26325,
    currency: "ISK",
    discountPercent: tourDiscount,
    duration: "2 hrs",
    note: "Private city highlights",
    category: "tour"
  },
  cityCenter: {
    id: "cityCenter",
    routeName: "City Center",
    pickup: "Reykjavík",
    dropoff: "City Center",
    normalPrice: 4050,
    currency: "ISK",
    discountPercent: tourDiscount,
    duration: "Short transfer",
    note: "City Center",
    category: "tour"
  },
  hvammsvikOneWay: {
    id: "hvammsvikOneWay",
    routeName: "Hvammsvík One Way",
    pickup: "Reykjavík or selected pickup",
    dropoff: "Hvammsvík",
    normalPrice: 28350,
    currency: "ISK",
    discountPercent: tourDiscount,
    duration: "One way",
    note: "Hvammsvík one way",
    category: "tour"
  },
  hvammsvikReturn: {
    id: "hvammsvikReturn",
    routeName: "Hvammsvík Return",
    pickup: "Reykjavík or selected pickup",
    dropoff: "Hvammsvík return",
    normalPrice: 70200,
    currency: "ISK",
    discountPercent: tourDiscount,
    duration: "4 hrs",
    note: "Hvammsvík return, 4 hours total",
    category: "tour"
  },
  customTrip: {
    id: "customTrip",
    routeName: "Custom Iceland Private Trip",
    pickup: "Your pickup location",
    dropoff: "Custom destination",
    normalPrice: null,
    currency: "ISK",
    discountPercent: tourDiscount,
    duration: "Flexible",
    note: "Price confirmed before booking.",
    category: "custom"
  }
} satisfies Record<string, PriceConfig>;

export type PriceId = keyof typeof prices;

export function getDiscountedPrice(price: PriceConfig) {
  if (price.normalPrice === null) {
    return null;
  }

  return Math.round(price.normalPrice * (1 - price.discountPercent / 100));
}

export function getSavings(price: PriceConfig) {
  const discountedPrice = getDiscountedPrice(price);

  if (price.normalPrice === null || discountedPrice === null) {
    return null;
  }

  return price.normalPrice - discountedPrice;
}

export function formatPrice(amount: number | null, currency: PriceCurrency) {
  if (amount === null) {
    return "Price confirmed before pickup";
  }

  const formatted = new Intl.NumberFormat("en-US").format(amount);

  return `${formatted} ISK`;
}
