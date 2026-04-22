import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
    await requireAdminApi();

    const settings = await prisma.marqueeSettings.findUnique({
        where: { id: "default" },
    });

    // Create default if doesn't exist
    if (!settings) {
        const defaultSettings = await prisma.marqueeSettings.create({
            data: {
                id: "default",
                speed: 30,
                direction: "ltr",
                isEnabled: true,
            },
        });
        return NextResponse.json({ settings: defaultSettings });
    }

    return NextResponse.json({ settings });
}

export async function PUT(request) {
    await requireAdminApi();

    try {
        const body = await request.json();
        const { speed, direction, isEnabled } = body;

        const settings = await prisma.marqueeSettings.upsert({
            where: { id: "default" },
            create: {
                id: "default",
                speed: speed ?? 30,
                direction: direction ?? "ltr",
                isEnabled: isEnabled ?? true,
            },
            update: {
                ...(typeof speed === "number" && { speed }),
                ...(direction && { direction }),
                ...(typeof isEnabled === "boolean" && { isEnabled }),
            },
        });

        return NextResponse.json({ settings });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
