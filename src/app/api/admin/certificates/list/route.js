import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
    const { unauthorized } = await requireAdminApi();
    if (unauthorized) return unauthorized;

    const certificates = await prisma.certificate.findMany({
        orderBy: { issuedAt: "desc" },
        take: 100,
    });

    return NextResponse.json({ certificates });
}
