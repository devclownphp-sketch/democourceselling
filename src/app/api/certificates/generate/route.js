import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { generateCertificate, generateCertificateId } from "@/lib/certificate-generator";
import { uploadFile, StorageFolders } from "@/lib/storage";

export async function POST(request) {
    const { unauthorized } = await requireAdminApi();
    if (unauthorized) return unauthorized;

    try {
        const contentType = request.headers.get("content-type") || "";

        let payload;
        let signatureImage = null;
        let stampImage = null;
        let logoImage = null;
        let photoImage = null;

        if (contentType.includes("multipart/form-data")) {
            const formData = await request.formData();
            payload = {
                templateId: formData.get("templateId"),
                studentName: formData.get("studentName") || "",
                courseName: formData.get("courseName") || "",
                courseId: formData.get("courseId") || "",
                regId: formData.get("regId") || "",
                startDate: formData.get("startDate") || "",
                endDate: formData.get("endDate") || "",
                duration: formData.get("duration") || "",
            };
            const signatureFile = formData.get("signatureImage");
            const stampFile = formData.get("stampImage");
            const logoFile = formData.get("logoImage");
            const photoFile = formData.get("photoImage");

            if (signatureFile && signatureFile.size > 0) {
                const buf = Buffer.from(await signatureFile.arrayBuffer());
                const result = await uploadFile(buf, StorageFolders.CERTIFICATES, signatureFile.name, signatureFile.type);
                signatureImage = result.url;
            }
            if (stampFile && stampFile.size > 0) {
                const buf = Buffer.from(await stampFile.arrayBuffer());
                const result = await uploadFile(buf, StorageFolders.CERTIFICATES, stampFile.name, stampFile.type);
                stampImage = result.url;
            }
            if (logoFile && logoFile.size > 0) {
                const buf = Buffer.from(await logoFile.arrayBuffer());
                const result = await uploadFile(buf, StorageFolders.CERTIFICATES, logoFile.name, logoFile.type);
                logoImage = result.url;
            }
            if (photoFile && photoFile.size > 0) {
                const buf = Buffer.from(await photoFile.arrayBuffer());
                const result = await uploadFile(buf, StorageFolders.CERTIFICATES, photoFile.name, photoFile.type);
                photoImage = result.url;
            }
        } else {
            payload = await request.json();
            signatureImage = payload.signatureImage || null;
            stampImage = payload.stampImage || null;
            logoImage = payload.logoImage || null;
            photoImage = payload.photoImage || null;
        }

        if (!payload.templateId) {
            return NextResponse.json({ error: "Template is required" }, { status: 400 });
        }
        if (!payload.regId || payload.regId.trim().length < 5) {
            return NextResponse.json({ error: "Registration ID must be at least 5 characters" }, { status: 400 });
        }

        const template = await prisma.certificateTemplate.findUnique({
            where: { id: payload.templateId },
        });

        if (!template) {
            return NextResponse.json({ error: "Template not found" }, { status: 404 });
        }

        const regId = payload.regId.trim();

        const existingReg = await prisma.certificate.findUnique({ where: { regId } });
        if (existingReg) {
            return NextResponse.json({ error: `Registration ID "${regId}" already exists. Use a different one.` }, { status: 400 });
        }

        let certificateId = generateCertificateId();
        while (await prisma.certificate.findUnique({ where: { certificateId } })) {
            certificateId = generateCertificateId();
        }

        let pdfBytes;
        try {
            pdfBytes = await generateCertificate({
                templateUrl: template.fileUrl || null,
                fields: template.fields || null,
                studentName: payload.studentName || "",
                courseName: payload.courseName || "",
                regId: regId,
                certificateId: certificateId,
                startDate: payload.startDate,
                endDate: payload.endDate,
                duration: payload.duration || "",
                signatureImage: signatureImage,
                stampImage: stampImage,
                logoImage: logoImage,
                photoImage: photoImage,
            });
        } catch (genErr) {
            console.error("Certificate generation error:", genErr);
            return NextResponse.json({ error: "Failed to generate certificate PDF: " + (genErr.message || "Unknown error") }, { status: 500 });
        }

        const result = await uploadFile(
            Buffer.from(pdfBytes),
            StorageFolders.CERTIFICATES,
            `certificate-${certificateId}.pdf`,
            "application/pdf"
        );

        const certificate = await prisma.certificate.create({
            data: {
                certificateId: certificateId,
                templateId: payload.templateId,
                studentName: payload.studentName || "",
                courseName: payload.courseName || "",
                courseId: payload.courseId || null,
                regId: regId,
                startDate: payload.startDate ? new Date(payload.startDate) : new Date(),
                endDate: payload.endDate ? new Date(payload.endDate) : new Date(),
                duration: payload.duration || "",
                downloadUrl: result.url,
            },
        });

        return NextResponse.json({ ok: true, certificate });
    } catch (error) {
        console.error("Certificate generation error:", error);
        return NextResponse.json({ error: error?.message || "Failed to generate certificate" }, { status: 500 });
    }
}
