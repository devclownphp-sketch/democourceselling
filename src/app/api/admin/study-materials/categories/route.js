import { NextResponse } from "next/server";
import { requireSubAdminPermission } from "@/lib/permission-check";
import { prisma } from "@/lib/prisma";

export async function GET() {
    const categories = await prisma.studyMaterialCategory.findMany({
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });
    return NextResponse.json(categories);
}

export async function POST(request) {
    const perm = await requireSubAdminPermission("materials.create");
    if (!perm.authorized) return perm.response;

    try {
        const body = await request.json();
        const { name, icon, color, sortOrder } = body;

        if (!name || !name.trim()) {
            return NextResponse.json({ error: "Name is required" }, { status: 400 });
        }

        const category = await prisma.studyMaterialCategory.create({
            data: {
                name: name.trim(),
                icon: icon || "book",
                color: color || "#6366f1",
                sortOrder: sortOrder ?? 0,
            },
        });

        return NextResponse.json(category, { status: 201 });
    } catch (error) {
        if (error.code === "P2002") {
            return NextResponse.json({ error: "Category already exists" }, { status: 400 });
        }
        return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
    }
}
