import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
    await requireAdminApi();

    const settings = await prisma.siteSettings.findUnique({
        where: { id: "default" },
    });

    return NextResponse.json({ settings });
}

export async function PUT(request) {
    await requireAdminApi();

    try {
        const body = await request.json();
        const settings = await prisma.siteSettings.upsert({
            where: { id: "default" },
            update: body,
            create: { id: "default", ...body },
        });

        return NextResponse.json({ settings });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}