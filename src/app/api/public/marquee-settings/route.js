import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const settings = await prisma.marqueeSettings.findUnique({
            where: { id: "default" },
        });

        return NextResponse.json({
            settings: settings || { speed: 30, direction: "ltr", isEnabled: true }
        });
    } catch (error) {
        return NextResponse.json({
            settings: { speed: 30, direction: "ltr", isEnabled: true }
        }, { status: 200 });
    }
}
