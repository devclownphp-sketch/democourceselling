import Link from "next/link";

export const metadata = {
    title: "About Us — WEBCOM",
    description: "Learn about WEBCOM's mission to provide free computer education to every Indian student.",
};

export default function AboutPage() {
    return (
        <div style={{ minHeight: "100vh", background: "#F9FAFB", color: "#111827" }}>
            <section
                style={{
                    background: "linear-gradient(135deg, #ffd400 0%, #ffe066 50%, #ffd400 100%)",
                    borderBottom: "4px solid #000",
                    padding: "2rem 1rem 1.75rem",
                    textAlign: "center",
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                <div style={{
                    position: "absolute", top: 0, left: 0, right: 0, height: "4px",
                    background: "repeating-linear-gradient(90deg, #000 0, #000 8px, transparent 8px, transparent 16px)",
                }} />
                <div style={{ maxWidth: "700px", margin: "0 auto" }}>
                    <span style={{
                        fontSize: "0.7rem", fontWeight: 800, textTransform: "uppercase",
                        letterSpacing: "0.2em", color: "#000", opacity: 0.5,
                    }}>
                        Our Story
                    </span>
                    <h1 style={{
                        fontSize: "clamp(1.5rem, 4vw, 2.25rem)", fontWeight: 900,
                        textTransform: "uppercase", letterSpacing: "-0.02em",
                        margin: "0.25rem 0", color: "#000",
                    }}>
                        About WEBCOM
                    </h1>
                    <p style={{ color: "rgba(0,0,0,0.55)", fontSize: "0.95rem", fontWeight: 600, margin: 0 }}>
                        Empowering every Indian student with free, quality computer education.
                    </p>
                </div>
            </section>

            <section style={{ maxWidth: "700px", margin: "0 auto", padding: "2.5rem 1rem 3rem" }}>
                <div
                    style={{
                        borderRadius: "20px", padding: "2rem", background: "#fff",
                        border: "4px solid #000", boxShadow: "6px 6px 0 #000",
                        display: "flex", flexDirection: "column", gap: "1.5rem",
                    }}
                >
                    <div>
                        <h2 style={{ fontSize: "1.15rem", fontWeight: 800, marginBottom: "0.5rem", color: "#111827" }}>Our Mission</h2>
                        <p style={{ color: "#374151", lineHeight: 1.7, margin: 0 }}>
                            WEBCOM was created with a single goal: to make quality computer education accessible to every student in India — completely free of charge. We believe that financial barriers should never stand in the way of learning. Whether you are a school student, a job seeker, or someone looking to upgrade your skills, WEBCOM is your go-to platform for practical computer knowledge.
                        </p>
                    </div>

                    <div>
                        <h2 style={{ fontSize: "1.15rem", fontWeight: 800, marginBottom: "0.5rem", color: "#111827" }}>What We Offer</h2>
                        <p style={{ color: "#374151", lineHeight: 1.7, margin: 0 }}>
                            From beginner-friendly computer courses to advanced digital skills, WEBCOM covers it all. Our platform includes structured video-style courses, downloadable PDF notes, interactive quizzes, and helpful computer tricks — all designed to help you learn at your own pace, on any device, without any login required.
                        </p>
                    </div>

                    <div>
                        <h2 style={{ fontSize: "1.15rem", fontWeight: 800, marginBottom: "0.5rem", color: "#111827" }}>Our Values</h2>
                        <p style={{ color: "#374151", lineHeight: 1.7, margin: 0 }}>
                            We are committed to transparency, simplicity, and student-first design. No ads cluttering your learning experience, no hidden paywalls, and no complicated sign-up flows. WEBCOM is built for students — by people who believe that education is a right, not a privilege.
                        </p>
                    </div>
                </div>

                <div style={{ marginTop: "2rem", textAlign: "center" }}>
                    <Link
                        href="/"
                        style={{
                            display: "inline-flex", alignItems: "center", gap: "0.5rem",
                            padding: "0.75rem 1.75rem", background: "#000", color: "#ffd400",
                            borderRadius: "14px", fontWeight: 800, textDecoration: "none",
                            border: "3px solid #000", boxShadow: "4px 4px 0 #000",
                            textTransform: "uppercase", fontSize: "0.85rem",
                        }}
                    >
                        ← Back to Home
                    </Link>
                </div>
            </section>
        </div>
    );
}
