import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const courses = await prisma.course.findMany({
            where: { isActive: true },
            select: { id: true, title: true, slug: true },
            orderBy: { title: "asc" },
        });

        return NextResponse.json({ courses });
    } catch {
        return NextResponse.json({ courses: [] }, { status: 500 });
    }
}
