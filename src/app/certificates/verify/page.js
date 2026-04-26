"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function VerifyCertificatePage() {
    const searchParams = useSearchParams();
    const regIdParam = searchParams.get("regId");
    const certIdParam = searchParams.get("certId");

    const [certificate, setCertificate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [downloading, setDownloading] = useState(false);

    useEffect(() => {
        async function fetchCertificate() {
            try {
                let url = "/api/certificates/search?";
                if (regIdParam) url += `type=regId&value=${encodeURIComponent(regIdParam)}`;
                else if (certIdParam) url += `type=certId&value=${encodeURIComponent(certIdParam)}`;
                else { setLoading(false); return; }

                const res = await fetch(url);
                const data = await res.json();
                if (res.ok && data.found) {
                    setCertificate(data.certificate);
                }
            } catch {
                setError("Failed to load certificate");
            } finally {
                setLoading(false);
            }
        }
        fetchCertificate();
    }, [regIdParam, certIdParam]);

    function formatDate(date) {
        if (!date) return "";
        const d = new Date(date);
        return d.toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });
    }

    const handleDownload = async () => {
        if (!certificate || !certificate.downloadUrl) return;
        if (!termsAccepted) {
            setError("Please accept the terms before downloading.");
            return;
        }

        setDownloading(true);
        setError("");

        try {
            await fetch("/api/certificates/accept-terms", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ regId: certificate.regId }),
            }).catch(() => {});

            const response = await fetch(certificate.downloadUrl);
            if (!response.ok) throw new Error("Download failed");

            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = blobUrl;
            link.download = `${certificate.regId}-certificate.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
        } catch {
            if (certificate.downloadUrl) {
                window.open(certificate.downloadUrl, "_blank");
            } else {
                setError("Failed to download. Please try again.");
            }
        } finally {
            setDownloading(false);
        }
    };

    if (loading) {
        return (
            <div style={{ minHeight: "100vh", background: "#F9FAFB", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <p style={{ color: "#666", fontWeight: 600 }}>Loading certificate...</p>
            </div>
        );
    }

    if (!certificate) {
        return (
            <div style={{ minHeight: "100vh", background: "#F9FAFB" }}>
                <div style={{ maxWidth: "600px", margin: "0 auto", padding: "6rem 1.5rem", textAlign: "center" }}>
                    <div style={{
                        padding: "3rem", background: "#fff", borderRadius: "20px",
                        border: "4px solid #000", boxShadow: "6px 6px 0 #000",
                    }}>
                        <span style={{ fontSize: "4rem", display: "block", marginBottom: "1rem" }}>❌</span>
                        <h1 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "0.5rem", color: "#000" }}>Certificate Not Found</h1>
                        <p style={{ color: "#666", marginBottom: "1.5rem" }}>
                            No certificate found. Please check your ID and try again.
                        </p>
                        <Link href="/certificates" style={{
                            display: "inline-block", padding: "0.75rem 1.75rem",
                            background: "#000", color: "#ffd400", borderRadius: "14px",
                            fontWeight: 800, textDecoration: "none", border: "3px solid #000",
                            textTransform: "uppercase", fontSize: "0.85rem",
                        }}>
                            Try Another ID
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: "100vh", background: "#F9FAFB" }}>
            <div style={{
                background: "linear-gradient(135deg, #ffd400 0%, #ffe066 50%, #ffd400 100%)",
                borderBottom: "4px solid #000",
                padding: "2rem 1.5rem 1.75rem",
                textAlign: "center",
                position: "relative",
                overflow: "hidden",
            }}>
                <div style={{
                    position: "absolute", top: 0, left: 0, right: 0, height: "4px",
                    background: "repeating-linear-gradient(90deg, #000 0, #000 8px, transparent 8px, transparent 16px)",
                }} />
                <div style={{ maxWidth: "800px", margin: "0 auto" }}>
                    <span style={{
                        display: "inline-block", fontSize: "0.7rem", fontWeight: 800,
                        textTransform: "uppercase", letterSpacing: "0.2em",
                        marginBottom: "0.25rem", color: "#166534",
                    }}>
                        ✓ Verified Certificate
                    </span>
                    <h1 style={{
                        fontSize: "clamp(1.5rem, 3.5vw, 2.25rem)", fontWeight: 900,
                        margin: 0, color: "#000", textTransform: "uppercase",
                        letterSpacing: "-0.02em",
                    }}>
                        Your Certificate
                    </h1>
                </div>
            </div>

            <div style={{ maxWidth: "700px", margin: "0 auto", padding: "2.5rem 1.5rem" }}>
                <div style={{
                    padding: "2rem", marginBottom: "2rem",
                    background: "#fff", borderRadius: "20px",
                    border: "4px solid #000", boxShadow: "6px 6px 0 #000",
                }}>
                    <div style={{ display: "grid", gap: "1rem", marginBottom: "1.5rem" }}>
                        <div>
                            <span style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "#888" }}>Registration ID</span>
                            <p style={{ fontSize: "1.5rem", fontWeight: 800, margin: "0.25rem 0 0", color: "#000", fontFamily: "monospace" }}>{certificate.regId}</p>
                        </div>
                        {certificate.certificateId && (
                            <div>
                                <span style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "#888" }}>Certificate ID</span>
                                <p style={{ fontSize: "1.25rem", fontWeight: 800, margin: "0.25rem 0 0", color: "#6f42c1", fontFamily: "monospace" }}>{certificate.certificateId}</p>
                            </div>
                        )}
                        <div>
                            <span style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "#888" }}>Student Name</span>
                            <p style={{ fontSize: "1.25rem", fontWeight: 700, margin: "0.25rem 0 0", color: "#000" }}>{certificate.studentName}</p>
                        </div>
                        <div>
                            <span style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "#888" }}>Course</span>
                            <p style={{ fontSize: "1.1rem", fontWeight: 600, margin: "0.25rem 0 0", color: "#333" }}>{certificate.courseName}</p>
                        </div>
                        {certificate.duration && (
                            <div>
                                <span style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "#888" }}>Duration</span>
                                <p style={{ fontWeight: 600, margin: "0.25rem 0 0", color: "#333" }}>{certificate.duration}</p>
                            </div>
                        )}
                        <div>
                            <span style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "#888" }}>Issued On</span>
                            <p style={{ fontWeight: 600, margin: "0.25rem 0 0", color: "#333" }}>{formatDate(certificate.issuedAt)}</p>
                        </div>
                    </div>

                    <div style={{
                        padding: "1.5rem", background: "#fffbeb", borderRadius: "16px",
                        border: "3px solid #ffd400", textAlign: "center",
                    }}>
                        <h3 style={{ fontSize: "1.1rem", fontWeight: 800, margin: "0 0 1rem", color: "#000" }}>Download Your Certificate</h3>
                        {certificate.downloadUrl ? (
                            <>
                                <div style={{
                                    marginBottom: "1rem", padding: "0.75rem",
                                    background: "#fff", borderRadius: "12px",
                                    border: "2px solid #000", textAlign: "left",
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
                                            style={{ width: "20px", height: "20px", cursor: "pointer", accentColor: "#22c55e", marginTop: "2px", flexShrink: 0 }}
                                        />
                                        <span>
                                            I accept that I am downloading my official certificate issued by STP Computer Education. I confirm that I am the authorized recipient.
                                        </span>
                                    </label>
                                </div>

                                {error && (
                                    <p style={{ color: "#ef4444", fontWeight: 600, marginBottom: "0.75rem", fontSize: "0.85rem" }}>
                                        {error}
                                    </p>
                                )}

                                <button
                                    onClick={handleDownload}
                                    disabled={!termsAccepted || downloading}
                                    style={{
                                        display: "inline-flex", alignItems: "center", gap: "0.5rem",
                                        padding: "0.85rem 2rem",
                                        background: !termsAccepted ? "#e5e7eb" : "#000",
                                        color: !termsAccepted ? "#999" : "#ffd400",
                                        border: "3px solid #000",
                                        borderRadius: "14px", fontWeight: 800, fontSize: "0.9rem",
                                        textTransform: "uppercase",
                                        cursor: !termsAccepted || downloading ? "not-allowed" : "pointer",
                                        transition: "all 0.3s ease",
                                        opacity: downloading ? 0.7 : 1,
                                        boxShadow: !termsAccepted ? "none" : "4px 4px 0 #000",
                                    }}
                                >
                                    {downloading ? "⏳ Downloading..." : !termsAccepted ? "🔒 Accept Terms First" : "⬇ Download PDF Certificate"}
                                </button>
                            </>
                        ) : (
                            <p style={{ color: "#ef4444", fontWeight: 600, marginTop: "1rem" }}>
                                Certificate file not available. Contact support.
                            </p>
                        )}
                    </div>
                </div>

                <div style={{ textAlign: "center" }}>
                    <Link href="/certificates" style={{ color: "#000", textDecoration: "underline", fontSize: "0.9rem", fontWeight: 600 }}>
                        ← Search Another Certificate
                    </Link>
                </div>
            </div>
        </div>
    );
}
