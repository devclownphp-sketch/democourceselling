import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminApi } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { defaultBusinessProfile } from "@/lib/business-profile";

const businessProfileSchema = z.object({
    businessName: z.string().trim().min(2, "Business name is required"),
    supportEmail: z.string().trim().email("Valid email is required"),
    supportPhone: z.string().trim().min(6, "Phone is required"),
    addressLine: z.string().trim().min(5, "Address is required"),
    contactHeadline: z.string().trim().min(3, "Headline is required"),
    contactSubtext: z.string().trim().min(5, "Subtext is required"),
    mapEmbedUrl: z.string().trim().optional().default(""),
    twitterUrl: z.string().trim().optional().default(""),
    facebookUrl: z.string().trim().optional().default(""),
    instagramUrl: z.string().trim().optional().default(""),
    linkedinUrl: z.string().trim().optional().default(""),
    youtubeUrl: z.string().trim().optional().default(""),
});

export async function GET() {
    const { unauthorized } = await requireAdminApi();
    if (unauthorized) return unauthorized;

    const profile = await prisma.businessProfile.upsert({
        where: { key: "primary" },
        update: {},
        create: {
            key: "primary",
            ...defaultBusinessProfile,
        },
    });

    return NextResponse.json({ profile });
}

export async function PUT(request) {
    const { unauthorized } = await requireAdminApi();
    if (unauthorized) return unauthorized;

    try {
        const payload = await request.json();
        const parsed = businessProfileSchema.parse(payload);

        const profile = await prisma.businessProfile.upsert({
            where: { key: "primary" },
            update: parsed,
            create: {
                key: "primary",
                ...defaultBusinessProfile,
                ...parsed,
            },
        });

        return NextResponse.json({ ok: true, profile });
    } catch (error) {
        if (error?.issues) {
            const firstIssue = error.issues[0];
            return NextResponse.json({ error: firstIssue?.message || "Validation failed." }, { status: 400 });
        }

        return NextResponse.json({ error: error?.message || "Could not update business profile." }, { status: 400 });
    }
}
