import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(request) {
    const { admin, unauthorized } = await requireAdminApi();
    if (unauthorized) return unauthorized;

    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "Certificate ID required" }, { status: 400 });
        }

        await prisma.certificate.delete({ where: { id } });
        return NextResponse.json({ ok: true });
    } catch {
        return NextResponse.json({ error: "Failed to delete certificate" }, { status: 400 });
    }
}

export async function GET(request) {
    const { admin, unauthorized } = await requireAdminApi();
    if (unauthorized) return unauthorized;

    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get("q")?.trim() || "";
        const limit = parseInt(searchParams.get("limit") || "50");

        const where = query
            ? {
                  OR: [
                      { studentName: { contains: query, mode: "insensitive" } },
                      { courseName: { contains: query, mode: "insensitive" } },
                      { regId: { contains: query, mode: "insensitive" } },
                      { id: { contains: query } },
                  ],
              }
            : {};

        const certificates = await prisma.certificate.findMany({
            where,
            orderBy: { issuedAt: "desc" },
            take: limit,
            include: { template: true },
        });

        return NextResponse.json({ certificates });
    } catch (error) {
        return NextResponse.json({ error: error.message || "Search failed" }, { status: 400 });
    }
}
