"use client";

import { useState, useRef, useEffect } from "react";
import { IconDownload, IconPrint, IconArrowLeft, IconArrowRight, IconMaximize, IconX } from "@/components/Icons";

/* ── Modern PDF Viewer ── */
function ModernPDFViewer({ fileUrl, title, siteName = "WEBCOM", siteSlogan = "100% Free Computer Courses" }) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [scale, setScale] = useState(1.0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const containerRef = useRef(null);

        useEffect(() => {
        if (typeof window !== "undefined") {
                        const handleLoad = () => {
                setLoading(false);
                try {
                    const pdfFrame = containerRef.current?.querySelector("embed");
                    if (pdfFrame) {
                                                setTotalPages(34);
                    }
                } catch (e) {
                }
            };

            const frame = containerRef.current?.querySelector("embed");
            if (frame) {
                frame.addEventListener("load", handleLoad);
                frame.addEventListener("error", () => {
                    setLoading(false);
                    setError("Failed to load PDF");
                });
            }
        }
    }, [fileUrl]);

    const handlePrint = () => {
        const printWindow = window.open(fileUrl, "_blank");
        if (printWindow) {
            printWindow.onload = () => {
                printWindow.print();
            };
        }
    };

    const handleDownload = () => {
        const link = document.createElement("a");
        link.href = fileUrl;
        link.download = title || "document.pdf";
        link.click();
    };

    const handleFullscreen = () => {
        if (!document.fullscreenElement) {
            containerRef.current?.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener("fullscreenchange", handleFullscreenChange);
        return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
    }, []);

    const goToPrevPage = () => {
        if (currentPage > 1) setCurrentPage((p) => p - 1);
    };

    const goToNextPage = () => {
        if (currentPage < totalPages) setCurrentPage((p) => p + 1);
    };

    return (
        <div
            className="pdf-viewer-container"
            ref={containerRef}
            style={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                background: "#ffffff",
                borderRadius: isFullscreen ? "0" : "16px",
                overflow: "hidden",
                border: isFullscreen ? "none" : "4px solid #000",
                boxShadow: isFullscreen ? "none" : "8px 8px 0 #000",
            }}
        >
            {/* Header Bar */}
            <div
                style={{
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    padding: "12px 20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderBottom: "3px solid #000",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div
                        style={{
                            background: "#fff",
                            padding: "6px 12px",
                            borderRadius: "8px",
                            border: "2px solid #000",
                            boxShadow: "2px 2px 0 #000",
                        }}
                    >
                        <span
                            style={{
                                fontSize: "12px",
                                fontWeight: 800,
                                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                            }}
                        >
                            PDF
                        </span>
                    </div>
                    <div>
                        <p
                            style={{
                                margin: 0,
                                fontSize: "14px",
                                fontWeight: 700,
                                color: "#fff",
                            }}
                        >
                            {siteName}
                        </p>
                        <p
                            style={{
                                margin: 0,
                                fontSize: "10px",
                                color: "rgba(255,255,255,0.8)",
                            }}
                        >
                            {siteSlogan}
                        </p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: "flex", gap: "8px" }}>
                    <button
                        onClick={handlePrint}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            padding: "8px 14px",
                            background: "rgba(255,255,255,0.15)",
                            border: "2px solid #000",
                            borderRadius: "10px",
                            fontSize: "12px",
                            fontWeight: 600,
                            color: "#fff",
                            cursor: "pointer",
                            transition: "all 0.2s",
                        }}
                        title="Print this file"
                    >
                        <IconPrint size={14} />
                        <span>Print</span>
                    </button>
                    <button
                        onClick={handleDownload}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            padding: "8px 14px",
                            background: "rgba(255,255,255,0.15)",
                            border: "2px solid #000",
                            borderRadius: "10px",
                            fontSize: "12px",
                            fontWeight: 600,
                            color: "#fff",
                            cursor: "pointer",
                            transition: "all 0.2s",
                        }}
                        title="Download this file"
                    >
                        <IconDownload size={14} />
                        <span>Download</span>
                    </button>
                    <button
                        onClick={handleFullscreen}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            padding: "8px 14px",
                            background: "#ffd400",
                            border: "2px solid #000",
                            borderRadius: "10px",
                            fontSize: "12px",
                            fontWeight: 700,
                            color: "#000",
                            cursor: "pointer",
                            transition: "all 0.2s",
                            boxShadow: "2px 2px 0 #000",
                        }}
                        title="View full screen"
                    >
                        <IconMaximize size={14} />
                        <span>Full</span>
                    </button>
                </div>
            </div>

            {/* PDF Content Area */}
            <div
                style={{
                    flex: 1,
                    position: "relative",
                    background: "#f0f0f0",
                    overflow: "auto",
                }}
            >
                {loading && (
                    <div
                        style={{
                            position: "absolute",
                            inset: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "rgba(255,255,255,0.95)",
                            zIndex: 10,
                        }}
                    >
                        <div style={{ textAlign: "center" }}>
                            <div
                                style={{
                                    width: "48px",
                                    height: "48px",
                                    border: "4px solid #667eea",
                                    borderTopColor: "transparent",
                                    borderRadius: "50%",
                                    animation: "spin 1s linear infinite",
                                    margin: "0 auto 12px",
                                }}
                            />
                            <p style={{ color: "#666", fontSize: "14px" }}>Loading PDF...</p>
                        </div>
                    </div>
                )}

                {error && (
                    <div
                        style={{
                            position: "absolute",
                            inset: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "#fff",
                        }}
                    >
                        <div style={{ textAlign: "center", padding: "2rem" }}>
                            <p style={{ color: "#ef4444", fontSize: "16px", fontWeight: 600, marginBottom: "8px" }}>
                                Failed to load PDF
                            </p>
                            <a
                                href={fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    padding: "10px 20px",
                                    background: "#667eea",
                                    color: "#fff",
                                    borderRadius: "10px",
                                    fontWeight: 600,
                                    textDecoration: "none",
                                }}
                            >
                                Open in New Tab
                            </a>
                        </div>
                    </div>
                )}

                <embed
                    src={fileUrl}
                    type="application/pdf"
                    style={{
                        width: "100%",
                        height: "100%",
                        minHeight: "500px",
                        display: "block",
                    }}
                    onLoad={() => setLoading(false)}
                    onError={() => {
                        setLoading(false);
                        setError("Failed to load PDF");
                    }}
                />
            </div>

            {/* Footer Controls */}
            <div
                style={{
                    background: "#fff",
                    padding: "12px 20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "16px",
                    borderTop: "3px solid #e0e0e0",
                }}
            >
                <button
                    onClick={goToPrevPage}
                    disabled={currentPage <= 1}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "40px",
                        height: "40px",
                        background: currentPage > 1 ? "#f5f5f5" : "#e8e8e8",
                        border: "2px solid #000",
                        borderRadius: "10px",
                        cursor: currentPage > 1 ? "pointer" : "not-allowed",
                        opacity: currentPage > 1 ? 1 : 0.5,
                    }}
                >
                    <IconArrowLeft size={18} />
                </button>

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "8px 16px",
                        background: "#f5f5f5",
                        border: "2px solid #000",
                        borderRadius: "10px",
                    }}
                >
                    <input
                        type="number"
                        min="1"
                        max={totalPages || 999}
                        value={currentPage}
                        onChange={(e) => {
                            const val = parseInt(e.target.value);
                            if (val >= 1 && val <= (totalPages || 999)) {
                                setCurrentPage(val);
                            }
                        }}
                        style={{
                            width: "50px",
                            textAlign: "center",
                            border: "none",
                            background: "transparent",
                            fontSize: "16px",
                            fontWeight: 700,
                            outline: "none",
                        }}
                    />
                    <span style={{ color: "#666", fontSize: "14px" }}>/</span>
                    <span style={{ color: "#666", fontSize: "14px" }}>{totalPages || "?"}</span>
                </div>

                <button
                    onClick={goToNextPage}
                    disabled={currentPage >= totalPages}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "40px",
                        height: "40px",
                        background: currentPage < totalPages ? "#f5f5f5" : "#e8e8e8",
                        border: "2px solid #000",
                        borderRadius: "10px",
                        cursor: currentPage < totalPages ? "pointer" : "not-allowed",
                        opacity: currentPage < totalPages ? 1 : 0.5,
                    }}
                >
                    <IconArrowRight size={18} />
                </button>
            </div>

            {/* Animation Style */}
            <style jsx>{`
                @keyframes spin {
                    to {
                        transform: rotate(360deg);
                    }
                }
            `}</style>
        </div>
    );
}

