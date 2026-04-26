import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/admin-auth";
import { uploadFile, StorageFolders } from "@/lib/storage";
import { unlink } from "fs/promises";
import path from "path";

export async function POST(request) {
    const { unauthorized } = await requireAdminApi();
    if (unauthorized) return unauthorized;

    try {
        const formData = await request.formData();
        const file = formData.get("file");
        const courseId = formData.get("courseId");

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        if (file.type !== "application/pdf") {
            return NextResponse.json({ error: "Only PDF files are allowed" }, { status: 400 });
        }

        const maxSize = 50 * 1024 * 1024;
        if (file.size > maxSize) {
            return NextResponse.json({ error: "File size must be less than 50MB" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const result = await uploadFile(buffer, StorageFolders.COURSE_PDFS, file.name, "application/pdf");

        let createdPdf;

        if (courseId && courseId.trim() !== "") {
            const existingPdfs = await prisma.coursePDF.findMany({
                where: { courseId: courseId },
                orderBy: { createdAt: "desc" },
            });

            for (const existingPdf of existingPdfs) {
                try {
                    const filepath = path.join(process.cwd(), "public", existingPdf.url);
                    await unlink(filepath);
                } catch (err) {
                    console.warn("Could not delete old file:", err.message);
                }
            }

            await prisma.coursePDF.deleteMany({
                where: { courseId: courseId },
            });

            createdPdf = await prisma.coursePDF.create({
                data: {
                    courseId: courseId,
                    name: file.name,
                    url: result.url,
                    size: file.size,
                    sortOrder: 0,
                },
            });
        } else {
            createdPdf = await prisma.coursePDF.create({
                data: {
                    name: file.name,
                    url: result.url,
                    size: file.size,
                    sortOrder: 0,
                },
            });
        }

        return NextResponse.json({
            pdf: createdPdf,
            success: true,
            storageProvider: result.provider
        });
    } catch (error) {
        console.error("PDF upload error:", error);
        return NextResponse.json({ error: error.message || "Upload failed" }, { status: 500 });
    }
}