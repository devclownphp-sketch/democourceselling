"use client";

import { useEffect, useState } from "react";
import { IconPdf } from "@/components/Icons";

export default function PDFList({ folderId, folderName }) {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        setLoading(true);
        setError("");
        fetch(`/api/notes/${folderId}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.error) throw new Error(data.error);
                setFiles(data.files || []);
            })
            .catch((err) => setError(err.message || "Failed to load notes."))
            .finally(() => setLoading(false));
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
                    color: "var(--text-primary)",
                    marginBottom: "var(--spacing-md)",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                }}
            >
                <IconPdf size={20} />
                {folderName}
            </h3>

            {loading && (
                <p style={{ color: "var(--text-tertiary)", fontSize: "var(--font-size-sm)" }}>Loading notes…</p>
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
                <p style={{ color: "var(--text-tertiary)", fontSize: "var(--font-size-sm)" }}>No PDF notes available.</p>
            )}

            {!loading && !error && files.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-sm)" }}>
                    {files.map((file) => (
                        <div
                            key={file.id}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                background: "var(--paper)",
                                border: "1px solid var(--border-light)",
                                borderRadius: "var(--radius-md)",
                                padding: "var(--spacing-sm) var(--spacing-md)",
                                gap: "var(--spacing-md)",
                                flexWrap: "wrap",
                                boxShadow: "var(--shadow-xs)",
                            }}
                        >
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flex: 1, minWidth: 0 }}>
                                <IconPdf size={18} />
                                <span
                                    style={{
                                        fontSize: "var(--font-size-sm)",
                                        fontWeight: 500,
                                        color: "var(--text-primary)",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                    }}
                                    title={file.name}
                                >
                                    {file.name}
                                </span>
                                {file.size && file.size !== "0" && (
                                    <span
                                        style={{
                                            fontSize: "var(--font-size-xs)",
                                            color: "var(--text-tertiary)",
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        ({formatSize(file.size)})
                                    </span>
                                )}
                            </div>
                            <div style={{ display: "flex", gap: "var(--spacing-sm)", flexShrink: 0 }}>
                                <a
                                    href={file.viewUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-secondary"
                                    style={{ fontSize: "var(--font-size-xs)", padding: "0.3rem 0.75rem" }}
                                >
                                    View
                                </a>
                                <a
                                    href={file.downloadUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-primary"
                                    style={{ fontSize: "var(--font-size-xs)", padding: "0.3rem 0.75rem" }}
                                >
                                    Download
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
