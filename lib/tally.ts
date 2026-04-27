// Server-only — DO NOT import from client components.
// Provides the Upstash Redis client + per-IP rate limiter for the
// global tally counter.

import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

export const TALLY_KEY = "codedex:total";

export const redis = Redis.fromEnv();

// Generous limit: 60 captures per minute per IP. Real scanning peaks
// at maybe 1-2/sec sustained on a fast scanner — 1/sec for a full
// minute = 60. Anything beyond that is almost certainly a bot.
export const tallyLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(60, "1 m"),
  analytics: false,
  prefix: "codedex:rl",
});

export function clientIp(request: Request): string {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  const xri = request.headers.get("x-real-ip");
  if (xri) return xri.trim();
  return "0.0.0.0";
}
