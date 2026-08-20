import type { MetadataRoute } from "next";
import { getPublishedAnnouncements } from "@/lib/data";

const STATIC_ROUTES = [
  "",
  "/services",
  "/services/request",
  "/services/track",
  "/report",
  "/report/track",
  "/announcements",
  "/officials",
  "/puroks",
  "/contact",
  "/emergency",
  "/health",
  "/education",
  "/senior-citizens",
  "/youth",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const announcements = await getPublishedAnnouncements(200);

  return [
    ...STATIC_ROUTES.map((route) => ({
      url: `${base}${route}`,
      lastModified: new Date(),
    })),
    ...announcements.map((a) => ({
      url: `${base}/announcements/${a.slug}`,
      lastModified: a.updatedAt,
    })),
  ];
}
