/**
 * Unified Storage System
 * Supports Local, AWS S3, Cloudflare R2, and Google Cloud Storage
 * Configuration loaded from database settings or environment variables
 *
 * Cloud SDKs are loaded dynamically via import() so the build
 * never fails when @google-cloud/storage or @aws-sdk/client-s3
 * are not installed. Local storage works out-of-the-box.
 */

import { writeFile, mkdir, unlink, readFile } from "fs/promises";
import { existsSync } from "fs";
import { join, extname } from "path";
import { randomUUID } from "crypto";

let s3Client = null;
let s3Commands = null;
const _s3Pkg = ["@aws-sdk", "client-s3"].join("/");
const _s3PresignerPkg = ["@aws-sdk", "s3-request-presigner"].join("/");
const _gcsPkg = ["@google-cloud", "storage"].join("/");

async function getS3Client(config = {}) {
    if (!s3Client) {
        try {
            const s3Sdk = await import(/* webpackIgnore: true */ _s3Pkg);
            const { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, HeadBucketCommand } = s3Sdk;
            s3Commands = { PutObjectCommand, GetObjectCommand, DeleteObjectCommand, HeadBucketCommand };
            s3Client = new S3Client({
                region: config.region || process.env.AWS_REGION || "ap-southeast-1",
                credentials: config.accessKeyId ? {
                    accessKeyId: config.accessKeyId,
                    secretAccessKey: config.secretAccessKey,
                } : process.env.AWS_ACCESS_KEY_ID ? {
                    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
                } : undefined,
                endpoint: config.endpoint,
            });
        } catch (err) {
            throw new Error("AWS SDK (@aws-sdk/client-s3) is not installed. Run: bun add @aws-sdk/client-s3");
        }
    }
    return { client: s3Client, commands: s3Commands };
}

async function getGcsStorage(config = {}) {
    try {
        const gcsSdk = await import(/* webpackIgnore: true */ _gcsPkg);
        const { Storage } = gcsSdk;
        return new Storage({
            projectId: config.projectId || process.env.GCS_PROJECT_ID,
            credentials: config.credentials
                ? JSON.parse(config.credentials)
                : process.env.GCS_CREDENTIALS
                    ? JSON.parse(process.env.GCS_CREDENTIALS)
                    : undefined,
        });
    } catch (err) {
        throw new Error("GCS SDK (@google-cloud/storage) is not installed. Run: bun add @google-cloud/storage");
    }
}

export const StorageFolders = {
    AVATARS: "avatars",
    IMAGES: "images",
    STUDY_MATERIALS: "study-materials",
    COURSE_PDFS: "course-pdfs",
    BLOG_IMAGES: "blog-images",
    CERTIFICATES: "certificates",
    COURSE_IMAGES: "course-images",
    THUMBNAILS: "thumbnails",
    CERTIFICATE_TEMPLATES: "certificate-templates",
};

export const StorageProviders = {
    LOCAL: "local",
    S3: "s3",
    R2: "r2",
    GCS: "gcs",
};

const LOCAL_ROOT = join(process.cwd(), "public", "uploads");

function generateFilename(originalName) {
    const ext = extname(originalName).toLowerCase() || "." + (originalName.split(".").pop() || "bin");
    return `${Date.now()}-${randomUUID().substring(0, 8)}${ext}`;
}

function getPublicUrl(folder, filename) {
    return `/uploads/${folder}/${filename}`;
}

function getS3Key(folder, filename) {
    return `${folder}/${filename}`;
}

function getS3Url(key, provider, config = {}) {
    if (provider === "r2") {
        const accountId = config.accountId || process.env.CLOUDFLARE_R2_ACCOUNT_ID || "";
        return `https://${accountId ? accountId + "." : ""}r2.dev/${config.bucket || process.env.AWS_S3_BUCKET || "bucket"}/${key}`;
    }
    const region = config.region || process.env.AWS_REGION || "ap-southeast-1";
    const bucket = config.bucket || process.env.AWS_S3_BUCKET || "bucket";
    if (config.endpoint) {
        return `${config.endpoint}/${bucket}/${key}`;
    }
    return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
}

