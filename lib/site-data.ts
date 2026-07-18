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
    description: "Private Golden Circle taxi tour to Þingvellir, Geysir and Gullfoss.",
    image: images.goldenCircle,
    alt: "Golden Circle taxi tour from Reykjavík to Þingvellir, Geysir and Gullfoss",
    gallery: ["Þingvellir", "Geysir", "Gullfoss"]
  },
  {
    price: prices.southCoast,
    title: "South Coast",
    description: "South Coast private tour with waterfalls, glaciers and black sand beaches.",
    image: images.southCoast,
    alt: "South Coast private taxi tour in Iceland with waterfalls and black sand beach",
    gallery: ["Seljalandsfoss", "Skógafoss", "Reynisfjara", "Vík"]
  },
  {
    price: prices.silverCircle,
    title: "Silver Circle",
    description: "Private taxi tour to Silver Circle waterfalls, hot springs and countryside.",
    image: images.silverCircle,
    alt: "Silver Circle private taxi tour to waterfalls and hot springs in Iceland",
    gallery: ["Hraunfossar", "Barnafoss", "Deildartunguhver"]
  },
  {
    price: prices.snaefellsnes,
    title: "Snæfellsnes Peninsula",
    description: "Private Snæfellsnes Peninsula tour with mountains, coast and lava fields.",
    image: images.snaefellsnes,
    alt: "Snæfellsnes Peninsula private taxi tour with Iceland coast and mountains",
    gallery: ["Kirkjufell", "Arnarstapi", "Djúpalónssandur"]
  },
  {
    price: prices.blueLagoon,
    title: "Blue Lagoon Return",
    description: "Blue Lagoon taxi return ride from Reykjavík with private driver service.",
    image: images.blueLagoon,
    alt: "Blue Lagoon taxi return transfer from Reykjavík in Iceland",
    gallery: ["Blue Lagoon", "Gunnuhver", "Bridge Between Continents"]
  },
  {
    price: prices.reykjanesLavaTour,
    title: "Grindavík / Reykjanes Lava Tour",
    description: "Private Reykjanes taxi tour to lava fields, geothermal areas and coast.",
    image: images.reykjanes,
    alt: "Reykjanes and Grindavík lava private taxi tour in Iceland",
    gallery: ["Grindavík", "Gunnuhver", "Bridge Between Continents", "Lava fields"]
  },
  {
    price: prices.reykjavikSightseeing,
    title: "Reykjavík Sightseeing",
    description: "Private Reykjavík taxi sightseeing around city landmarks and viewpoints.",
    image: images.reykjavik,
    alt: "Reykjavík taxi sightseeing private tour around city highlights",
    gallery: ["Hallgrímskirkja", "Harpa", "Sun Voyager", "City viewpoints"]
  },
  {
    price: prices.cityCenter,
    title: "City Center",
    description: "Quick Reykjavík taxi transfer for city-center pickup and drop-off.",
    image: images.reykjavik,
    alt: "Reykjavík city center taxi transfer with private driver",
    gallery: ["Downtown Reykjavík", "City Center", "Local pickup"]
  },
  {
    price: prices.hvammsvikOneWay,
    title: "Hvammsvík One Way",
    description: "Private taxi one-way ride from Reykjavík to Hvammsvík.",
    image: images.reykjavik,
    alt: "Hvammsvík one way private taxi from Reykjavík Iceland",
    gallery: ["Hvammsvík", "Scenic route", "Private ride"]
  },
  {
    price: prices.hvammsvikReturn,
    title: "Hvammsvík Return",
    description: "Private Hvammsvík return taxi ride from Reykjavík with flexible timing.",
    image: images.reykjavik,
    alt: "Hvammsvík return private taxi from Reykjavík Iceland",
    gallery: ["Hvammsvík", "Return ride", "4 hours total"]
  },
  {
    price: prices.customTrip,
    title: "Custom Private Trip",
    description: "Plan a custom private taxi trip in Iceland with pickup and destination.",
    image: images.customTrip,
    alt: "Custom private taxi Iceland road trip with licensed driver",
    gallery: ["Private route", "Flexible stops", "Local advice"]
  }
];
