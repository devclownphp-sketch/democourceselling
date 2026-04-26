"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CertificatesSearchForm() {
    const router = useRouter();
    const [searchType, setSearchType] = useState("regId");
    const [searchValue, setSearchValue] = useState("");
    const [loading, setLoading] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const [error, setError] = useState("");
    const [preview, setPreview] = useState(null);
    const [termsAccepted, setTermsAccepted] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchValue.trim()) return;

        setLoading(true);
        setError("");
        setPreview(null);
        setTermsAccepted(false);

        try {
            const response = await fetch(`/api/certificates/search?type=${searchType}&value=${encodeURIComponent(searchValue.trim())}`);
            const data = await response.json();

            if (!response.ok || !data.found) {
                setError(data.error || "Certificate not found. Please check your ID and try again.");
                return;
            }

            setPreview(data.certificate);
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async () => {
        if (!preview || !preview.downloadUrl) return;
        if (!termsAccepted) {
            setError("Please accept the terms before downloading.");
            return;
        }

        setDownloading(true);
        setError("");

        try {
            try {
                await fetch("/api/certificates/accept-terms", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ regId: preview.regId }),
                });
            } catch (e) {
                console.error("Accept terms failed:", e);
            }

            const response = await fetch(preview.downloadUrl);
            if (!response.ok) throw new Error("Download failed");

            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = blobUrl;
            link.download = `${preview.studentName.replace(/\s+/g, '_')}_${preview.regId}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
        } catch {
            if (preview.downloadUrl) {
                window.open(preview.downloadUrl, "_blank");
            } else {
                setError("Failed to download certificate. Please try again.");
            }
        } finally {
            setDownloading(false);
        }
    };

    return (
        <div style={{
            padding: "2rem", background: "#fff",
            border: "4px solid #000", borderRadius: "20px",
            boxShadow: "6px 6px 0 #000",
        }}>
            <form onSubmit={handleSearch}>
                <div style={{ marginBottom: "1.5rem" }}>
                    <label style={{ display: "flex", flexDirection: "column", gap: "0.5rem", fontWeight: 700, marginBottom: "1rem", color: "#000" }}>
                        Search By
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                            <button
                                type="button"
                                onClick={() => { setSearchType("regId"); setPreview(null); setError(""); }}
                                style={{
                                    flex: 1, padding: "0.75rem",
                                    background: searchType === "regId" ? "#ffd400" : "#f5f5f5",
                                    color: "#000",
                                    border: searchType === "regId" ? "3px solid #000" : "3px solid #ddd",
                                    borderRadius: "14px", fontWeight: 700,
                                    cursor: "pointer", transition: "all 0.2s ease",
                                    boxShadow: searchType === "regId" ? "3px 3px 0 #000" : "none",
                                }}
                            >
                                Registration ID
                            </button>
                            <button
                                type="button"
                                onClick={() => { setSearchType("certId"); setPreview(null); setError(""); }}
                                style={{
                                    flex: 1, padding: "0.75rem",
                                    background: searchType === "certId" ? "#ffd400" : "#f5f5f5",
                                    color: "#000",
                                    border: searchType === "certId" ? "3px solid #000" : "3px solid #ddd",
                                    borderRadius: "14px", fontWeight: 700,
                                    cursor: "pointer", transition: "all 0.2s ease",
                                    boxShadow: searchType === "certId" ? "3px 3px 0 #000" : "none",
                                }}
                            >
                                Certificate ID
                            </button>
                        </div>
                    </label>

                    <input
                        type="text"
                        value={searchValue}
                        onChange={(e) => { setSearchValue(e.target.value); setError(""); setPreview(null); }}
                        placeholder={searchType === "regId" ? "e.g., WC-ABC1234" : "e.g., ABC1234 (7 letters)"}
                        required
                        style={{
                            padding: "1rem", border: "4px solid #000",
                            borderRadius: "16px", fontSize: "1.1rem",
                            fontWeight: 600, textTransform: "uppercase",
                            width: "100%", background: "#fff", color: "#000",
                        }}
                    />
                    <p style={{ fontSize: "0.85rem", color: "#888", marginTop: "0.5rem" }}>
                        {searchType === "regId"
                            ? "Your registration ID is on your course completion email"
                            : "The 7-letter certificate ID from your certificate"}
                    </p>
                </div>

                {error && (
                    <div style={{
                        padding: "1rem", background: "#fef2f2",
                        border: "3px solid #ef4444", borderRadius: "14px",
                        color: "#dc2626", fontWeight: 600, marginBottom: "1rem",
                    }}>
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        width: "100%", padding: "1rem",
                        background: loading ? "#e5e7eb" : "#000",
                        color: loading ? "#999" : "#ffd400",
                        border: "3px solid #000",
                        borderRadius: "14px", fontWeight: 800, fontSize: "1rem",
                        cursor: loading ? "not-allowed" : "pointer",
                        transition: "all 0.2s ease",
                        boxShadow: loading ? "none" : "4px 4px 0 #000",
                        textTransform: "uppercase",
                    }}
                >
                    {loading ? "Searching..." : "🔍 Search Certificate"}
                </button>
            </form>

            {preview && (
                <div style={{
                    marginTop: "1.5rem", padding: "1.5rem",
                    background: "#fffbeb", borderRadius: "16px",
                    border: "3px solid #ffd400",
                }}>
                    <h3 style={{
                        fontSize: "1.1rem", fontWeight: 800, marginBottom: "1rem",
                        display: "flex", alignItems: "center", gap: "0.5rem", color: "#000",
                    }}>
                        <span style={{ color: "#22c55e" }}>✓</span> Certificate Found!
                    </h3>

                    <div style={{ display: "grid", gap: "0.75rem" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem 0", borderBottom: "2px solid #f0e6c0" }}>
                            <span style={{ fontWeight: 600, color: "#888" }}>Student Name</span>
                            <span style={{ fontWeight: 700, color: "#000" }}>{preview.studentName}</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem 0", borderBottom: "2px solid #f0e6c0" }}>
                            <span style={{ fontWeight: 600, color: "#888" }}>Course</span>
                            <span style={{ fontWeight: 700, color: "#000" }}>{preview.courseName}</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem 0", borderBottom: "2px solid #f0e6c0" }}>
                            <span style={{ fontWeight: 600, color: "#888" }}>Reg. ID</span>
                            <span style={{ fontWeight: 700, fontFamily: "monospace", color: "#000" }}>{preview.regId}</span>
                        </div>
                        {preview.duration && (
                            <div style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem 0", borderBottom: "2px solid #f0e6c0" }}>
                                <span style={{ fontWeight: 600, color: "#888" }}>Duration</span>
                                <span style={{ fontWeight: 700, color: "#000" }}>{preview.duration}</span>
                            </div>
                        )}
                        <div style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem 0" }}>
                            <span style={{ fontWeight: 600, color: "#888" }}>Issued</span>
                            <span style={{ fontWeight: 700, color: "#000" }}>{preview.issuedAt ? new Date(preview.issuedAt).toLocaleDateString("en-IN") : "N/A"}</span>
                        </div>
                    </div>

                    <div style={{
                        marginTop: "1.25rem", padding: "1rem",
                        background: "#fff", borderRadius: "14px",
                        border: "3px solid #000",
                    }}>
                        <label style={{
                            display: "flex", alignItems: "flex-start",
                            gap: "0.75rem", cursor: "pointer",
                            fontSize: "0.85rem", color: "#333", lineHeight: 1.5,
                        }}>
                            <input
                                type="checkbox"
                                checked={termsAccepted}
                                onChange={(e) => { setTermsAccepted(e.target.checked); setError(""); }}
                                style={{
                                    width: "20px", height: "20px", cursor: "pointer",
                                    accentColor: "#22c55e", marginTop: "2px", flexShrink: 0,
                                }}
                            />
                            <span>
                                I accept that I am downloading my official certificate issued by STP Computer Education. I confirm that I am the authorized recipient of this certificate and understand that this document is digitally generated and verified.
                            </span>
                        </label>
                    </div>

                    <button
                        onClick={handleDownload}
                        disabled={!termsAccepted || downloading}
                        style={{
                            width: "100%", marginTop: "1rem", padding: "1rem",
                            background: !termsAccepted ? "#e5e7eb" : "#000",
                            color: !termsAccepted ? "#999" : "#ffd400",
                            border: "3px solid #000",
                            borderRadius: "14px", fontWeight: 800, fontSize: "1rem",
                            cursor: !termsAccepted || downloading ? "not-allowed" : "pointer",
                            transition: "all 0.2s ease",
                            opacity: downloading ? 0.7 : 1,
                            textTransform: "uppercase",
                            boxShadow: !termsAccepted ? "none" : "4px 4px 0 #000",
                        }}
                    >
                        {downloading ? "⏳ Downloading..." : !termsAccepted ? "🔒 Accept Terms to Download" : "⬇ Download Certificate"}
                    </button>
                </div>
            )}
        </div>
    );
}
