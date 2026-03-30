import { z } from "zod";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const schema = z.object({
    path: z.string().trim().min(1),
});

function getRequestMeta(request) {
    const forwarded = request.headers.get("x-forwarded-for") || "";
    const ipAddress = forwarded.split(",")[0]?.trim() || null;
    const userAgent = request.headers.get("user-agent") || null;
    return { ipAddress, userAgent };
}

export async function POST(request) {
    try {
        const payload = await request.json();
        const parsed = schema.safeParse(payload);
        if (!parsed.success) {
            return NextResponse.json({ error: "Invalid request." }, { status: 400 });
        }

        const { ipAddress, userAgent } = getRequestMeta(request);
        await prisma.metricEvent.create({
            data: {
                type: "VISIT",
                path: parsed.data.path,
                ipAddress,
                userAgent,
            },
        });

        return NextResponse.json({ ok: true });
    } catch {
        return NextResponse.json({ error: "Could not track visit." }, { status: 500 });
    }
}
