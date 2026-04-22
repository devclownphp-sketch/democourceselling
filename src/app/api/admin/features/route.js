import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
    await requireAdminApi();

    const features = await prisma.feature.findMany({
        orderBy: { sortOrder: "asc" },
    });

    return NextResponse.json({ features });
}

export async function POST(request) {
    await requireAdminApi();

    try {
        const body = await request.json();
        const { icon = "check", title, description, color = "#6366f1", sortOrder = 0 } = body;

        if (!title || !description) {
            return NextResponse.json({ error: "Title and description are required" }, { status: 400 });
        }

        const feature = await prisma.feature.create({
            data: { icon, title, description, color, sortOrder },
        });

        return NextResponse.json({ feature });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
