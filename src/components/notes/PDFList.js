"use client";

import { useEffect, useRef, useState } from "react";
import { IconPdf, IconX, IconDownload, IconPrint, IconMaximize, IconArrowLeft, IconArrowRight } from "@/components/Icons";
import PDFViewer from "./PDFViewer";

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

export default function PDFList({ folderId, folderName, pdfFiles = [] }) {
    const [files, setFiles] = useState(pdfFiles);
    const [loading, setLoading] = useState(pdfFiles.length === 0);
    const [error, setError] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [viewerType, setViewerType] = useState("modern");
    const timerRef = useRef(null);

        useEffect(() => {
        async function loadSettings() {
            try {
                const res = await fetch("/api/settings/public");
                if (res.ok) {
                    const data = await res.json();
                    const type = data.settings?.pdfViewer || "modern";
                    setViewerType(type === "google" ? "modern" : type);
                }
            } catch (e) {
            }
        }
        loadSettings();
    }, []);

    const loadNotes = async () => {
        if (pdfFiles.length > 0) {
            setFiles(pdfFiles);
            setLoading(false);
            return;
        }

        try {
            const res = await fetch(`/api/notes/${folderId}`);
            const data = await res.json();

            if (data.error) throw new Error(data.error);
            setFiles(data.files || []);
            setError("");
        } catch (err) {
            setError(err.message || "Failed to load notes.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (folderId) {
            timerRef.current = setTimeout(loadNotes, 100);
            return () => {
                if (timerRef.current) clearTimeout(timerRef.current);
            };
        }
    }, [folderId]);

    function formatSize(bytes) {
        const n = Number(bytes);
        if (!n) return "";
        if (n < 1024) return `${n} B`;
        if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
        return `${(n / (1024 * 1024)).toFixed(1)} MB`;
    }

    return (
        <div style={{ marginBottom: "var(--spacing-2xl)" }}>
            <h3
                style={{
                    fontSize: "var(--font-size-lg)",
                    fontWeight: 600,
                    color: "var(--text-dark)",
                    marginBottom: "var(--spacing-md)",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                }}
            >
                <IconPdf size={20} />
                {folderName || "PDF Notes"}
            </h3>

            {loading && (
                <p style={{ color: "var(--text-muted)", fontSize: "var(--font-size-sm)" }}>Loading notes...</p>
            )}

            {!loading && error && (
                <p
                    style={{
                        color: "var(--danger)",
                        background: "var(--danger-light)",
                        padding: "var(--spacing-sm) var(--spacing-md)",
                        borderRadius: "var(--radius-md)",
                        fontSize: "var(--font-size-sm)",
                    }}
                >
                    {error}
                </p>
            )}

            {!loading && !error && files.length === 0 && (
                <p style={{ color: "var(--text-muted)", fontSize: "var(--font-size-sm)" }}>No PDF notes available.</p>
            )}

            {!loading && !error && files.length > 0 && !selectedFile && (
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-sm)" }}>
                    {files.map((file, index) => (
                        <div
                            key={file.id || index}
                            onClick={() => setSelectedFile(file)}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                background: "var(--paper)",
                                border: "3px solid #000",
                                borderRadius: "16px",
                                padding: "var(--spacing-md)",
                                gap: "var(--spacing-md)",
                                flexWrap: "wrap",
                                boxShadow: "4px 4px 0 #000",
                                cursor: "pointer",
                                transition: "all 0.2s ease",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = "translate(-2px, -2px)";
                                e.currentTarget.style.boxShadow = "6px 6px 0 #000";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "translate(0, 0)";
                                e.currentTarget.style.boxShadow = "4px 4px 0 #000";
                            }}
                        >
                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flex: 1, minWidth: 0 }}>
                                <div
                                    style={{
                                        width: "44px",
                                        height: "44px",
                                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                        border: "2px solid #000",
                                        borderRadius: "10px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        boxShadow: "2px 2px 0 #000",
                                    }}
                                >
                                    <IconPdf size={20} color="#fff" />
                                </div>
                                <div style={{ minWidth: 0 }}>
                                    <p
                                        style={{
                                            fontSize: "var(--font-size-sm)",
                                            fontWeight: 700,
                                            color: "var(--text-dark)",
                                            margin: 0,
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap",
                                        }}
                                        title={file.name}
                                    >
                                        {file.name}
                                    </p>
                                    {file.size && file.size !== "0" && (
                                        <p
                                            style={{
                                                fontSize: "var(--font-size-xs)",
                                                color: "var(--text-muted)",
                                                margin: "2px 0 0",
                                            }}
                                        >
                                            {formatSize(file.size)}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div style={{ display: "flex", gap: "var(--spacing-sm)", flexShrink: 0 }}>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedFile(file);
                                    }}
                                    style={{
                                        padding: "0.5rem 1rem",
                                        background: "#ffd400",
                                        color: "#000",
                                        border: "2px solid #000",
                                        borderRadius: "10px",
                                        fontWeight: 700,
                                        fontSize: "0.8rem",
                                        cursor: "pointer",
                                        boxShadow: "2px 2px 0 #000",
                                    }}
                                >
                                    View
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        const url = file.downloadUrl || file.url || file.viewUrl;
                                        downloadFile(url, file.name);
                                    }}
                                    style={{
                                        padding: "0.5rem 1rem",
                                        background: "#000",
                                        color: "#fff",
                                        border: "2px solid #000",
                                        borderRadius: "10px",
                                        fontWeight: 700,
                                        fontSize: "0.8rem",
                                        cursor: "pointer",
                                        textDecoration: "none",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "4px",
                                    }}
                                >
                                    <IconDownload size={14} />
                                    Download
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {selectedFile && (
                <div
                    style={{
                        position: "fixed",
                        inset: 0,
                        zIndex: 9999,
                        background: "rgba(0,0,0,0.85)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "1rem",
                    }}
                    onClick={() => setSelectedFile(null)}
                >
                    <div
                        style={{
                            background: "#fff",
                            borderRadius: "20px",
                            width: "100%",
                            maxWidth: "1200px",
                            height: "92vh",
                            display: "flex",
                            flexDirection: "column",
                            overflow: "hidden",
                            border: "5px solid #000",
                            boxShadow: "12px 12px 0 #ffd400",
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                padding: "1rem 1.5rem",
                                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                borderBottom: "4px solid #000",
                            }}
                        >
                            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                <div
                                    style={{
                                        width: "40px",
                                        height: "40px",
                                        background: "#fff",
                                        border: "3px solid #000",
                                        borderRadius: "10px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        boxShadow: "2px 2px 0 #000",
                                    }}
                                >
                                    <span style={{ fontSize: "10px", fontWeight: 800, color: "#667eea" }}>PDF</span>
                                </div>
                                <div>
                                    <p style={{ margin: 0, fontSize: "14px", fontWeight: 700, color: "#fff" }}>
                                        {selectedFile.name}
                                    </p>
                                    <p style={{ margin: 0, fontSize: "11px", color: "rgba(255,255,255,0.8)" }}>
                                        {selectedFile.size ? formatSize(selectedFile.size) : "PDF Document"}
                                    </p>
                                </div>
                            </div>
                            <div style={{ display: "flex", gap: "8px" }}>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        const url = selectedFile.downloadUrl || selectedFile.url || selectedFile.viewUrl;
                                        downloadFile(url, selectedFile.name);
                                    }}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "6px",
                                        padding: "8px 16px",
                                        background: "rgba(255,255,255,0.15)",
                                        border: "2px solid #000",
                                        borderRadius: "10px",
                                        fontSize: "12px",
                                        fontWeight: 600,
                                        color: "#fff",
                                        cursor: "pointer",
                                    }}
                                >
                                    <IconDownload size={14} />
                                    Download
                                </button>
                                <button
                                    onClick={() => setSelectedFile(null)}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        width: "40px",
                                        height: "40px",
                                        background: "#ef4444",
                                        color: "#fff",
                                        border: "2px solid #000",
                                        borderRadius: "10px",
                                        cursor: "pointer",
                                        boxShadow: "2px 2px 0 #000",
                                        fontSize: "18px",
                                    }}
                                >
                                    <IconX size={18} />
                                </button>
                            </div>
                        </div>

                        <div style={{ flex: 1, overflow: "hidden" }}>
                            <PDFViewer
                                fileUrl={selectedFile.viewUrl || selectedFile.url || selectedFile.downloadUrl}
                                title={selectedFile.name}
                                viewerType={viewerType === "google" ? "modern" : viewerType}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}