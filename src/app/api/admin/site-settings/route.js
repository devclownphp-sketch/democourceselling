import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
const ALLOWED_FIELDS = new Set([
    "primaryColor", "secondaryColor", "accentColor", "backgroundColor", "textColor",
    "colorSettings", "themeMode", "sessionTimeoutMin", "maxSessions",
    "heroTitle", "heroSubtitle", "heroCtaText",
    "statsStudentsCount", "statsRating", "statsMonthly",
    "footerCopyright", "googleReviewUrl",
    "storageProvider", "storageConfig",
]);

function sanitizeBody(body) {
    const clean = {};
    for (const [key, value] of Object.entries(body)) {
        if (ALLOWED_FIELDS.has(key)) {
            clean[key] = value;
        }
    }
    delete clean.id;
    delete clean.createdAt;
    delete clean.updatedAt;
    return clean;
}

export async function GET() {
    const { unauthorized } = await requireAdminApi();
    if (unauthorized) return unauthorized;

    const settings = await prisma.siteSettings.findUnique({
        where: { id: "default" },
    });

    return NextResponse.json({ settings });
}

export async function PUT(request) {
    const { unauthorized } = await requireAdminApi();
    if (unauthorized) return unauthorized;

    try {
        const body = await request.json();
        const cleanBody = sanitizeBody(body);

        if (Object.keys(cleanBody).length === 0) {
            return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
        }

        const settings = await prisma.siteSettings.upsert({
            where: { id: "default" },
            update: cleanBody,
            create: { id: "default", ...cleanBody },
        });

        return NextResponse.json({ settings });
    } catch (error) {
        console.error("Site settings update error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}