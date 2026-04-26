"use strict";

const memoryCache = new Map();
const memoryCacheTTL = new Map();
const rateLimitMap = new Map();

function cleanMemoryCache() {
    const now = Date.now();
    for (const [key, expiry] of memoryCacheTTL) {
        if (now > expiry) {
            memoryCache.delete(key);
            memoryCacheTTL.delete(key);
        }
    }
}
if (typeof setInterval !== "undefined") {
    setInterval(cleanMemoryCache, 60000);
}

export async function cacheGet(key) {
    if (memoryCache.has(key)) {
        const expiry = memoryCacheTTL.get(key);
        if (!expiry || Date.now() < expiry) {
            return memoryCache.get(key);
        }
        memoryCache.delete(key);
        memoryCacheTTL.delete(key);
    }
    return null;
}

export async function cacheSet(key, value, ttlSeconds = 300) {
    memoryCache.set(key, value);
    if (ttlSeconds > 0) {
        memoryCacheTTL.set(key, Date.now() + (ttlSeconds * 1000));
    }
    return true;
}

export async function cacheDel(key) {
    memoryCache.delete(key);
    memoryCacheTTL.delete(key);
    return true;
}

export async function cacheClear(pattern = "*") {
    if (pattern === "*") {
        memoryCache.clear();
        memoryCacheTTL.clear();
    } else {
        const regex = new RegExp(pattern.replace(/\*/g, ".*"));
        for (const key of memoryCache.keys()) {
            if (regex.test(key)) {
                memoryCache.delete(key);
                memoryCacheTTL.delete(key);
            }
        }
    }
    return true;
}

export async function rateLimit(identifier, options = {}) {
    const limit = options.limit || 60;
    const window = options.window || 60;
    const key = options.key || "rl";
    const now = Date.now();
    const windowMs = window * 1000;
    const rateKey = `${key}:${identifier}`;

    const record = rateLimitMap.get(rateKey) || { count: 0, resetAt: now + windowMs };
    if (now > record.resetAt) {
        record.count = 0;
        record.resetAt = now + windowMs;
    }
    record.count++;
    rateLimitMap.set(rateKey, record);

    for (const [k, v] of rateLimitMap) {
        if (now > v.resetAt) rateLimitMap.delete(k);
    }

    return {
        success: record.count <= limit,
        remaining: Math.max(0, limit - record.count),
        reset: Math.ceil((record.resetAt - now) / 1000),
        limit,
    };
}

export const CACHE_TAGS = {
    COURSES: "courses",
    COURSE_DETAIL: "course-detail",
    REVIEWS: "reviews",
    SETTINGS: "settings",
};

export const TTL = {
    SHORT: 60,
    MEDIUM: 300,
    LONG: 3600,
    HOUR: 3600,
    DAY: 86400,
};

export function isRedisConfigured() {
    return false;
}

export function isRedisConnected() {
    return false;
}

export async function withCache(key, fetcher, ttl = 300) {
    const cached = await cacheGet(key);
    if (cached !== null) return cached;
    const data = await fetcher();
    await cacheSet(key, data, ttl);
    return data;
}

export async function withRateLimit(identifier, options, handler) {
    const result = await rateLimit(identifier, options);
    if (!result.success) {
        return { error: "Too many requests", ...result };
    }
    return handler();
}

export default function CacheProvider({ children }) {
    return children;
}

export function useCache() {
    return {
        get: cacheGet,
        set: cacheSet,
        del: cacheDel,
        clear: cacheClear,
        rateLimit,
        withCache,
        withRateLimit,
    };
}
