import DriveFolderManager from "@/components/admin/DriveFolderManager";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminDriveFoldersPage() {
    const [folders, courses] = await Promise.all([
        prisma.driveFolder.findMany({
            orderBy: { createdAt: "desc" },
            include: { course: { select: { id: true, title: true, slug: true } } },
        }),
        prisma.course.findMany({
            where: { isActive: true },
            orderBy: { title: "asc" },
            select: { id: true, title: true, slug: true },
        }),
    ]);

    return <DriveFolderManager initialFolders={folders} courses={courses} />;
}
