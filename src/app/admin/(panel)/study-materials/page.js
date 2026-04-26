import { prisma } from "@/lib/prisma";
import StudyMaterialManager from "@/components/admin/StudyMaterialManager";
import StudyMaterialCategoryManager from "@/components/admin/StudyMaterialCategoryManager";

export const dynamic = "force-dynamic";

function ensureUniqueIds(items) {
    return items.map((item, idx) => ({
        ...item,
        id: item.id || `item-${idx}-${Date.now()}`
    }));
}

export default async function AdminStudyMaterialsPage() {
    let materials = [];
    let categories = [];

    try {
        materials = await prisma.studyMaterial.findMany({
            orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
            include: { course: true, materialCategory: true },
        });

        categories = await prisma.studyMaterialCategory.findMany({
            orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
        });
    } catch {
        materials = await prisma.studyMaterial.findMany({
            orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
            include: { course: true },
        });
        categories = [...new Set(materials.map((m) => m.category).filter(Boolean))].sort().map((name, idx) => ({ id: `cat-${idx}-${Date.now()}`, name, color: "#6366f1", isActive: true }));
    }

    return (
        <>
            <StudyMaterialManager initialMaterials={ensureUniqueIds(materials)} categories={ensureUniqueIds(categories)} />
            <div style={{ marginTop: "2rem" }}>
                <StudyMaterialCategoryManager initialCategories={categories} />
            </div>
        </>
    );
}