/* ── Google Drive Viewer (unchanged) ── */
function GoogleDriveViewer({ fileUrl, title }) {
    const drivePreviewUrl = fileUrl?.includes("drive.google.com")
        ? fileUrl
        : `https://drive.google.com/file/d/uc?id=${encodeURIComponent(fileUrl)}&export=download`;

    return (
        <div className="flex flex-col items-center gap-4 p-4">
            <iframe
                src={drivePreviewUrl.replace("/view", "/preview")}
                className="w-full rounded-xl border"
                style={{ height: "600px", borderColor: "var(--border-light)" }}
                title={title || "PDF Viewer"}
                loading="lazy"
                sandbox="allow-scripts allow-same-origin allow-popups"
            />
            <a
                href={drivePreviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg px-6 py-3 font-semibold text-white transition hover:brightness-110"
                style={{ background: "var(--brand-primary)", borderRadius: "var(--radius-lg)" }}
            >
                Open in Google Drive ↗
            </a>
        </div>
    );
}

/* ── Simple Embed Viewer (fallback) ── */
function EmbedViewer({ fileUrl, title }) {
    return (
        <div className="flex flex-col gap-4 p-4">
            <div className="flex items-center justify-between rounded-lg border p-3" style={{ borderColor: "var(--border-light)", background: "var(--paper)" }}>
                <span className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                    {title || "Document Viewer"}
                </span>
            </div>
            <div className="flex-1 rounded-xl border overflow-hidden" style={{ borderColor: "var(--border-light)" }}>
                <embed
                    src={fileUrl}
                    type="application/pdf"
                    className="w-full"
                    style={{ height: "600px" }}
                />
            </div>
            <div className="flex gap-3 justify-center">
                <a
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg px-6 py-3 font-semibold text-white transition hover:brightness-110"
                    style={{ background: "var(--brand-primary)" }}
                >
                    Open Full Screen ↗
                </a>
            </div>
        </div>
    );
}

/* ── S3 Viewer ── */
function S3Viewer({ fileUrl, title }) {
    return (
        <div className="flex flex-col items-center gap-4 p-4">
            <iframe
                src={fileUrl}
                className="w-full rounded-xl border"
                style={{ height: "600px", borderColor: "var(--border-light)" }}
                title={title || "S3 PDF Viewer"}
                loading="lazy"
            />
            <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg px-6 py-3 font-semibold text-white transition hover:brightness-110"
                style={{ background: "var(--brand-primary)", borderRadius: "var(--radius-lg)" }}
            >
                Open in New Tab ↗
            </a>
        </div>
    );
}

/* ── Main PDF Viewer Component ── */
export default function PDFViewer({ fileUrl, title, viewerType = "embed" }) {
    if (!fileUrl) {
        return (
            <div className="rounded-xl border p-8 text-center" style={{ borderColor: "var(--border-light)", background: "var(--paper)" }}>
                <p style={{ color: "var(--text-tertiary)" }}>No PDF file provided</p>
            </div>
        );
    }

    switch (viewerType) {
        case "s3":
            return <S3Viewer fileUrl={fileUrl} title={title} />;
        case "drive":
            return <GoogleDriveViewer fileUrl={fileUrl} title={title} />;
        case "embed":
        case "modern":
        default:
            return <ModernPDFViewer fileUrl={fileUrl} title={title} />;
    }
}
