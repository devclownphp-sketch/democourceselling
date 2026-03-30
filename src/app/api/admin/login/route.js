import { z } from "zod";
import { NextResponse } from "next/server";
import {
    attachSessionCookie,
    createAdminIfMissing,
    createAdminSession,
    verifyAdminCredentials,
} from "@/lib/admin-auth";

const loginSchema = z.object({
    username: z.string().trim().min(3),
    password: z.string().min(6),
});

export async function POST(request) {
    try {
        await createAdminIfMissing();

        const payload = await request.json();
        const parsed = loginSchema.safeParse(payload);
        if (!parsed.success) {
            return NextResponse.json({ error: "Invalid username or password format." }, { status: 400 });
        }

        const admin = await verifyAdminCredentials(parsed.data.username, parsed.data.password);
        if (!admin) {
            return NextResponse.json({ error: "Invalid username or password." }, { status: 401 });
        }

        const { token, expiresAt } = await createAdminSession(admin.id);
        const response = NextResponse.json({ ok: true, username: admin.username });
        attachSessionCookie(response, token, expiresAt);
        return response;
    } catch {
        return NextResponse.json({ error: "Login failed." }, { status: 500 });
    }
}
