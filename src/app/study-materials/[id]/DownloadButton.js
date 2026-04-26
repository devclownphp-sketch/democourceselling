"use client";

async function downloadFile(url, filename) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Download failed");
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = filename || "document.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
        window.open(url, "_blank");
    }
}

export default function DownloadButton({ url, filename }) {
    return (
        <button
            onClick={() => downloadFile(url, filename)}
            style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.75rem 1.5rem",
                background: "#000",
                color: "#ffd400",
                borderRadius: "12px",
                fontWeight: 700,
                border: "4px solid #000",
                boxShadow: "4px 4px 0 #000",
                cursor: "pointer",
                fontSize: "1rem"
            }}
        >
            ⬇ Download PDF
        </button>
    );
}