import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";

export async function POST(request) {
    try {
        // Check admin authentication
        const token = request.cookies.get("admin_token")?.value;
        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get("file");
        const courseId = formData.get("courseId");

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        if (file.type !== "application/pdf") {
            return NextResponse.json({ error: "Only PDF files are allowed" }, { status: 400 });
        }

        // Max size: 50MB
        const maxSize = 50 * 1024 * 1024;
        if (file.size > maxSize) {
            return NextResponse.json({ error: "File size must be less than 50MB" }, { status: 400 });
        }

        // Create uploads directory if it doesn't exist
        const uploadDir = path.join(process.cwd(), "public", "uploads", "pdfs");
        await mkdir(uploadDir, { recursive: true });

        // Generate unique filename
        const timestamp = Date.now();
        const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
        const filename = `${timestamp}-${originalName}`;
        const filepath = path.join(uploadDir, filename);

        // Write file
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        await writeFile(filepath, buffer);

        // Create PDF record in database
        const pdf = await prisma.coursePDF.create({
            data: {
                courseId: courseId || "",
                name: file.name,
                url: `/uploads/pdfs/${filename}`,
                size: file.size,
                sortOrder: 0,
            },
        });

        return NextResponse.json({ pdf, success: true });
    } catch (error) {
        console.error("PDF upload error:", error);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}
