import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
    region: process.env.AWS_REGION || "ap-southeast-1",
    credentials: process.env.AWS_ACCESS_KEY_ID ? {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    } : undefined,
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET || "webcom-materials";

export async function uploadFile(fileBuffer, key, contentType = "application/pdf") {
    if (!process.env.AWS_ACCESS_KEY_ID) {
        throw new Error("AWS credentials not configured. Please set AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, and AWS_REGION in environment.");
    }

    const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        Body: fileBuffer,
        ContentType: contentType,
    });

    await s3Client.send(command);
    return `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || "ap-southeast-1"}.amazonaws.com/${key}`;
}

export async function getSignedUrlForDownload(key, expiresIn = 3600) {
    if (!process.env.AWS_ACCESS_KEY_ID) {
        throw new Error("AWS credentials not configured");
    }

    const command = new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
    });

    return getSignedUrl(s3Client, command, { expiresIn });
}

export async function deleteFile(key) {
    if (!process.env.AWS_ACCESS_KEY_ID) {
        throw new Error("AWS credentials not configured");
    }

    const command = new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
    });

    await s3Client.send(command);
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