import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

const routes = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/contact", changeFrequency: "weekly", priority: 0.85 },
  { path: "/privacy-policy", changeFrequency: "monthly", priority: 0.45 },
  { path: "/terms-and-conditions", changeFrequency: "monthly", priority: 0.45 },
  { path: "/cancellation-policy", changeFrequency: "monthly", priority: 0.45 }
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: absoluteUrl(route.path),
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority
  }));
}
