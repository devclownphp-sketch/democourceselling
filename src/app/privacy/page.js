import Link from "next/link";

export const metadata = {
    title: "Privacy Policy — WEBCOM",
    description: "Read our privacy policy to understand how WEBCOM handles your data.",
};

export default function PrivacyPage() {
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
                        Legal
                    </span>
                    <h1 style={{
                        fontSize: "clamp(1.5rem, 4vw, 2.25rem)", fontWeight: 900,
                        textTransform: "uppercase", letterSpacing: "-0.02em",
                        margin: "0.25rem 0", color: "#000",
                    }}>
                        Privacy Policy
                    </h1>
                    <p style={{ color: "rgba(0,0,0,0.4)", fontSize: "0.85rem", fontWeight: 600, margin: 0 }}>
                        Last updated: January 2026
                    </p>
                </div>
            </section>

            <section style={{ maxWidth: "700px", margin: "0 auto", padding: "2.5rem 1rem 3rem" }}>
                <div
                    style={{
                        borderRadius: "20px", padding: "2rem", background: "#fff",
                        border: "4px solid #000", boxShadow: "6px 6px 0 #000",
                        display: "flex", flexDirection: "column", gap: "1.75rem",
                    }}
                >
                    <div>
                        <h2 style={{ fontSize: "1.05rem", fontWeight: 800, marginBottom: "0.5rem" }}>1. Information We Collect</h2>
                        <p style={{ color: "#374151", lineHeight: 1.7, margin: 0 }}>
                            WEBCOM does not require you to create an account or log in to access our courses and resources. We may collect limited, non-personal data such as page views and browser type through standard web analytics tools to help us improve the platform.
                        </p>
                        <p style={{ color: "#374151", lineHeight: 1.7, marginTop: "0.75rem" }}>
                            If you submit our contact form, we collect the information you voluntarily provide — including your name, email address, phone number, and message — solely for the purpose of responding to your inquiry.
                        </p>
                    </div>

                    <div>
                        <h2 style={{ fontSize: "1.05rem", fontWeight: 800, marginBottom: "0.5rem" }}>2. How We Use Your Information</h2>
                        <p style={{ color: "#374151", lineHeight: 1.7, margin: 0 }}>
                            Any personal information collected through the contact form is used only to respond to your queries. We do not sell, trade, or share your personal information with third parties for marketing purposes.
                        </p>
                    </div>

                    <div>
                        <h2 style={{ fontSize: "1.05rem", fontWeight: 800, marginBottom: "0.5rem" }}>3. Cookies</h2>
                        <p style={{ color: "#374151", lineHeight: 1.7, margin: 0 }}>
                            WEBCOM may use cookies to enhance your browsing experience. These are small data files stored on your device. You can choose to disable cookies through your browser settings, though this may affect some functionality of the site.
                        </p>
                    </div>

                    <div>
                        <h2 style={{ fontSize: "1.05rem", fontWeight: 800, marginBottom: "0.5rem" }}>4. Third-Party Links</h2>
                        <p style={{ color: "#374151", lineHeight: 1.7, margin: 0 }}>
                            Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of those sites. We encourage you to review their privacy policies before providing any personal information.
                        </p>
                    </div>

                    <div>
                        <h2 style={{ fontSize: "1.05rem", fontWeight: 800, marginBottom: "0.5rem" }}>5. Data Security</h2>
                        <p style={{ color: "#374151", lineHeight: 1.7, margin: 0 }}>
                            We take reasonable precautions to protect your information. However, no method of transmission over the internet is 100% secure. We strive to use commercially acceptable means to protect your personal data.
                        </p>
                    </div>

                    <div>
                        <h2 style={{ fontSize: "1.05rem", fontWeight: 800, marginBottom: "0.5rem" }}>6. Changes to This Policy</h2>
                        <p style={{ color: "#374151", lineHeight: 1.7, margin: 0 }}>
                            We may update this Privacy Policy from time to time. Any changes will be reflected on this page with an updated date. We encourage you to review this policy periodically.
                        </p>
                    </div>

                    <div>
                        <h2 style={{ fontSize: "1.05rem", fontWeight: 800, marginBottom: "0.5rem" }}>7. Contact Us</h2>
                        <p style={{ color: "#374151", lineHeight: 1.7, margin: 0 }}>
                            If you have any questions about this Privacy Policy, please{" "}
                            <Link href="/contact" style={{ color: "#000", fontWeight: 700, textDecoration: "underline" }}>
                                contact us
                            </Link>
                            . We are happy to address any concerns you may have.
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
