import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const DEFAULT_COLORS = {
    primaryColor: "#2563eb",
    secondaryColor: "#0ea5e9",
    accentColor: "#8b5cf6",
    backgroundColor: "#ffffff",
    textColor: "#0f172a",
    headingColor: "#000000",
    cardBackground: "#ffffff",
    cardBorder: "#e2e8f0",
    borderColor: "#e2e8f0",
    footerBackground: "#000000",
    footerText: "#ffffff",
    footerAccent: "#ffd400",
    badgeSuccess: "#22c55e",
    badgeWarning: "#eab308",
    badgeInfo: "#3b82f6",
    badgeError: "#ef4444",
    marqueeBackground: "#ffd400",
    heroBackground: "#000000",
    navbarBackground: "#ffffff",
};

export async function GET() {
    try {
        const settings = await prisma.siteSettings.findUnique({
            where: { id: "default" },
        });

        let colors = DEFAULT_COLORS;
        if (settings?.colorSettings) {
            try {
                colors = { ...DEFAULT_COLORS, ...settings.colorSettings };
            } catch (e) {
                console.error("Failed to parse color settings:", e);
            }
        }

        return NextResponse.json({ colors });
    } catch (error) {
        console.error("Failed to get colors:", error);
        return NextResponse.json({ error: "Failed to get colors" }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        const token = request.cookies.get("admin_token")?.value;
        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { colors } = await request.json();

        const updated = await prisma.siteSettings.upsert({
            where: { id: "default" },
            update: { colorSettings: colors },
            create: {
                id: "default",
                colorSettings: colors,
            },
        });

        return NextResponse.json({ success: true, colors: updated.colorSettings });
    } catch (error) {
        console.error("Failed to save colors:", error);
        return NextResponse.json({ error: "Failed to save colors" }, { status: 500 });
    }
}
