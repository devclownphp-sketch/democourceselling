import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseCoursePayload } from "@/lib/course-schema";
import { slugify } from "@/lib/slug";
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

async function createUniqueSlug(baseTitle) {
    const base = slugify(baseTitle);
    let slug = base;
    let index = 1;

    while (true) {
        const exists = await prisma.course.findUnique({ where: { slug } });
        if (!exists) return slug;
        index += 1;
        slug = `${base}-${index}`;
    }
}

export async function GET(request) {
    const urlId = request.nextUrl.pathname.match(/\/api\/([A-Z0-9]{5})\/courses/)?.[1];
    if (!urlId) {
        return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    const cookieStore = await cookies();
    const validation = await validateSubAdmin(cookieStore, urlId, "courses.view");
    if (!validation.valid) return validation.response;

    const courses = await prisma.course.findMany({
        orderBy: { createdAt: "desc" },
        include: { courseType: true },
    });
    return NextResponse.json({ courses });
}

export async function POST(request) {
    const urlId = request.nextUrl.pathname.match(/\/api\/([A-Z0-9]{5})\/courses/)?.[1];
    if (!urlId) {
        return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    const cookieStore = await cookies();
    const validation = await validateSubAdmin(cookieStore, urlId, "courses.create");
    if (!validation.valid) return validation.response;

    try {
        const payload = await request.json();
        const parsed = parseCoursePayload(payload);
        const slug = await createUniqueSlug(parsed.title);

        const course = await prisma.course.create({
            data: {
                ...parsed,
                slug,
                adminId: validation.subadmin.id,
            },
            include: { courseType: true },
        });

        return NextResponse.json({ ok: true, course });
    } catch (error) {
        if (error?.issues) {
            const firstIssue = error.issues[0];
            const fieldName = firstIssue?.path?.[0] || "";
            const message = firstIssue?.message || "Validation failed.";
            return NextResponse.json({ error: `${fieldName}: ${message}` }, { status: 400 });
        }
        return NextResponse.json({ error: error?.message || "Could not create course." }, { status: 400 });
    }
}