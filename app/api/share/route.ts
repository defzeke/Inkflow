import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";
import type { ShareFormat } from "@/libs/share";

const redis = Redis.fromEnv();

const EXPIRY_S = 30 * 24 * 60 * 60; // 30 days

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const content =
      typeof body.content === "string" ? body.content.slice(0, 10_000) : "";
    const format: ShareFormat =
      body.format === "html" ? "html" : "markdown";
    const publisher =
      typeof body.publisher === "string"
        ? body.publisher.slice(0, 100)
        : undefined;

    const id = crypto.randomUUID().replace(/-/g, "").slice(0, 10);
    const expiresAt = Date.now() + EXPIRY_S * 1000;

    await redis.set(
      `share:${id}`,
      { content, format, publisher, expiresAt },
      { ex: EXPIRY_S }
    );

    return NextResponse.json({ id });
  } catch {
    return NextResponse.json(
      { error: "Failed to store share" },
      { status: 500 }
    );
  }
}
