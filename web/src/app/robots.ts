import type { MetadataRoute } from "next";
import { meta } from "@/lib/content";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${meta.siteUrl}/sitemap.xml`,
    host: meta.siteUrl,
  };
}
