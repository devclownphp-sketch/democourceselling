import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const value = searchParams.get("value");

    if (!type || !value) {
        return NextResponse.json({ error: "Type and value are required" }, { status: 400 });
    }

    try {
        let certificate = null;
        const searchValue = value.trim();

        if (type === "regId") {
            certificate = await prisma.certificate.findFirst({
                where: {
                    regId: {
                        equals: searchValue,
                        mode: "insensitive",
                    },
                },
                include: { template: true },
            });
        } else if (type === "certId") {
            const certId = searchValue.toUpperCase().replace(/[^A-Z]/g, "");
            certificate = await prisma.certificate.findFirst({
                where: {
                    certificateId: {
                        equals: certId,
                        mode: "insensitive",
                    },
                },
                include: { template: true },
            });
        }

        if (!certificate) {
            return NextResponse.json({
                found: false,
                error: "Certificate not found. Please check your ID and try again.",
            }, { status: 404 });
        }

        return NextResponse.json({
            found: true,
            certificate: {
                id: certificate.id,
                certificateId: certificate.certificateId,
                regId: certificate.regId,
                studentName: certificate.studentName,
                courseName: certificate.courseName,
                duration: certificate.duration,
                issuedAt: certificate.issuedAt,
                downloadUrl: certificate.downloadUrl,
                templateName: certificate.template?.name || "Default",
            },
        });
    } catch (error) {
        console.error("Certificate search error:", error);
        return NextResponse.json({ error: "Search failed" }, { status: 500 });
    }
}