function getGcsUrl(key, config = {}) {
    return `https://storage.googleapis.com/${config.bucket || process.env.GCS_BUCKET || "bucket"}/${key}`;
}
async function saveToLocal(fileBuffer, folder, filename) {
    const dirPath = join(LOCAL_ROOT, folder);
    if (!existsSync(dirPath)) {
        await mkdir(dirPath, { recursive: true });
    }
    const filePath = join(dirPath, filename);
    await writeFile(filePath, fileBuffer);
    return {
        url: getPublicUrl(folder, filename),
        key: `${folder}/${filename}`,
        provider: "local",
    };
}
let _cachedStorageConfig = null;
let _cacheTimestamp = 0;
const CACHE_TTL = 60000;

export async function getStorageConfig() {
    const now = Date.now();
    if (_cachedStorageConfig && (now - _cacheTimestamp) < CACHE_TTL) {
        return _cachedStorageConfig;
    }

    try {
        const { prisma } = await import("@/lib/prisma");
        const settings = await prisma.siteSettings.findUnique({ where: { id: "default" } });
        if (settings) {
            _cachedStorageConfig = {
                provider: settings.storageProvider || "local",
                ...(settings.storageConfig || {}),
            };
            _cacheTimestamp = now;
            return _cachedStorageConfig;
        }
    } catch {
    }

    return { provider: process.env.STORAGE_PROVIDER || "local" };
}

export function clearStorageConfigCache() {
    _cachedStorageConfig = null;
    _cacheTimestamp = 0;
}

export async function uploadFile(fileBuffer, folder, originalName, contentType, storageConfig = {}) {
    const filename = generateFilename(originalName);
    let effectiveConfig = storageConfig;
    if (!storageConfig.provider) {
        const dbConfig = await getStorageConfig();
        effectiveConfig = { ...dbConfig, ...storageConfig };
    }
    const provider = effectiveConfig.provider || process.env.STORAGE_PROVIDER || "local";
    if (provider === "local") {
        return saveToLocal(fileBuffer, folder, filename);
    }
    if (provider === "s3" || provider === "r2") {
        try {
            const { client, commands } = await getS3Client({
                region: effectiveConfig.region,
                accessKeyId: effectiveConfig.accessKeyId,
                secretAccessKey: effectiveConfig.secretAccessKey,
                endpoint: effectiveConfig.endpoint,
            });
            const key = getS3Key(folder, filename);

            const command = new commands.PutObjectCommand({
                Bucket: effectiveConfig.bucket || process.env.AWS_S3_BUCKET,
                Key: key,
                Body: fileBuffer,
                ContentType: contentType || "application/octet-stream",
            });

            await client.send(command);
            return {
                url: getS3Url(key, provider, {
                    bucket: effectiveConfig.bucket,
                    region: effectiveConfig.region,
                    accountId: effectiveConfig.accountId,
                    endpoint: effectiveConfig.endpoint,
                }),
                key,
                provider,
            };
        } catch (err) {
            console.warn(`S3/R2 upload failed, falling back to local storage: ${err.message}`);
            return saveToLocal(fileBuffer, folder, filename);
        }
    }
    if (provider === "gcs") {
        try {
            const gcs = await getGcsStorage({
                projectId: effectiveConfig.projectId,
                credentials: effectiveConfig.credentials,
            });
            const bucket = gcs.bucket(effectiveConfig.bucket || process.env.GCS_BUCKET);
            const key = getS3Key(folder, filename);
            const file = bucket.file(key);
            await file.save(fileBuffer, {
                metadata: { contentType: contentType || "application/octet-stream" },
            });
            return {
                url: getGcsUrl(key, { bucket: effectiveConfig.bucket }),
                key,
                provider: "gcs",
            };
        } catch (err) {
            console.warn(`GCS upload failed, falling back to local storage: ${err.message}`);
            return saveToLocal(fileBuffer, folder, filename);
        }
    }
    console.warn(`Unknown storage provider "${provider}", falling back to local storage.`);
    return saveToLocal(fileBuffer, folder, filename);
}

