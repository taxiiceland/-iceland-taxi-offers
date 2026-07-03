import { prices } from "./pricing";

export const contact = {
  phone: "+354 760 7201",
  whatsapp: "+354 760 7201",
  email: "icelandtaxioffers@gmail.com",
  businessName: "Iceland Taxi Offers",
  serviceArea:
    "Keflavík Airport, Reykjavík, Blue Lagoon, and private tours across Iceland."
};

export const images = {
  hero:
    "https://images.unsplash.com/photo-1513353214617-5eabab90975c?auto=format&fit=crop&w=2400&q=80",
  goldenCircle:
    "https://images.unsplash.com/photo-1548253026-c9cc470719e4?auto=format&fit=crop&w=1400&q=80",
  southCoast:
    "https://images.unsplash.com/photo-1723328367210-7a52ac7e2dce?auto=format&fit=crop&w=1400&q=80",
  silverCircle:
    "https://images.unsplash.com/photo-1621959721891-d297dfd9d6ee?auto=format&fit=crop&w=1400&q=80",
  snaefellsnes:
    "https://images.unsplash.com/photo-1595742744735-415fc20ef88f?auto=format&fit=crop&w=1400&q=80",
  blueLagoon:
    "https://images.unsplash.com/photo-1439725434120-c1b50e0cc329?auto=format&fit=crop&w=1400&q=80",
  reykjanes:
    "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?auto=format&fit=crop&w=1400&q=80",
  reykjavik:
    "https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&w=1400&q=80",
  customTrip:
    "https://images.unsplash.com/photo-1513353214617-5eabab90975c?auto=format&fit=crop&w=1400&q=80"
};

export const airportRoutes = [
  prices.airportToReykjavik,
  prices.reykjavikToAirport,
  prices.airportToBlueLagoon,
  prices.reykjavikToBlueLagoon,
  prices.blueLagoonToReykjavik,
  prices.blueLagoonToAirport,
  prices.customAddressTransfer
];

export const tourCards = [
  {
    price: prices.goldenCircle,
    title: "Golden Circle",
    description: "Visit Þingvellir, Geysir and Gullfoss.",
    image: images.goldenCircle,
    alt: "Golden Circle private taxi tour in Iceland",
    gallery: ["Þingvellir", "Geysir", "Gullfoss"]
  },
  {
    price: prices.southCoast,
    title: "South Coast",
    description: "Waterfalls, black sand beaches and scenery.",
    image: images.southCoast,
    alt: "South Coast private tour in Iceland with black sand beach",
    gallery: ["Seljalandsfoss", "Skógafoss", "Reynisfjara", "Vík"]
  },
  {
    price: prices.silverCircle,
    title: "Silver Circle",
    description: "Hidden waterfalls, hot springs and countryside.",
    image: images.silverCircle,
    alt: "Silver Circle private tour waterfalls in Iceland",
    gallery: ["Hraunfossar", "Barnafoss", "Deildartunguhver"]
  },
  {
    price: prices.snaefellsnes,
    title: "Snæfellsnes Peninsula",
    description: "Mountains, coastlines and volcanic landscapes.",
    image: images.snaefellsnes,
    alt: "Snæfellsnes Peninsula private tour in Iceland",
    gallery: ["Kirkjufell", "Arnarstapi", "Djúpalónssandur"]
  },
  {
    price: prices.blueLagoon,
    title: "Blue Lagoon Return",
    description: "Relax at Iceland’s famous geothermal spa.",
    image: images.blueLagoon,
    alt: "Blue Lagoon return private taxi in Iceland",
    gallery: ["Blue Lagoon", "Gunnuhver", "Bridge Between Continents"]
  },
  {
    price: prices.reykjanesLavaTour,
    title: "Grindavík / Reykjanes Lava Tour",
    description: "Lava fields, geothermal areas and dramatic coastline.",
    image: images.reykjanes,
    alt: "Reykjanes lava tour near Grindavík in Iceland",
    gallery: ["Grindavík", "Gunnuhver", "Bridge Between Continents", "Lava fields"]
  },
  {
    price: prices.reykjavikSightseeing,
    title: "Reykjavík Sightseeing",
    description: "Private sightseeing around Reykjavík highlights.",
    image: images.reykjavik,
    alt: "Reykjavík sightseeing private taxi tour",
    gallery: ["Hallgrímskirkja", "Harpa", "Sun Voyager", "City viewpoints"]
  },
  {
    price: prices.cityCenter,
    title: "City Center",
    description: "Quick private city-center transfer.",
    image: images.reykjavik,
    alt: "Reykjavík city center private taxi",
    gallery: ["Downtown Reykjavík", "City Center", "Local pickup"]
  },
  {
    price: prices.hvammsvikOneWay,
    title: "Hvammsvík One Way",
    description: "Private one-way ride to Hvammsvík.",
    image: images.reykjavik,
    alt: "Hvammsvík one way private taxi from Reykjavík",
    gallery: ["Hvammsvík", "Scenic route", "Private ride"]
  },
  {
    price: prices.hvammsvikReturn,
    title: "Hvammsvík Return",
    description: "Private return ride with 4 hours total.",
    image: images.reykjavik,
    alt: "Hvammsvík return private taxi from Reykjavík",
    gallery: ["Hvammsvík", "Return ride", "4 hours total"]
  },
  {
    price: prices.customTrip,
    title: "Custom Private Trip",
    description: "Tell us where you want to go.",
    image: images.customTrip,
    alt: "Custom private driver Iceland road trip",
    gallery: ["Private route", "Flexible stops", "Local advice"]
  }
];
