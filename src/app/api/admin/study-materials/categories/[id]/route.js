import { NextResponse } from "next/server";
import { requireSubAdminPermission } from "@/lib/permission-check";
import { prisma } from "@/lib/prisma";

export async function PUT(request, { params }) {
    const perm = await requireSubAdminPermission("materials.edit");
    if (!perm.authorized) return perm.response;

    try {
        const body = await request.json();
        const { name, icon, color, sortOrder, isActive } = body;

        if (!name || !name.trim()) {
            return NextResponse.json({ error: "Name is required" }, { status: 400 });
        }

        const category = await prisma.studyMaterialCategory.update({
            where: { id: params.id },
            data: {
                name: name.trim(),
                icon: icon || "book",
                color: color || "#6366f1",
                sortOrder: sortOrder ?? 0,
                isActive: isActive ?? true,
            },
        });

        return NextResponse.json(category);
    } catch (error) {
        if (error.code === "P2025") {
            return NextResponse.json({ error: "Category not found" }, { status: 404 });
        }
        if (error.code === "P2002") {
            return NextResponse.json({ error: "Category name already exists" }, { status: 400 });
        }
        return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    const perm = await requireSubAdminPermission("materials.delete");
    if (!perm.authorized) return perm.response;

    try {
        await prisma.studyMaterialCategory.delete({
            where: { id: params.id },
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        if (error.code === "P2025") {
            return NextResponse.json({ error: "Category not found" }, { status: 404 });
        }
        return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
    }
}
