import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";

export async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get("file");

        if (!file) {
            return Response.json({ error: "No file provided" }, { status: 400 });
        }

        const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"];
        if (!validTypes.includes(file.type)) {
            return Response.json({ error: "Invalid file type. Only JPEG, PNG, GIF, WebP, and SVG allowed." }, { status: 400 });
        }

        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            return Response.json({ error: "File too large. Max 5MB allowed." }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const ext = file.name.split(".").pop() || "jpg";
        const filename = `${randomUUID()}.${ext}`;

        const uploadDir = join(process.cwd(), "public", "uploads");
        await mkdir(uploadDir, { recursive: true });

        const filepath = join(uploadDir, filename);
        await writeFile(filepath, buffer);

        const url = `/uploads/${filename}`;

        return Response.json({ url, filename });
    } catch (error) {
        console.error("Upload error:", error);
        return Response.json({ error: "Upload failed" }, { status: 500 });
    }
}
