import { z } from "zod";
import { NextResponse } from "next/server";
import {
    attachSubAdminSessionCookie,
    createSubAdminSession,
    verifySubAdminCredentials,
} from "@/lib/admin-auth";

const loginSchema = z.object({
    username: z.string().trim().min(1, "Username is required"),
    password: z.string().min(1, "Password is required"),
});

export async function POST(request) {
    try {
        const payload = await request.json();
        const parsed = loginSchema.safeParse(payload);
        if (!parsed.success) {
            return NextResponse.json({ error: "Invalid input." }, { status: 400 });
        }

        const subadmin = await verifySubAdminCredentials(parsed.data.username, parsed.data.password);
        if (!subadmin) {
            return NextResponse.json({ error: "Invalid username or password." }, { status: 401 });
        }

        const result = await createSubAdminSession(subadmin);
        if (!result || !result.token) {
            return NextResponse.json({ error: "Failed to create session." }, { status: 500 });
        }

        const response = NextResponse.json({ ok: true, username: subadmin.username, urlId: result.urlId });
        attachSubAdminSessionCookie(response, result.token, result.expiresAt, result.urlId);
        return response;
    } catch {
        return NextResponse.json({ error: "Login failed." }, { status: 500 });
    }
}
