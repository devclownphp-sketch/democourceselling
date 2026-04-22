import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

function formatDate(date) {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });
}

export default async function VerifyCertificatePage({ searchParams }) {
    const regId = searchParams?.regId;

    if (!regId) {
        notFound();
    }

    const certificate = await prisma.certificate.findUnique({
        where: { regId: regId.toUpperCase() },
        include: { template: true },
    });

    if (!certificate) {
        return (
            <div className="brutal-page">
                <div style={{ maxWidth: "600px", margin: "0 auto", padding: "4rem 1.5rem", textAlign: "center" }}>
                    <div className="brutal-card" style={{ padding: "3rem" }}>
                        <span style={{ fontSize: "4rem", display: "block", marginBottom: "1rem" }}>❌</span>
                        <h1 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "0.5rem" }}>Certificate Not Found</h1>
                        <p style={{ color: "#666", marginBottom: "1.5rem" }}>
                            No certificate found with ID: <strong>{regId}</strong>
                        </p>
                        <Link href="/certificates" style={{ display: "inline-block", padding: "0.75rem 1.5rem", background: "#000", color: "#ffd400", borderRadius: "12px", fontWeight: 700, textDecoration: "none" }}>
                            Try Another ID
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="brutal-page">
            <div className="brutal-hero" style={{ background: "#ffd400", borderBottom: "4px solid #000" }}>
                <div style={{ maxWidth: "800px", margin: "0 auto", padding: "3rem 1.5rem", textAlign: "center" }}>
                    <span style={{ display: "inline-block", fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "0.5rem", opacity: 0.7 }}>✓ Verified Certificate</span>
                    <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 900, textTransform: "uppercase", letterSpacing: "-0.02em", margin: "0 0 0.5rem", color: "#000" }}>Your Certificate</h1>
                </div>
            </div>

            <div style={{ maxWidth: "700px", margin: "0 auto", padding: "3rem 1.5rem" }}>
                <div className="brutal-card" style={{ padding: "2rem", marginBottom: "2rem" }}>
                    <div style={{ display: "grid", gap: "1rem", marginBottom: "1.5rem" }}>
                        <div>
                            <span style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "#666" }}>Registration ID</span>
                            <p style={{ fontSize: "1.5rem", fontWeight: 800, margin: "0.25rem 0 0", color: "#ffd400", fontFamily: "monospace" }}>{certificate.regId}</p>
                        </div>
                        <div>
                            <span style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "#666" }}>Student Name</span>
                            <p style={{ fontSize: "1.25rem", fontWeight: 700, margin: "0.25rem 0 0" }}>{certificate.studentName}</p>
                        </div>
                        <div>
                            <span style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "#666" }}>Course</span>
                            <p style={{ fontSize: "1.1rem", fontWeight: 600, margin: "0.25rem 0 0" }}>{certificate.courseName}</p>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                            <div>
                                <span style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "#666" }}>Start Date</span>
                                <p style={{ fontWeight: 600, margin: "0.25rem 0 0" }}>{formatDate(certificate.startDate)}</p>
                            </div>
                            <div>
                                <span style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "#666" }}>End Date</span>
                                <p style={{ fontWeight: 600, margin: "0.25rem 0 0" }}>{formatDate(certificate.endDate)}</p>
                            </div>
                        </div>
                        {certificate.duration && (
                            <div>
                                <span style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "#666" }}>Duration</span>
                                <p style={{ fontWeight: 600, margin: "0.25rem 0 0" }}>{certificate.duration}</p>
                            </div>
                        )}
                        <div>
                            <span style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "#666" }}>Issued On</span>
                            <p style={{ fontWeight: 600, margin: "0.25rem 0 0" }}>{formatDate(certificate.issuedAt)}</p>
                        </div>
                    </div>

                    <div style={{ padding: "1.5rem", background: "#f5f5f5", borderRadius: "16px", border: "3px solid #000", textAlign: "center" }}>
                        <h3 style={{ fontSize: "1.25rem", fontWeight: 800, margin: "0 0 0.5rem" }}>Download Your Certificate</h3>
                        {certificate.downloadUrl ? (
                            <>
                                <p style={{ fontSize: "0.9rem", color: "#666", marginBottom: "1rem" }}>
                                    Your certificate is ready for download
                                </p>
                                <a
                                    href={certificate.downloadUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: "0.5rem",
                                        padding: "1rem 2rem",
                                        background: "#22c55e",
                                        color: "#fff",
                                        border: "4px solid #000",
                                        borderRadius: "16px",
                                        fontWeight: 800,
                                        fontSize: "1.1rem",
                                        textDecoration: "none",
                                        boxShadow: "4px 4px 0 #000",
                                        marginTop: "1rem"
                                    }}
                                >
                                    ⬇ Download PDF Certificate
                                </a>
                            </>
                        ) : (
                            <p style={{ color: "#ef4444", fontWeight: 600, marginTop: "1rem" }}>
                                Certificate file not available. Contact support.
                            </p>
                        )}
                    </div>
                </div>

                <div style={{ textAlign: "center" }}>
                    <Link href="/certificates" style={{ color: "#666", textDecoration: "underline", fontSize: "0.9rem" }}>
                        ← Search Another Certificate
                    </Link>
                </div>
            </div>
        </div>
    );
}
