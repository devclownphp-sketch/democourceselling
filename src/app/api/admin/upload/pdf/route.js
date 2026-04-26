import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-auth";
import { uploadFile, StorageFolders } from "@/lib/storage";

export async function POST(request) {
    const { unauthorized } = await requireAdminApi();
    if (unauthorized) return unauthorized;

    try {
        const formData = await request.formData();
        const file = formData.get("file");

        if (!file || typeof file === "string") {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        if (!file.name.toLowerCase().endsWith(".pdf")) {
            return NextResponse.json({ error: "Only PDF files are allowed" }, { status: 400 });
        }

        const maxSize = 50 * 1024 * 1024;
        if (file.size > maxSize) {
            return NextResponse.json({ error: "File too large. Max 50MB allowed." }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const result = await uploadFile(buffer, StorageFolders.STUDY_MATERIALS, file.name, "application/pdf");

        return NextResponse.json({
            ok: true,
            url: result.url,
            key: result.key,
            provider: result.provider
        });
    } catch (error) {
        console.error("PDF upload error:", error);
        return NextResponse.json({ error: error.message || "Upload failed" }, { status: 500 });
    }
}