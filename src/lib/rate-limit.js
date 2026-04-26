import { NextResponse } from "next/server";
import { rateLimit as rl } from "./cache.js";

export async function rateLimit(request, options = {}) {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
        || request.headers.get("x-real-ip")
        || "anonymous";

    const result = await rl(ip, options);

    const response = NextResponse.next();

    response.headers.set("X-RateLimit-Limit", String(result.limit));
    response.headers.set("X-RateLimit-Remaining", String(result.remaining));
    response.headers.set("X-RateLimit-Reset", String(result.reset));

    if (!result.success) {
        return NextResponse.json(
            {
                error: "Too many requests. Please try again later.",
                retryAfter: result.reset,
            },
            {
                status: 429,
                headers: {
                    "Retry-After": String(result.reset),
                    "X-RateLimit-Limit": String(result.limit),
                    "X-RateLimit-Remaining": "0",
                    "X-RateLimit-Reset": String(result.reset),
                },
            }
        );
    }

    return response;
}

export function withRateLimit(options = {}) {
    const defaults = {
        limit: 60,
        window: 60,
        key: "api",
    };
    const opts = { ...defaults, ...options };

    return async function handler(request) {
        return rateLimit(request, opts);
    };
}