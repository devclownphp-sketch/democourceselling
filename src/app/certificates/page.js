import Link from "next/link";
import CertificatesSearchForm from "./CertificatesSearchForm";

export const dynamic = "force-dynamic";

export default async function CertificatesPage() {
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
                        marginBottom: "0.25rem", color: "#000", opacity: 0.5,
                    }}>
                        📜 Get Your Certificate
                    </span>
                    <h1 style={{
                        fontSize: "clamp(1.5rem, 3.5vw, 2.25rem)", fontWeight: 900,
                        margin: "0.25rem 0", color: "#000", textTransform: "uppercase",
                        letterSpacing: "-0.02em",
                    }}>
                        Download Certificate
                    </h1>
                    <p style={{ fontSize: "0.95rem", color: "rgba(0,0,0,0.55)", margin: 0, fontWeight: 600 }}>
                        Enter your registration ID or certificate ID to download
                    </p>
                </div>
            </div>

            <div style={{ maxWidth: "600px", margin: "0 auto", padding: "2.5rem 1.5rem" }}>
                <CertificatesSearchForm />

                <div style={{ marginTop: "2rem", textAlign: "center" }}>
                    <p style={{ fontSize: "0.9rem", color: "#666" }}>
                        Don't have a certificate yet?{' '}
                        <Link href="/courses" style={{ color: "#000", fontWeight: 700, textDecoration: "underline" }}>
                            Browse Courses
                        </Link>
                    </p>
                </div>
            </div>

            <section style={{
                padding: "2.5rem 1.5rem",
                background: "#fff",
                borderTop: "4px solid #000",
                textAlign: "center",
            }}>
                <h2 style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: "0.75rem", color: "#000" }}>Need Help?</h2>
                <p style={{ color: "#666", marginBottom: "1.25rem" }}>Contact us if you can't find your registration ID</p>
                <Link href="/contact" style={{
                    display: "inline-block", padding: "0.75rem 1.75rem",
                    background: "#000", color: "#ffd400", borderRadius: "14px",
                    fontWeight: 800, textDecoration: "none", border: "3px solid #000",
                    boxShadow: "4px 4px 0 #000", textTransform: "uppercase", fontSize: "0.85rem",
                }}>
                    Contact Support
                </Link>
            </section>
        </div>
    );
}
