import bcrypt from "bcryptjs";
import { z } from "zod";
import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

const createAdminSchema = z.object({
    username: z.string().trim().min(3),
    password: z.string().min(6),
});

export async function GET() {
    const { unauthorized } = await requireAdminApi();
    if (unauthorized) return unauthorized;

    const admins = await prisma.admin.findMany({
        orderBy: { createdAt: "desc" },
        select: {
            id: true,
            username: true,
            createdByUsername: true,
            createdAt: true,
        },
    });

    return NextResponse.json({ admins });
}

export async function POST(request) {
    const { admin, unauthorized } = await requireAdminApi();
    if (unauthorized) return unauthorized;

    try {
        const payload = await request.json();
        const parsed = createAdminSchema.safeParse(payload);
        if (!parsed.success) {
            return NextResponse.json({ error: "Username or password is invalid." }, { status: 400 });
        }

        const exists = await prisma.admin.findUnique({ where: { username: parsed.data.username } });
        if (exists) {
            return NextResponse.json({ error: "Username already exists." }, { status: 409 });
        }

        const passwordHash = await bcrypt.hash(parsed.data.password, 10);
        const created = await prisma.admin.create({
            data: {
                username: parsed.data.username,
                passwordHash,
                createdByUsername: admin.username,
            },
            select: {
                id: true,
                username: true,
                createdByUsername: true,
                createdAt: true,
            },
        });

        return NextResponse.json({ ok: true, admin: created });
    } catch {
        return NextResponse.json({ error: "Could not create admin." }, { status: 500 });
    }
}
