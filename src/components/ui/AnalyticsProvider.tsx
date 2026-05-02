"use client";
import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { track } from "@vercel/analytics";

export default function AnalyticsProvider() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Track page view with referrer + UTM data
    const referrer = document.referrer;
    const utmSource   = searchParams.get("utm_source")   || "";
    const utmMedium   = searchParams.get("utm_medium")   || "";
    const utmCampaign = searchParams.get("utm_campaign") || "";

    const source = utmSource || (referrer ? new URL(referrer).hostname : "direct");

    // Send custom event to Vercel Analytics
    track("page_view", {
      path:     pathname,
      referrer: referrer || "direct",
      source,
      utm_source:   utmSource,
      utm_medium:   utmMedium,
      utm_campaign: utmCampaign,
    });

    // Also log to console in dev
    if (process.env.NODE_ENV === "development") {
      console.log("[Analytics] Page view:", { pathname, source, referrer });
    }
  }, [pathname, searchParams]);

  return null;
}
