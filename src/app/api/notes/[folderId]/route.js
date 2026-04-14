import { NextResponse } from "next/server";

export async function GET(request, { params }) {
    const { folderId } = await params;

    const apiKey = process.env.GOOGLE_DRIVE_API_KEY;
    if (!apiKey) {
        return NextResponse.json({ error: "Google Drive API key is not configured." }, { status: 500 });
    }

    try {
        const query = encodeURIComponent(`'${folderId}' in parents and mimeType='application/pdf'`);
        const fields = encodeURIComponent("files(id,name,size,createdTime)");
        const url = `https://www.googleapis.com/drive/v3/files?q=${query}&key=${apiKey}&fields=${fields}`;

        const response = await fetch(url);
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            return NextResponse.json(
                { error: errorData?.error?.message || "Failed to fetch files from Google Drive." },
                { status: 500 },
            );
        }

        const data = await response.json();
        const files = (data.files || [])
            .filter((file) => /^[a-zA-Z0-9_-]+$/.test(file.id))
            .map((file) => ({
                id: file.id,
                name: file.name,
                size: file.size || "0",
                createdTime: file.createdTime || "",
                downloadUrl: `https://drive.google.com/uc?export=download&id=${file.id}`,
                viewUrl: `https://drive.google.com/file/d/${file.id}/view`,
            }));

        return NextResponse.json({ files });
    } catch (error) {
        return NextResponse.json({ error: error?.message || "Failed to fetch notes." }, { status: 500 });
    }
}
