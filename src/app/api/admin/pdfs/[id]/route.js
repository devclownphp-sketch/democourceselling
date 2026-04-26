import { NextResponse } from "next/server";
import { unlink } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/admin-auth";

export async function DELETE(request, { params }) {
    const { unauthorized } = await requireAdminApi();
    if (unauthorized) return unauthorized;

    try {
        const { id } = await params;
        const pdfId = parseInt(id, 10);

        if (isNaN(pdfId)) {
            return NextResponse.json({ error: "Invalid PDF ID" }, { status: 400 });
        }

        const pdf = await prisma.coursePDF.findUnique({
            where: { id: pdfId },
        });

        if (!pdf) {
            return NextResponse.json({ error: "PDF not found" }, { status: 404 });
        }
        const filepath = path.join(process.cwd(), "public", pdf.url);
        try {
            await unlink(filepath);
        } catch (err) {
            console.warn("File not found on disk:", err.message);
        }

        await prisma.coursePDF.delete({
            where: { id: pdfId },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("PDF delete error:", error);
        return NextResponse.json({ error: error.message || "Delete failed" }, { status: 500 });
    }
}
