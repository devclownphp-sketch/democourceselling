import { NextResponse } from "next/server";
import { unlink } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";

export async function DELETE(request, { params }) {
    try {
        // Check admin authentication
        const token = request.cookies.get("admin_token")?.value;
        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = params;

        // Get PDF record
        const pdf = await prisma.coursePDF.findUnique({
            where: { id },
        });

        if (!pdf) {
            return NextResponse.json({ error: "PDF not found" }, { status: 404 });
        }

        // Delete file from disk
        const filepath = path.join(process.cwd(), "public", pdf.url);
        try {
            await unlink(filepath);
        } catch (err) {
            console.warn("File not found on disk:", err.message);
        }

        // Delete from database
        await prisma.coursePDF.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("PDF delete error:", error);
        return NextResponse.json({ error: "Delete failed" }, { status: 500 });
    }
}
