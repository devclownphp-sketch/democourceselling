import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

function hashToken(token) {
    return require("crypto").createHash("sha256").update(token).digest("hex");
}

async function validateSubAdmin(cookieStore, urlId, requiredPermission) {
    const sessionToken = cookieStore.get("subadmin_session")?.value;
    const storedUrlId = cookieStore.get("subadmin_urlid")?.value;

    if (!sessionToken || storedUrlId !== urlId) {
        return { valid: false, subadmin: null, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
    }

    const tokenHash = hashToken(sessionToken);
    const session = await prisma.subAdminSession.findUnique({
        where: { tokenHash },
        include: { subAdmin: { include: { role: true } } },
    });

    if (!session) {
        return { valid: false, subadmin: null, response: NextResponse.json({ error: "Session expired" }, { status: 401 }) };
    }

    const timeoutMin = session.subAdmin?.sessionTimeoutMin || 10;
    if (new Date() > new Date(session.createdAt.getTime() + timeoutMin * 60 * 1000)) {
        await prisma.subAdminSession.delete({ where: { id: session.id } }).catch(() => null);
        return { valid: false, subadmin: null, response: NextResponse.json({ error: "Session expired" }, { status: 401 }) };
    }

    if (!session.subAdmin.isActive) {
        return { valid: false, subadmin: null, response: NextResponse.json({ error: "Account disabled" }, { status: 403 }) };
    }

    if (requiredPermission) {
        const permissions = session.subAdmin.role?.permissions || [];
        if (!permissions.includes(requiredPermission)) {
            return { valid: false, subadmin: null, response: NextResponse.json({ error: "Permission denied" }, { status: 403 }) };
        }
    }

    return { valid: true, subadmin: session.subAdmin, response: null };
}

export async function GET(request) {
    const urlId = request.nextUrl.pathname.match(/\/api\/([A-Z0-9]{5})\/faqs/)?.[1];
    if (!urlId) {
        return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    const cookieStore = await cookies();
    const validation = await validateSubAdmin(cookieStore, urlId, "faqs.view");
    if (!validation.valid) return validation.response;

    const faqs = await prisma.fAQ.findMany({ orderBy: { sortOrder: "asc" } });
    return NextResponse.json({ faqs });
}

export async function POST(request) {
    const urlId = request.nextUrl.pathname.match(/\/api\/([A-Z0-9]{5})\/faqs/)?.[1];
    if (!urlId) {
        return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    const cookieStore = await cookies();
    const validation = await validateSubAdmin(cookieStore, urlId, "faqs.create");
    if (!validation.valid) return validation.response;

    try {
        const payload = await request.json();
        const { question, answer, sortOrder, isActive } = payload;

        if (!question || !answer) {
            return NextResponse.json({ error: "Question and answer are required" }, { status: 400 });
        }

        const faq = await prisma.fAQ.create({
            data: {
                question,
                answer,
                sortOrder: sortOrder || 0,
                isActive: isActive !== false,
            },
        });

        return NextResponse.json({ ok: true, faq });
    } catch (error) {
        return NextResponse.json({ error: error?.message || "Could not create FAQ" }, { status: 400 });
    }
}