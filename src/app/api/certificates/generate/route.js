import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateCertificate, generateRegId } from "@/lib/certificate-generator";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { z } from "zod";
import { uploadFile, isS3Configured, generateS3Key } from "@/lib/s3";

const generateSchema = z.object({
    templateId: z.string().trim().min(1, "Template is required"),
    studentName: z.string().trim().min(2, "Student name is required"),
    courseName: z.string().trim().min(1, "Course name is required"),
    courseId: z.string().trim().optional().nullable(),
    startDate: z.string().or(z.date()),
    endDate: z.string().or(z.date()),
    duration: z.string().optional().default(""),
});

export async function POST(request) {
    try {
        const payload = await request.json();
        const parsed = generateSchema.parse(payload);

        const template = await prisma.certificateTemplate.findUnique({
            where: { id: parsed.templateId },
        });

        if (!template) {
            return NextResponse.json({ error: "Template not found" }, { status: 404 });
        }

        const regId = generateRegId();

        const pdfBytes = await generateCertificate({
            templateUrl: template.fileUrl || null,
            fields: template.fields || null,
            studentName: parsed.studentName,
            courseName: parsed.courseName,
            regId: regId,
            startDate: parsed.startDate,
            endDate: parsed.endDate,
            duration: parsed.duration,
        });

        let downloadUrl;

        if (isS3Configured()) {
            const s3Key = generateS3Key("certificates", `certificate-${regId}.pdf`);
            downloadUrl = await uploadFile(pdfBytes, s3Key, "application/pdf");
        } else {
            const uploadDir = path.join(process.cwd(), "public", "uploads", "certificates");
            if (!existsSync(uploadDir)) {
                await mkdir(uploadDir, { recursive: true });
            }
            const filename = `certificate-${regId}.pdf`;
            const filepath = path.join(uploadDir, filename);
            await writeFile(filepath, pdfBytes);
            downloadUrl = `/uploads/certificates/${filename}`;
        }

        const certificate = await prisma.certificate.create({
            data: {
                templateId: parsed.templateId,
                studentName: parsed.studentName,
                courseName: parsed.courseName,
                courseId: parsed.courseId || null,
                regId: regId,
                startDate: new Date(parsed.startDate),
                endDate: new Date(parsed.endDate),
                duration: parsed.duration,
                downloadUrl: downloadUrl,
            },
        });

        return NextResponse.json({ ok: true, certificate });
    } catch (error) {
        if (error?.issues) {
            const firstIssue = error.issues[0];
            return NextResponse.json({ error: `${firstIssue?.path?.[0]}: ${firstIssue?.message}` }, { status: 400 });
        }
        console.error("Certificate generation error:", error);
        return NextResponse.json({ error: error?.message || "Failed to generate certificate" }, { status: 500 });
    }
}
