import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

const DEFAULT_SETTINGS = {
    speed: 30,
    direction: "ltr",
    isEnabled: true,
    minReviewsForAuto: 1,
};

export async function GET() {
    await requireAdminApi();

    const settings = await prisma.marqueeSettings.findUnique({
        where: { id: "default" },
    });

    return NextResponse.json({ settings: settings || DEFAULT_SETTINGS });
}

export async function PUT(request) {
    await requireAdminApi();

    try {
        const body = await request.json();
        const { speed, direction, isEnabled, minReviewsForAuto } = body;

        const settings = await prisma.marqueeSettings.upsert({
            where: { id: "default" },
            create: {
                id: "default",
                speed: speed ?? 30,
                direction: direction ?? "ltr",
                isEnabled: isEnabled ?? true,
                minReviewsForAuto: minReviewsForAuto ?? 1,
            },
            update: {
                ...(typeof speed === "number" && { speed }),
                ...(direction && { direction }),
                ...(typeof isEnabled === "boolean" && { isEnabled }),
                ...(typeof minReviewsForAuto === "number" && { minReviewsForAuto }),
            },
        });

        return NextResponse.json({ settings });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
