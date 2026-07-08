import type { MetadataRoute } from "next";
import { SITE_URL } from "@/content/site";

// AI answer/search + training crawlers. We explicitly ALLOW them: being crawlable is a
// prerequisite for citations in ChatGPT, Perplexity, Google AI Mode/Overviews and Gemini.
// (Reminder: also confirm no Vercel WAF/bot rule silently blocks these user agents.)
const AI_BOTS = [
  "OAI-SearchBot",
  "ChatGPT-User",
  "GPTBot",
  "PerplexityBot",
  "Perplexity-User",
  "Claude-SearchBot",
  "Claude-User",
  "ClaudeBot",
  "Google-Extended",
  "Applebot-Extended",
  "CCBot",
  "Amazonbot",
  "meta-externalagent",
];

export default function robots(): MetadataRoute.Robots {
  // Keep faceted query URLs crawlable but consolidated via per-page canonicals.
  // Only genuinely thin/private surfaces are disallowed.
  const disallow = ["/ulubione", "/kasa", "/api/"];
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow },
      { userAgent: AI_BOTS, allow: "/", disallow },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: new URL(SITE_URL).host,
  };
}
