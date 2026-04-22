import { prisma } from "@/lib/prisma";
import StudyMaterialsClient from "./StudyMaterialsClient";

export const dynamic = "force-dynamic";

export default async function StudyMaterialsPage() {
    let materials = [];
    let categories = [];

    try {
        materials = await prisma.studyMaterial.findMany({
            where: { isActive: true },
            orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
            include: {
                course: { select: { title: true, slug: true } },
                materialCategory: true,
            },
        });

        categories = await prisma.studyMaterialCategory.findMany({
            where: { isActive: true },
            orderBy: { sortOrder: "asc" },
        });
    } catch {
        materials = await prisma.studyMaterial.findMany({
            where: { isActive: true },
            orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
            include: {
                course: { select: { title: true, slug: true } },
            },
        });
        categories = [...new Set(materials.map((m) => m.category))].sort().map((name) => ({ id: name, name, color: "#6366f1" }));
    }

    return <StudyMaterialsClient materials={materials} categories={categories} />;
}
