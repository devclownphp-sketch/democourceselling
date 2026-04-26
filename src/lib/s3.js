/**
 * Legacy S3 utility - uses dynamic imports to avoid Turbopack build errors.
 * Prefer using @/lib/storage.js for new code.
 */
const _s3Pkg = ["@aws-sdk", "client-s3"].join("/");
const _s3PresignerPkg = ["@aws-sdk", "s3-request-presigner"].join("/");

const BUCKET_NAME = process.env.AWS_S3_BUCKET || "webcom-materials";

async function getS3ClientInstance() {
    const s3Sdk = await import(/* webpackIgnore: true */ _s3Pkg);
    const client = new s3Sdk.S3Client({
        region: process.env.AWS_REGION || "ap-southeast-1",
        credentials: process.env.AWS_ACCESS_KEY_ID ? {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        } : undefined,
    });
    return { client, sdk: s3Sdk };
}

export async function uploadFile(fileBuffer, key, contentType = "application/pdf") {
    if (!process.env.AWS_ACCESS_KEY_ID) {
        throw new Error("AWS credentials not configured. Please set AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, and AWS_REGION in environment.");
    }

    const { client, sdk } = await getS3ClientInstance();
    const command = new sdk.PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        Body: fileBuffer,
        ContentType: contentType,
    });

    await client.send(command);
    return `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || "ap-southeast-1"}.amazonaws.com/${key}`;
}

export async function getSignedUrlForDownload(key, expiresIn = 3600) {
    if (!process.env.AWS_ACCESS_KEY_ID) {
        throw new Error("AWS credentials not configured");
    }

    const { client, sdk } = await getS3ClientInstance();
    const presignerModule = await import(/* webpackIgnore: true */ _s3PresignerPkg);
    const command = new sdk.GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
    });

    return presignerModule.getSignedUrl(client, command, { expiresIn });
}

export async function deleteFile(key) {
    if (!process.env.AWS_ACCESS_KEY_ID) {
        throw new Error("AWS credentials not configured");
    }

    const { client, sdk } = await getS3ClientInstance();
    const command = new sdk.DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
    });

    await client.send(command);
    return true;
}

export function isS3Configured() {
    return Boolean(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY);
}

export function generateS3Key(folder, filename) {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    const ext = filename.split(".").pop()?.toLowerCase() || "pdf";
    return `${folder}/${timestamp}-${random}.${ext}`;
}