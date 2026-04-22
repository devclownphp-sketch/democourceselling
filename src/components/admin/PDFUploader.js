"use client";

import { useState, useRef } from "react";

export default function PDFUploader({ courseId, existingPdfs = [], onUploadComplete }) {
    const [pdfs, setPdfs] = useState(existingPdfs);
    const [uploading, setUploading] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileSelect = async (files) => {
        const fileArray = Array.from(files);
        const pdfFiles = fileArray.filter(f => f.type === "application/pdf");

        if (pdfFiles.length !== fileArray.length) {
            setError("Only PDF files are allowed");
            return;
        }

        if (pdfFiles.length > 10) {
            setError("Maximum 10 files can be uploaded at once");
            return;
        }

        setError(null);
        setUploading(true);

        try {
            for (const file of pdfFiles) {
                const formData = new FormData();
                formData.append("file", file);
                formData.append("courseId", courseId);

                const res = await fetch("/api/admin/pdfs/upload", {
                    method: "POST",
                    body: formData,
                });

                if (!res.ok) {
                    const data = await res.json();
                    throw new Error(data.error || "Upload failed");
                }

                const data = await res.json();
                setPdfs(prev => [...prev, data.pdf]);
            }

            if (onUploadComplete) {
                onUploadComplete(pdfs);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        const files = e.dataTransfer.files;
        handleFileSelect(files);
    };

    const handleDelete = async (pdfId) => {
        if (!confirm("Are you sure you want to delete this PDF?")) return;

        try {
            const res = await fetch(`/api/admin/pdfs/${pdfId}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                throw new Error("Delete failed");
            }

            setPdfs(prev => prev.filter(p => p.id !== pdfId));
        } catch (err) {
            setError("Failed to delete PDF");
        }
    };

    const handleReorder = async (fromIndex, toIndex) => {
        const newPdfs = [...pdfs];
        const [removed] = newPdfs.splice(fromIndex, 1);
        newPdfs.splice(toIndex, 0, removed);
        setPdfs(newPdfs);

        // Update server with new order
        try {
            await fetch(`/api/admin/pdfs/reorder`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    courseId,
                    pdfIds: newPdfs.map(p => p.id),
                }),
            });
        } catch (err) {
            setError("Failed to reorder PDFs");
        }
    };

    return (
        <div className="pdf-uploader">
            {/* Drop Zone */}
            <div
                className={`pdf-drop-zone ${dragOver ? "drag-over" : ""} ${uploading ? "uploading" : ""}`}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => !uploading && fileInputRef.current?.click()}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,application/pdf"
                    multiple
                    onChange={(e) => handleFileSelect(e.target.files)}
                    style={{ display: "none" }}
                />
                <div className="pdf-drop-zone-content">
                    {uploading ? (
                        <>
                            <div className="pdf-upload-spinner" />
                            <p>Uploading...</p>
                        </>
                    ) : (
                        <>
                            <div className="pdf-drop-icon">📄</div>
                            <p className="pdf-drop-title">Drag & Drop PDFs here</p>
                            <p className="pdf-drop-subtitle">or click to browse</p>
                            <p className="pdf-drop-hint">Max 10 files at once</p>
                        </>
                    )}
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="pdf-error">
                    <span>⚠️ {error}</span>
                    <button onClick={() => setError(null)}>✕</button>
                </div>
            )}

            {/* PDF List */}
            {pdfs.length > 0 && (
                <div className="pdf-list">
                    <div className="pdf-list-header">
                        <h4>Uploaded PDFs ({pdfs.length})</h4>
                        <span className="pdf-list-hint">Drag to reorder</span>
                    </div>
                    <div className="pdf-list-items">
                        {pdfs.map((pdf, index) => (
                            <div key={pdf.id} className="pdf-item" data-index={index}>
                                <div className="pdf-item-drag">
                                    <span>⋮⋮</span>
                                </div>
                                <div className="pdf-item-icon">📄</div>
                                <div className="pdf-item-info">
                                    <p className="pdf-item-name">{pdf.name}</p>
                                    <p className="pdf-item-size">
                                        {pdf.size ? `${(pdf.size / 1024).toFixed(1)} KB` : ""}
                                    </p>
                                </div>
                                <div className="pdf-item-actions">
                                    <button
                                        className="pdf-action-btn"
                                        onClick={() => window.open(pdf.url, "_blank")}
                                        title="View"
                                    >
                                        👁
                                    </button>
                                    <button
                                        className="pdf-action-btn pdf-action-delete"
                                        onClick={() => handleDelete(pdf.id)}
                                        title="Delete"
                                    >
                                        🗑
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <style jsx>{`
                .pdf-uploader {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .pdf-drop-zone {
                    border: 3px dashed #000;
                    border-radius: 16px;
                    padding: 2rem;
                    text-align: center;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    background: #fff;
                }

                .pdf-drop-zone:hover {
                    background: #f5f5f5;
                }

                .pdf-drop-zone.drag-over {
                    background: #ffd400;
                    border-color: #000;
                    border-style: solid;
                }

                .pdf-drop-zone.uploading {
                    pointer-events: none;
                    opacity: 0.7;
                }

                .pdf-drop-zone-content {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0.5rem;
                }

                .pdf-drop-icon {
                    font-size: 3rem;
                    margin-bottom: 0.5rem;
                }

                .pdf-drop-title {
                    font-weight: 700;
                    font-size: 1rem;
                    margin: 0;
                }

                .pdf-drop-subtitle {
                    font-size: 0.85rem;
                    opacity: 0.7;
                    margin: 0;
                }

                .pdf-drop-hint {
                    font-size: 0.75rem;
                    opacity: 0.5;
                    margin: 0;
                }

                .pdf-upload-spinner {
                    width: 40px;
                    height: 40px;
                    border: 4px solid #f5f5f5;
                    border-top-color: #000;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                .pdf-error {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0.75rem 1rem;
                    background: #fee2e2;
                    border: 2px solid #ef4444;
                    border-radius: 12px;
                    color: #ef4444;
                    font-weight: 600;
                    font-size: 0.85rem;
                }

                .pdf-error button {
                    background: none;
                    border: none;
                    cursor: pointer;
                    font-size: 1rem;
                    padding: 0;
                }

                .pdf-list {
                    background: #f5f5f5;
                    border-radius: 16px;
                    padding: 1rem;
                    border: 2px solid #000;
                }

                .pdf-list-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 1rem;
                }

                .pdf-list-header h4 {
                    margin: 0;
                    font-size: 0.9rem;
                    font-weight: 700;
                }

                .pdf-list-hint {
                    font-size: 0.75rem;
                    opacity: 0.6;
                }

                .pdf-list-items {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .pdf-item {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.75rem;
                    background: #fff;
                    border-radius: 12px;
                    border: 2px solid #000;
                    box-shadow: 3px 3px 0 #000;
                }

                .pdf-item-drag {
                    cursor: grab;
                    opacity: 0.4;
                    font-size: 0.8rem;
                }

                .pdf-item-drag:active {
                    cursor: grabbing;
                }

                .pdf-item-icon {
                    font-size: 1.5rem;
                }

                .pdf-item-info {
                    flex: 1;
                    min-width: 0;
                }

                .pdf-item-name {
                    margin: 0;
                    font-weight: 600;
                    font-size: 0.85rem;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .pdf-item-size {
                    margin: 0;
                    font-size: 0.7rem;
                    opacity: 0.6;
                }

                .pdf-item-actions {
                    display: flex;
                    gap: 0.5rem;
                }

                .pdf-action-btn {
                    width: 32px;
                    height: 32px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: 2px solid #000;
                    border-radius: 8px;
                    background: #fff;
                    cursor: pointer;
                    font-size: 0.9rem;
                    transition: all 0.2s ease;
                }

                .pdf-action-btn:hover {
                    background: #f5f5f5;
                    transform: translate(-1px, -1px);
                    box-shadow: 2px 2px 0 #000;
                }

                .pdf-action-delete {
                    background: #fee2e2;
                }

                .pdf-action-delete:hover {
                    background: #ef4444;
                    color: #fff;
                }
            `}</style>
        </div>
    );
}
