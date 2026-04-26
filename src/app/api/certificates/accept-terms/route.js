import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request) {
    try {
        const { regId } = await request.json();

        if (!regId) {
            return NextResponse.json({ error: "Registration ID required" }, { status: 400 });
        }

        const certificate = await prisma.certificate.findUnique({
            where: { regId: regId.trim() },
        });

        if (!certificate) {
            return NextResponse.json({ error: "Certificate not found" }, { status: 404 });
        }

        await prisma.certificate.update({
            where: { id: certificate.id },
            data: { termsAccepted: true, termsAcceptedAt: new Date() },
        });

        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error("Accept terms error:", error);
        return NextResponse.json({ ok: true });
    }
}
