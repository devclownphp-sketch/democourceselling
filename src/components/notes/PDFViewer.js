"use client";

import { useState, useRef, useEffect } from "react";
import { IconDownload, IconPrint, IconMaximize } from "@/components/Icons";

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

export default function PDFViewer({ fileUrl, title }) {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [pdfReady, setPdfReady] = useState(false);
    const containerRef = useRef(null);
    const iframeRef = useRef(null);

    useEffect(() => {
        setPdfReady(false);
        const timer = setTimeout(() => setPdfReady(true), 500);
        return () => clearTimeout(timer);
    }, [fileUrl]);

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener("fullscreenchange", handleFullscreenChange);
        return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
    }, []);

    const handlePrint = () => {
        if (iframeRef.current) {
            iframeRef.current.contentWindow?.print();
        }
    };

    const handleDownload = () => {
        downloadFile(fileUrl, title || "document.pdf");
    };

    const handleFullscreen = () => {
        if (!document.fullscreenElement) {
            containerRef.current?.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    };

    if (!fileUrl) {
        return (
            <div
                style={{
                    padding: "3rem",
                    textAlign: "center",
                    background: "#fff",
                    border: "4px solid #000",
                    borderRadius: "20px",
                }}
            >
                <p style={{ color: "#666", fontSize: "1rem" }}>No PDF file provided</p>
            </div>
        );
    }

    const pdfUrl = fileUrl.startsWith("/") ? fileUrl : fileUrl;

    return (
        <div
            ref={containerRef}
            style={{
                display: "flex",
                flexDirection: "column",
                height: isFullscreen ? "100vh" : "85vh",
                background: "#fff",
                borderRadius: isFullscreen ? "0" : "20px",
                overflow: "hidden",
                border: isFullscreen ? "none" : "4px solid #000",
                boxShadow: isFullscreen ? "none" : "8px 8px 0 #000",
            }}
        >
            <div
                style={{
                    background: "linear-gradient(135deg, #0084D1 0%, #00a3d1 100%)",
                    padding: "12px 20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderBottom: "3px solid #000",
                    flexShrink: 0,
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div
                        style={{
                            background: "#fff",
                            padding: "6px 12px",
                            borderRadius: "10px",
                            border: "2px solid #000",
                            boxShadow: "2px 2px 0 #000",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                        }}
                    >
                        <span style={{ fontSize: "20px" }}>📄</span>
                        <span style={{ fontSize: "12px", fontWeight: 800, color: "#0084D1" }}>PDF</span>
                    </div>
                    <div>
                        <p style={{ margin: 0, fontSize: "14px", fontWeight: 700, color: "#fff" }}>
                            {title || "PDF Document"}
                        </p>
                        <p style={{ margin: "2px 0 0", fontSize: "11px", color: "rgba(255,255,255,0.8)" }}>
                            Use browser controls to navigate pages and zoom
                        </p>
                    </div>
                </div>

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
                        }}
                        title="Print"
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
                        }}
                        title="Download"
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
                            boxShadow: "2px 2px 0 #000",
                        }}
                        title="Fullscreen"
                    >
                        <IconMaximize size={14} />
                        <span>{isFullscreen ? "Exit" : "Full"}</span>
                    </button>
                </div>
            </div>

            <div
                style={{
                    flex: 1,
                    position: "relative",
                    background: "#525659",
                    overflow: "hidden",
                }}
            >
                {!pdfReady && (
                    <div
                        style={{
                            position: "absolute",
                            inset: 0,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "rgba(255,255,255,0.95)",
                            zIndex: 10,
                        }}
                    >
                        <div
                            style={{
                                width: "48px",
                                height: "48px",
                                border: "4px solid #0084D1",
                                borderTopColor: "transparent",
                                borderRadius: "50%",
                                animation: "spin 1s linear infinite",
                                marginBottom: "12px",
                            }}
                        />
                        <p style={{ color: "#666", fontSize: "14px", fontWeight: 600 }}>Loading PDF viewer...</p>
                    </div>
                )}

                <iframe
                    ref={iframeRef}
                    src={`${pdfUrl}#toolbar=1&navpanes=1&zoom=auto`}
                    style={{
                        width: "100%",
                        height: "100%",
                        border: "none",
                        opacity: pdfReady ? 1 : 0,
                        transition: "opacity 0.3s ease",
                    }}
                    title={title || "PDF Viewer"}
                    onLoad={() => setPdfReady(true)}
                />
            </div>

            <style>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
