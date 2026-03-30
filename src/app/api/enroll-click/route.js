import { z } from "zod";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const schema = z.object({
    courseId: z.string().trim().min(1),
    path: z.string().trim().optional(),
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

        await prisma.course.update({
            where: { id: parsed.data.courseId },
            data: {
                enrollClicks: {
                    increment: 1,
                },
            },
        });

        const { ipAddress, userAgent } = getRequestMeta(request);
        await prisma.metricEvent.create({
            data: {
                type: "ENROLL",
                courseId: parsed.data.courseId,
                path: parsed.data.path || "/",
                ipAddress,
                userAgent,
            },
        });

        return NextResponse.json({ ok: true });
    } catch {
        return NextResponse.json({ error: "Could not track enroll event." }, { status: 500 });
    }
}
