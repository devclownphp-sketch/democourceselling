import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const createSchema = z.object({
    username: z.string().trim().min(3, "Username must be at least 3 characters").max(30),
    password: z.string().min(6, "Password must be at least 6 characters"),
    roleId: z.string().trim().optional().nullable(),
    sessionTimeoutMin: z.number().int().min(1).max(60).default(30),
    maxSessions: z.number().int().min(1).max(5).default(2),
});

export async function GET() {
    const { admin, unauthorized } = await requireAdminApi();
    if (unauthorized) return unauthorized;

    const subadmins = await prisma.subAdmin.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            role: true,
            sessions: {
                where: { expiresAt: { gt: new Date() } },
            },
        },
    });

    return NextResponse.json({ subadmins });
}

export async function POST(request) {
    const { admin, unauthorized } = await requireAdminApi();
    if (unauthorized) return unauthorized;

    if (admin.username !== "clown") {
        return NextResponse.json({ error: "Only main admin can create subadmins" }, { status: 403 });
    }

    try {
        const payload = await request.json();
        const parsed = createSchema.parse(payload);

        const existing = await prisma.subAdmin.findUnique({
            where: { username: parsed.username },
        });

        if (existing) {
            return NextResponse.json({ error: "Username already exists" }, { status: 400 });
        }

        const passwordHash = await bcrypt.hash(parsed.password, 12);

        const subadmin = await prisma.subAdmin.create({
            data: {
                username: parsed.username,
                passwordHash: passwordHash,
                roleId: parsed.roleId || null,
                sessionTimeoutMin: parsed.sessionTimeoutMin,
                maxSessions: parsed.maxSessions,
            },
            include: { role: true },
        });

        return NextResponse.json({ ok: true, subadmin });
    } catch (error) {
        if (error?.issues) {
            const firstIssue = error.issues[0];
            return NextResponse.json({ error: `${firstIssue?.path?.[0]}: ${firstIssue?.message}` }, { status: 400 });
        }
        return NextResponse.json({ error: error?.message || "Failed to create subadmin" }, { status: 400 });
    }
}