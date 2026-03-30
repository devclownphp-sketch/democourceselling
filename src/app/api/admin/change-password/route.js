import bcrypt from "bcryptjs";
import { z } from "zod";
import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
    currentPassword: z.string().min(6),
    newPassword: z.string().min(6),
});

export async function POST(request) {
    const { admin, unauthorized } = await requireAdminApi();
    if (unauthorized) return unauthorized;

    try {
        const payload = await request.json();
        const parsed = schema.safeParse(payload);
        if (!parsed.success) {
            return NextResponse.json({ error: "Invalid password input." }, { status: 400 });
        }

        const dbAdmin = await prisma.admin.findUnique({ where: { id: admin.id } });
        if (!dbAdmin) {
            return NextResponse.json({ error: "Admin not found." }, { status: 404 });
        }

        const ok = await bcrypt.compare(parsed.data.currentPassword, dbAdmin.passwordHash);
        if (!ok) {
            return NextResponse.json({ error: "Current password is incorrect." }, { status: 400 });
        }

        const nextHash = await bcrypt.hash(parsed.data.newPassword, 10);
        await prisma.admin.update({
            where: { id: admin.id },
            data: { passwordHash: nextHash },
        });

        return NextResponse.json({ ok: true });
    } catch {
        return NextResponse.json({ error: "Could not change password." }, { status: 500 });
    }
}
