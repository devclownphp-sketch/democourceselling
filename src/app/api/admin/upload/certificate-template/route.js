import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-auth";
import { uploadFile, StorageFolders } from "@/lib/storage";

export async function POST(request) {
    const { unauthorized } = await requireAdminApi();
    if (unauthorized) return unauthorized;

    try {
        const formData = await request.formData();
        const file = formData.get("file");

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        const validTypes = ["application/pdf", "image/png", "image/jpeg", "image/webp"];
        if (!validTypes.includes(file.type)) {
            return NextResponse.json({ error: "Invalid file type. Only PDF and images are allowed." }, { status: 400 });
        }

        const maxSize = 20 * 1024 * 1024;
        if (file.size > maxSize) {
            return NextResponse.json({ error: "File too large. Max 20MB allowed." }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const result = await uploadFile(buffer, StorageFolders.CERTIFICATES, file.name, file.type);

        return NextResponse.json({
            ok: true,
            url: result.url,
            key: result.key,
            provider: result.provider
        });
    } catch (error) {
        console.error("Certificate template upload error:", error);
        return NextResponse.json({ error: error.message || "Upload failed" }, { status: 500 });
    }
}