export async function deleteFile(urlOrKey, provider = "local") {
    let key = urlOrKey;
    if (urlOrKey.startsWith("http")) {
        try {
            const url = new URL(urlOrKey);
            key = url.pathname.substring(1);
        } catch {
            return false;
        }
    }

    if (provider === "local") {
        const filePath = join(process.cwd(), "public", key);
        if (existsSync(filePath)) {
            await unlink(filePath);
        }
        return true;
    }

    if (provider === "s3" || provider === "r2") {
        try {
            const { client, commands } = await getS3Client();
            const command = new commands.DeleteObjectCommand({
                Bucket: process.env.AWS_S3_BUCKET,
                Key: key,
            });
            await client.send(command);
            return true;
        } catch (err) {
            console.warn("S3/R2 delete failed:", err.message);
            return false;
        }
    }

    if (provider === "gcs") {
        try {
            const gcs = await getGcsStorage();
            const bucket = gcs.bucket(process.env.GCS_BUCKET);
            await bucket.file(key).delete();
            return true;
        } catch (err) {
            console.warn("GCS delete failed:", err.message);
            return false;
        }
    }

    return false;
}

export async function getSignedUrl(keyOrUrl, provider = "local", expiresIn = 3600) {
    if (provider === "local") {
        if (keyOrUrl.startsWith("http")) return keyOrUrl;
        return keyOrUrl;
    }

    if (provider === "s3" || provider === "r2") {
        try {
            const { client, commands } = await getS3Client();
            const presignerModule = await import(/* webpackIgnore: true */ _s3PresignerPkg);
            const command = new commands.GetObjectCommand({
                Bucket: process.env.AWS_S3_BUCKET,
                Key: keyOrUrl,
            });
            return await presignerModule.getSignedUrl(client, command, { expiresIn });
        } catch (err) {
            console.warn("S3/R2 getSignedUrl failed, returning original URL:", err.message);
            return keyOrUrl;
        }
    }

    if (provider === "gcs") {
        try {
            const gcs = await getGcsStorage();
            const bucket = gcs.bucket(process.env.GCS_BUCKET);
            const file = bucket.file(keyOrUrl);
            const [url] = await file.getSignedUrl({
                action: "read",
                expires: Date.now() + expiresIn * 1000,
            });
            return url;
        } catch (err) {
            console.warn("GCS getSignedUrl failed, returning original URL:", err.message);
            return keyOrUrl;
        }
    }

    return keyOrUrl;
}

export function isStorageConfigured(provider = "local") {
    if (provider === "local") return true;
    if (provider === "s3" || provider === "r2") {
        return Boolean(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY);
    }
    if (provider === "gcs") {
        return Boolean(process.env.GCS_PROJECT_ID && (process.env.GCS_CREDENTIALS || process.env.GCS_KEY_FILE));
    }
    return false;
}

export function getStorageInfo(currentProvider = "local") {
    return {
        provider: currentProvider,
        configured: isStorageConfigured(currentProvider),
        localRoot: LOCAL_ROOT,
        folders: Object.values(StorageFolders),
        supports: ["local", "s3", "r2", "gcs"],
    };
}

export function detectProviderFromUrl(url) {
    if (!url || !url.startsWith("http")) return "local";
    if (url.includes("r2.dev")) return "r2";
    if (url.includes("storage.googleapis.com")) return "gcs";
    if (url.includes("s3.") || url.includes("amazonaws.com")) return "s3";
    return "local";
}