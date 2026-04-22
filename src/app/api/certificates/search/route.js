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

        if (type === "regId") {
            const regId = value.toUpperCase();
            certificate = await prisma.certificate.findUnique({
                where: { regId },
                include: { template: true },
            });
        } else if (type === "certId") {
            const certId = value.toUpperCase().replace(/-/g, "");
            if (certId.length === 7) {
                certificate = await prisma.certificate.findFirst({
                    where: {
                        OR: [
                            { regId: { endsWith: certId } },
                            { studentName: { contains: certId, mode: "insensitive" } },
                        ],
                    },
                    include: { template: true },
                });
            }
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
