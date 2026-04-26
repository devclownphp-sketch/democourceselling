import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { getStorageInfo, StorageFolders } from "@/lib/storage";
import { existsSync, readdirSync } from "fs";
import { join } from "path";
export async function GET() {
    const { unauthorized } = await requireAdminApi();
    if (unauthorized) return unauthorized;

    try {
        const settings = await prisma.siteSettings.findUnique({ where: { id: "default" } });
        const provider = settings?.storageProvider || "local";
        const config = settings?.storageConfig || {};
        const info = getStorageInfo(provider);
        const localRoot = join(process.cwd(), "public", "uploads");
        const folderStats = {};

        for (const folder of Object.values(StorageFolders)) {
            const folderPath = join(localRoot, folder);
            try {
                if (existsSync(folderPath)) {
                    const files = readdirSync(folderPath);
                    folderStats[folder] = files.length;
                } else {
                    folderStats[folder] = 0;
                }
            } catch {
                folderStats[folder] = 0;
            }
        }

        const totalFiles = Object.values(folderStats).reduce((a, b) => a + b, 0);

        return NextResponse.json({
            provider,
            config: {
                bucket: config.bucket || "",
                region: config.region || "",
                endpoint: config.endpoint || "",
                accountId: config.accountId || "",
                projectId: config.projectId || "",
                hasAccessKey: Boolean(config.accessKeyId),
                hasSecretKey: Boolean(config.secretAccessKey),
                hasCredentials: Boolean(config.credentials),
            },
            info,
            folderStats,
            totalFiles,
        });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
export async function POST(request) {
    const { unauthorized } = await requireAdminApi();
    if (unauthorized) return unauthorized;

    try {
        const body = await request.json();
        const { provider, config } = body;

        if (!provider || provider === "local") {
            return NextResponse.json({ success: true, message: "Local storage is always available." });
        }

        if (provider === "s3" || provider === "r2") {
            if (!config.bucket || !config.accessKeyId || !config.secretAccessKey) {
                return NextResponse.json({ error: "Missing required S3/R2 fields: bucket, accessKeyId, secretAccessKey" }, { status: 400 });
            }

            try {
                const _s3Pkg = ["@aws-sdk", "client-s3"].join("/");
                const s3Sdk = await import(/* webpackIgnore: true */ _s3Pkg);
                const { S3Client, HeadBucketCommand } = s3Sdk;

                const client = new S3Client({
                    region: config.region || "auto",
                    credentials: {
                        accessKeyId: config.accessKeyId,
                        secretAccessKey: config.secretAccessKey,
                    },
                    ...(config.endpoint ? { endpoint: config.endpoint } : {}),
                });

                await client.send(new HeadBucketCommand({ Bucket: config.bucket }));
                return NextResponse.json({ success: true, message: `✅ Connected to ${provider.toUpperCase()} bucket: ${config.bucket}` });
            } catch (err) {
                return NextResponse.json({ error: `Connection failed: ${err.message}` }, { status: 400 });
            }
        }

        if (provider === "gcs") {
            if (!config.bucket || !config.projectId) {
                return NextResponse.json({ error: "Missing required GCS fields: bucket, projectId" }, { status: 400 });
            }
            try {
                const _gcsPkg = ["@google-cloud", "storage"].join("/");
                const gcsSdk = await import(/* webpackIgnore: true */ _gcsPkg);
                const { Storage } = gcsSdk;
                const gcs = new Storage({
                    projectId: config.projectId,
                    ...(config.credentials ? { credentials: JSON.parse(config.credentials) } : {}),
                });
                const [exists] = await gcs.bucket(config.bucket).exists();
                if (!exists) throw new Error("Bucket does not exist");
                return NextResponse.json({ success: true, message: `✅ Connected to GCS bucket: ${config.bucket}` });
            } catch (err) {
                return NextResponse.json({ error: `Connection failed: ${err.message}` }, { status: 400 });
            }
        }

        return NextResponse.json({ error: "Unknown provider" }, { status: 400 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
export async function PUT(request) {
    const { unauthorized } = await requireAdminApi();
    if (unauthorized) return unauthorized;

    try {
        const body = await request.json();
        const { provider, config } = body;

        if (!["local", "s3", "r2", "gcs"].includes(provider)) {
            return NextResponse.json({ error: "Invalid provider. Must be: local, s3, r2, or gcs" }, { status: 400 });
        }

        await prisma.siteSettings.upsert({
            where: { id: "default" },
            update: {
                storageProvider: provider,
                storageConfig: config || {},
            },
            create: {
                id: "default",
                storageProvider: provider,
                storageConfig: config || {},
            },
        });

        return NextResponse.json({ success: true, message: `Storage switched to ${provider.toUpperCase()}` });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
