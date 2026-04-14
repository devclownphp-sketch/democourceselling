import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { extractDriveFolderId } from "@/lib/extractDriveFolderId";

export async function GET(request) {
    const { unauthorized } = await requireAdminApi();
    if (unauthorized) return unauthorized;

    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get("courseId");

    const folders = await prisma.driveFolder.findMany({
        where: courseId ? { courseId } : undefined,
        orderBy: { createdAt: "desc" },
        include: { course: { select: { id: true, title: true, slug: true } } },
    });

    return NextResponse.json({ folders });
}

export async function POST(request) {
    const { unauthorized } = await requireAdminApi();
    if (unauthorized) return unauthorized;

    try {
        const { courseId, folderName, driveLink } = await request.json();

        const folderId = extractDriveFolderId(driveLink);
        if (!folderId) {
            return NextResponse.json({ error: "Invalid Google Drive folder link" }, { status: 400 });
        }

        if (!courseId || !folderName) {
            return NextResponse.json({ error: "courseId and folderName are required" }, { status: 400 });
        }

        const folder = await prisma.driveFolder.create({
            data: { courseId, folderName, folderId },
        });

        return NextResponse.json({ success: true, folderId: folder.folderId, folder });
    } catch (error) {
        return NextResponse.json({ error: error?.message || "Could not save folder." }, { status: 500 });
    }
}

export async function DELETE(request) {
    const { unauthorized } = await requireAdminApi();
    if (unauthorized) return unauthorized;

    try {
        const { id } = await request.json();

        if (!id) {
            return NextResponse.json({ error: "id is required" }, { status: 400 });
        }

        await prisma.driveFolder.delete({ where: { id: Number(id) } });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: error?.message || "Could not delete folder." }, { status: 500 });
    }
}
