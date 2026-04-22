import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const settings = await prisma.siteSettings.findUnique({
            where: { id: "default" },
        });

        return NextResponse.json({
            settings: settings || {
                themeMode: "light",
                pdfViewer: "google",
            },
        });
    } catch (error) {
        return NextResponse.json(
            { settings: { themeMode: "light", pdfViewer: "google" } },
            { status: 200 }
        );
    }
}
