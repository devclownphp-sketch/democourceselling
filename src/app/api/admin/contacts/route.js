import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
export async function DELETE(request) {
    const { unauthorized } = await requireAdminApi();
    if (unauthorized) return unauthorized;

    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");
        const deleteAll = searchParams.get("all") === "true";

        if (deleteAll) {
            const result = await prisma.contactSubmission.deleteMany({});
            return NextResponse.json({ success: true, deleted: result.count });
        }

        if (!id) {
            return NextResponse.json({ error: "Missing id parameter" }, { status: 400 });
        }

        await prisma.contactSubmission.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Delete contact error:", error);
        return NextResponse.json({ error: "Failed to delete contact" }, { status: 500 });
    }
}
