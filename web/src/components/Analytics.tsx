import Script from "next/script";
import { meta } from "@/lib/content";

/**
 * Privacy-friendly, cookieless analytics (GoatCounter).
 * Renders nothing until `meta.goatCounterCode` is set, so there is zero
 * network cost and no tracking script until analytics is deliberately enabled.
 * See the setup note on `meta.goatCounterCode` in src/lib/content.ts.
 */
export function Analytics() {
  const code = meta.goatCounterCode;
  if (!code) return null;

  return (
    <Script
      data-goatcounter={`https://${code}.goatcounter.com/count`}
      src="https://gc.zgo.at/count.js"
      strategy="afterInteractive"
    />
  );
}
