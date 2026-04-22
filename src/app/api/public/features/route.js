import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const features = await prisma.feature.findMany({
            where: { isActive: true },
            orderBy: { sortOrder: "asc" },
        });
        return NextResponse.json({ features });
    } catch (error) {
        return NextResponse.json({ features: [] }, { status: 200 });
    }
}
