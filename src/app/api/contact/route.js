import { z } from "zod";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const contactSchema = z.object({
    name: z.string().trim().min(2),
    email: z.string().trim().email(),
    phone: z.string().trim().min(8),
    message: z.string().trim().min(10),
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
        const parsed = contactSchema.safeParse(payload);
        if (!parsed.success) {
            return NextResponse.json({ error: "Invalid form details." }, { status: 400 });
        }

        await prisma.contactSubmission.create({ data: parsed.data });

        const { ipAddress, userAgent } = getRequestMeta(request);
        await prisma.metricEvent.create({
            data: {
                type: "CONTACT",
                path: "/contact",
                ipAddress,
                userAgent,
            },
        });

        return NextResponse.json({ ok: true });
    } catch {
        return NextResponse.json({ error: "Could not submit contact form." }, { status: 500 });
    }
}
