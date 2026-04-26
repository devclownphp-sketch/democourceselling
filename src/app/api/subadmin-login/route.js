import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function generateUrlId() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let result = "";
    for (let i = 0; i < 5; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

function hashToken(token) {
    return require("crypto").createHash("sha256").update(token).digest("hex");
}

export async function POST(request) {
    try {
        const { username, password } = await request.json();

        if (!username || !password) {
            return NextResponse.json({ error: "Username and password required" }, { status: 400 });
        }

        const subadmin = await prisma.subAdmin.findUnique({
            where: { username },
            include: { role: true },
        });

        if (!subadmin) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        if (!subadmin.isActive) {
            return NextResponse.json({ error: "Account is disabled" }, { status: 401 });
        }

        const bcrypt = require("bcryptjs");
        const ok = await bcrypt.compare(password, subadmin.passwordHash);
        if (!ok) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        let urlId = subadmin.urlId;
        if (!urlId) {
            urlId = generateUrlId();
            await prisma.subAdmin.update({
                where: { id: subadmin.id },
                data: { urlId },
            });
        }

        return NextResponse.json({
            ok: true,
            username: subadmin.username,
            urlId,
            permissions: subadmin.role?.permissions || [],
        });
    } catch (error) {
        console.error("Subadmin login error:", error);
        return NextResponse.json({ error: "Login failed" }, { status: 500 });
    }
}