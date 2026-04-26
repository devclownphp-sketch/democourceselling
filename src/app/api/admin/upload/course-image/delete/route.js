import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-auth";
import { deleteFile } from "@/lib/storage";

export async function POST(request) {
    const { unauthorized } = await requireAdminApi();
    if (unauthorized) return unauthorized;

    try {
        const { url } = await request.json();

        if (!url) {
            return NextResponse.json({ error: "No URL provided" }, { status: 400 });
        }

        await deleteFile(url);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Delete image error:", error);
        return NextResponse.json({ error: "Delete failed" }, { status: 500 });
    }
}