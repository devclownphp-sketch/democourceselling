import { prisma } from "@/lib/prisma";
import Link from "next/link";
import CertificatesSearchForm from "./CertificatesSearchForm";

export const dynamic = "force-dynamic";

export default async function CertificatesPage() {
    let templates = [];
    try {
        templates = await prisma.certificateTemplate.findMany({
            where: { isActive: true },
        });
    } catch {
        templates = [];
    }

    return (
        <div className="brutal-page">
            <div className="brutal-hero" style={{ background: "#ffd400", borderBottom: "4px solid #000" }}>
                <div style={{ maxWidth: "800px", margin: "0 auto", padding: "3rem 1.5rem", textAlign: "center" }}>
                    <span style={{ display: "inline-block", fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "0.5rem", opacity: 0.7 }}>📜 Get Your Certificate</span>
                    <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 900, textTransform: "uppercase", letterSpacing: "-0.02em", margin: "0 0 0.5rem", color: "#000" }}>Download Certificate</h1>
                    <p style={{ fontSize: "1.1rem", opacity: 0.8, margin: 0, color: "#000" }}>Enter your registration ID or certificate ID to download</p>
                </div>
            </div>

            <div style={{ maxWidth: "600px", margin: "0 auto", padding: "3rem 1.5rem" }}>
                <CertificatesSearchForm />

                <div style={{ marginTop: "2rem", textAlign: "center" }}>
                    <p style={{ fontSize: "0.9rem", color: "#666" }}>
                        Don't have a certificate yet?{' '}
                        <Link href="/courses" style={{ color: "#000", fontWeight: 700, textDecoration: "underline" }}>
                            Browse Courses
                        </Link>
                    </p>
                </div>

                {templates.length > 0 && (
                    <div style={{ marginTop: "3rem" }}>
                        <h3 style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: "1rem", textAlign: "center" }}>Sample Certificate Templates</h3>
                        <div style={{ display: "grid", gap: "1rem" }}>
                            {templates.map((template) => (
                                <div key={template.id} className="brutal-card" style={{ padding: "1.5rem" }}>
                                    <h4 style={{ fontWeight: 700, margin: "0 0 0.5rem" }}>{template.name}</h4>
                                    <p style={{ fontSize: "0.85rem", color: "#666", margin: 0 }}>Official WEBCOM Certificate</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <section style={{ padding: "3rem 1.5rem", background: "#000", color: "#fff", textAlign: "center" }}>
                <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "1rem" }}>Need Help?</h2>
                <p style={{ opacity: 0.7, marginBottom: "1.5rem" }}>Contact us if you can't find your registration ID</p>
                <Link href="/contact" style={{ display: "inline-block", padding: "0.75rem 1.5rem", background: "#ffd400", color: "#000", borderRadius: "12px", fontWeight: 700, textDecoration: "none" }}>
                    Contact Support
                </Link>
            </section>
        </div>
    );
}
