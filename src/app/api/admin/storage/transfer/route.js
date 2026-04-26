import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { uploadFile, StorageFolders } from "@/lib/storage";
import { existsSync, readdirSync, readFileSync } from "fs";
import { join, extname } from "path";

const MIME_MAP = {
    ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".gif": "image/gif",
    ".webp": "image/webp", ".svg": "image/svg+xml", ".pdf": "application/pdf",
    ".mp4": "video/mp4", ".webm": "video/webm", ".json": "application/json",
    ".html": "text/html", ".css": "text/css", ".js": "application/javascript",
};
export async function POST(request) {
    const { unauthorized } = await requireAdminApi();
    if (unauthorized) return unauthorized;

    try {
        const body = await request.json();
        const { fromProvider, toProvider, toConfig } = body;

        if (!fromProvider || !toProvider) {
            return NextResponse.json({ error: "Both fromProvider and toProvider are required" }, { status: 400 });
        }

        if (fromProvider === toProvider) {
            return NextResponse.json({ error: "Source and destination must be different" }, { status: 400 });
        }
        if (fromProvider !== "local") {
            return NextResponse.json({ error: "Transfer currently only supports local as source. Download from cloud first." }, { status: 400 });
        }

        const localRoot = join(process.cwd(), "public", "uploads");
        const results = { transferred: 0, failed: 0, errors: [], folders: {} };

        for (const folder of Object.values(StorageFolders)) {
            const folderPath = join(localRoot, folder);
            results.folders[folder] = { transferred: 0, failed: 0 };

            if (!existsSync(folderPath)) continue;

            const files = readdirSync(folderPath);
            for (const file of files) {
                try {
                    const filePath = join(folderPath, file);
                    const fileBuffer = readFileSync(filePath);
                    const ext = extname(file).toLowerCase();
                    const contentType = MIME_MAP[ext] || "application/octet-stream";
                    const storageConfig = {
                        provider: toProvider,
                        ...toConfig,
                    };
                    await uploadFile(fileBuffer, folder, file, contentType, storageConfig);
                    results.transferred++;
                    results.folders[folder].transferred++;
                } catch (err) {
                    results.failed++;
                    results.folders[folder].failed++;
                    results.errors.push(`${folder}/${file}: ${err.message}`);
                }
            }
        }

        return NextResponse.json({
            success: true,
            message: `Transfer complete: ${results.transferred} files transferred, ${results.failed} failed`,
            results,
        });
    } catch (error) {
        console.error("Transfer error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
