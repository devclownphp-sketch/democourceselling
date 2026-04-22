"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CertificatesSearchForm() {
    const router = useRouter();
    const [searchType, setSearchType] = useState("regId");
    const [searchValue, setSearchValue] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [preview, setPreview] = useState(null);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchValue.trim()) return;

        setLoading(true);
        setError("");
        setPreview(null);

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

    const handleDownload = () => {
        if (preview) {
            router.push(`/certificates/verify?regId=${preview.regId}`);
        }
    };

    return (
        <div className="brutal-card" style={{ padding: "2rem" }}>
            <form onSubmit={handleSearch}>
                <div style={{ marginBottom: "1.5rem" }}>
                    <label style={{ display: "flex", flexDirection: "column", gap: "0.5rem", fontWeight: 700, marginBottom: "1rem" }}>
                        Search By
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                            <button
                                type="button"
                                onClick={() => { setSearchType("regId"); setPreview(null); setError(""); }}
                                style={{
                                    flex: 1,
                                    padding: "0.75rem",
                                    background: searchType === "regId" ? "#000" : "#fff",
                                    color: searchType === "regId" ? "#ffd400" : "#000",
                                    border: "3px solid #000",
                                    borderRadius: "12px",
                                    fontWeight: 700,
                                    cursor: "pointer",
                                }}
                            >
                                Registration ID
                            </button>
                            <button
                                type="button"
                                onClick={() => { setSearchType("certId"); setPreview(null); setError(""); }}
                                style={{
                                    flex: 1,
                                    padding: "0.75rem",
                                    background: searchType === "certId" ? "#000" : "#fff",
                                    color: searchType === "certId" ? "#ffd400" : "#000",
                                    border: "3px solid #000",
                                    borderRadius: "12px",
                                    fontWeight: 700,
                                    cursor: "pointer",
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
                            padding: "1rem",
                            border: "4px solid #000",
                            borderRadius: "16px",
                            fontSize: "1.1rem",
                            fontWeight: 600,
                            textTransform: "uppercase",
                            width: "100%",
                        }}
                    />
                    <p style={{ fontSize: "0.85rem", color: "#666", marginTop: "0.5rem" }}>
                        {searchType === "regId"
                            ? "Your registration ID is on your course completion email"
                            : "The 7-letter certificate ID from your certificate"}
                    </p>
                </div>

                {error && (
                    <div style={{
                        padding: "1rem",
                        background: "#fef2f2",
                        border: "3px solid #ef4444",
                        borderRadius: "12px",
                        color: "#ef4444",
                        fontWeight: 600,
                        marginBottom: "1rem",
                    }}>
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        width: "100%",
                        padding: "1rem",
                        background: loading ? "#666" : "#000",
                        color: "#ffd400",
                        border: "4px solid #000",
                        borderRadius: "16px",
                        fontWeight: 800,
                        fontSize: "1rem",
                        cursor: loading ? "not-allowed" : "pointer",
                        boxShadow: "4px 4px 0 #666",
                    }}
                >
                    {loading ? "Searching..." : "🔍 Search Certificate"}
                </button>
            </form>

            {preview && (
                <div style={{ marginTop: "1.5rem", padding: "1.5rem", background: "#f5f5f5", borderRadius: "16px", border: "4px solid #000" }}>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <span style={{ color: "#22c55e" }}>✓</span> Certificate Found!
                    </h3>

                    <div style={{ display: "grid", gap: "0.75rem" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem 0", borderBottom: "2px solid #e5e5e5" }}>
                            <span style={{ fontWeight: 600, color: "#666" }}>Student Name</span>
                            <span style={{ fontWeight: 700 }}>{preview.studentName}</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem 0", borderBottom: "2px solid #e5e5e5" }}>
                            <span style={{ fontWeight: 600, color: "#666" }}>Course</span>
                            <span style={{ fontWeight: 700 }}>{preview.courseName}</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem 0", borderBottom: "2px solid #e5e5e5" }}>
                            <span style={{ fontWeight: 600, color: "#666" }}>Reg. ID</span>
                            <span style={{ fontWeight: 700, fontFamily: "monospace", color: "#ffd400" }}>{preview.regId}</span>
                        </div>
                        {preview.duration && (
                            <div style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem 0", borderBottom: "2px solid #e5e5e5" }}>
                                <span style={{ fontWeight: 600, color: "#666" }}>Duration</span>
                                <span style={{ fontWeight: 700 }}>{preview.duration}</span>
                            </div>
                        )}
                        <div style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem 0" }}>
                            <span style={{ fontWeight: 600, color: "#666" }}>Issued</span>
                            <span style={{ fontWeight: 700 }}>{preview.issuedAt ? new Date(preview.issuedAt).toLocaleDateString("en-IN") : "N/A"}</span>
                        </div>
                    </div>

                    <button
                        onClick={handleDownload}
                        style={{
                            width: "100%",
                            marginTop: "1rem",
                            padding: "1rem",
                            background: "#22c55e",
                            color: "#fff",
                            border: "4px solid #000",
                            borderRadius: "16px",
                            fontWeight: 800,
                            fontSize: "1rem",
                            cursor: "pointer",
                            boxShadow: "4px 4px 0 #000",
                        }}
                    >
                        ⬇ View & Download Certificate
                    </button>
                </div>
            )}
        </div>
    );
}
