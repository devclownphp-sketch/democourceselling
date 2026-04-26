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
    const urlId = request.nextUrl.pathname.match(/\/api\/([A-Z0-9]{5})\/reviews/)?.[1];
    if (!urlId) {
        return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    const cookieStore = await cookies();
    const validation = await validateSubAdmin(cookieStore, urlId, "reviews.view");
    if (!validation.valid) return validation.response;

    const reviews = await prisma.review.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json({ reviews });
}

export async function POST(request) {
    const urlId = request.nextUrl.pathname.match(/\/api\/([A-Z0-9]{5})\/reviews/)?.[1];
    if (!urlId) {
        return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    const cookieStore = await cookies();
    const validation = await validateSubAdmin(cookieStore, urlId, "reviews.create");
    if (!validation.valid) return validation.response;

    try {
        const payload = await request.json();
        const { name, role, reviewText, quote, rating, avatar, marqueeText, isFeatured, isActive } = payload;

        if (!name || !reviewText) {
            return NextResponse.json({ error: "Name and review text are required" }, { status: 400 });
        }

        const review = await prisma.review.create({
            data: {
                name,
                role: role || "Student",
                reviewText,
                quote: quote || "",
                rating: rating || 5,
                avatar: avatar || null,
                marqueeText: marqueeText || null,
                isFeatured: isFeatured || false,
                isActive: isActive !== false,
                adminId: validation.subadmin.id,
            },
        });

        return NextResponse.json({ ok: true, review });
    } catch (error) {
        return NextResponse.json({ error: error?.message || "Could not create review" }, { status: 400 });
    }
}