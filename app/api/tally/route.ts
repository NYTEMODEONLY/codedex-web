import { NextResponse } from "next/server";
import { clientIp, redis, tallyLimiter, TALLY_KEY } from "@/lib/tally";

// Tally is a public counter — anyone can read it. Allow CORS so the
// counter could be embedded on nytemode.com or partner sites.
//
// Cache is intentionally tight — counter is meant to feel live.
// Browser cache disabled; CDN gets a 3-second window for burst smoothing.
const READ_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Cache-Control":
    "public, max-age=0, s-maxage=3, stale-while-revalidate=6",
};

export async function GET(): Promise<NextResponse> {
  try {
    const total = (await redis.get<number>(TALLY_KEY)) ?? 0;
    return NextResponse.json({ total }, { headers: READ_HEADERS });
  } catch (err) {
    console.error("[tally] GET failed:", err);
    return NextResponse.json(
      { total: 0, error: "tally-unavailable" },
      { status: 503, headers: READ_HEADERS }
    );
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const ip = clientIp(request);
    const { success } = await tallyLimiter.limit(ip);
    if (!success) {
      // Rate-limited — return current total without incrementing.
      const total = (await redis.get<number>(TALLY_KEY)) ?? 0;
      return NextResponse.json(
        { total, throttled: true },
        { status: 429, headers: READ_HEADERS }
      );
    }
    const total = await redis.incr(TALLY_KEY);
    return NextResponse.json({ total }, { headers: READ_HEADERS });
  } catch (err) {
    console.error("[tally] POST failed:", err);
    return NextResponse.json(
      { total: 0, error: "tally-unavailable" },
      { status: 503, headers: READ_HEADERS }
    );
  }
}

// Allow cross-origin GETs/POSTs from anywhere (the counter is public).
export async function OPTIONS(): Promise<Response> {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, User-Agent",
      "Access-Control-Max-Age": "86400",
    },
  });
}
