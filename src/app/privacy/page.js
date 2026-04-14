import Link from "next/link";

export const metadata = {
    title: "Privacy Policy — WEBCOM",
    description: "Read our privacy policy to understand how WEBCOM handles your data.",
};

export default function PrivacyPage() {
    return (
        <div className="min-h-screen" style={{ background: "#F9FAFB", color: "#111827" }}>
            {/* Hero */}
            <section
                className="py-16 md:py-20 text-center"
                style={{
                    background: "linear-gradient(135deg, #EEF2FF 0%, #F9FAFB 100%)",
                    borderBottom: "1px solid #E5E7EB",
                }}
            >
                <div className="mx-auto max-w-3xl px-4 sm:px-6">
                    <span
                        className="inline-flex items-center rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest mb-4"
                        style={{ background: "#EEF2FF", color: "#4F46E5", border: "1px solid #C7D2FE" }}
                    >
                        Legal
                    </span>
                    <h1 className="text-4xl font-black leading-tight md:text-5xl" style={{ color: "#111827", letterSpacing: "-0.02em" }}>
                        Privacy Policy
                    </h1>
                    <p className="mt-4 text-base" style={{ color: "#6B7280" }}>
                        Last updated: January 2026
                    </p>
                </div>
            </section>

            {/* Content */}
            <section className="mx-auto max-w-3xl px-4 sm:px-6 py-16 md:py-20">
                <div
                    className="rounded-2xl p-8 space-y-8"
                    style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
                >
                    <div>
                        <h2 className="text-xl font-bold mb-3" style={{ color: "#111827" }}>1. Information We Collect</h2>
                        <p className="leading-relaxed text-base" style={{ color: "#374151", lineHeight: "1.7" }}>
                            WEBCOM does not require you to create an account or log in to access our courses and resources. We may collect limited, non-personal data such as page views and browser type through standard web analytics tools to help us improve the platform.
                        </p>
                        <p className="mt-3 leading-relaxed text-base" style={{ color: "#374151", lineHeight: "1.7" }}>
                            If you submit our contact form, we collect the information you voluntarily provide — including your name, email address, phone number, and message — solely for the purpose of responding to your inquiry.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-xl font-bold mb-3" style={{ color: "#111827" }}>2. How We Use Your Information</h2>
                        <p className="leading-relaxed text-base" style={{ color: "#374151", lineHeight: "1.7" }}>
                            Any personal information collected through the contact form is used only to respond to your queries. We do not sell, trade, or share your personal information with third parties for marketing purposes.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-xl font-bold mb-3" style={{ color: "#111827" }}>3. Cookies</h2>
                        <p className="leading-relaxed text-base" style={{ color: "#374151", lineHeight: "1.7" }}>
                            WEBCOM may use cookies to enhance your browsing experience. These are small data files stored on your device. You can choose to disable cookies through your browser settings, though this may affect some functionality of the site.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-xl font-bold mb-3" style={{ color: "#111827" }}>4. Third-Party Links</h2>
                        <p className="leading-relaxed text-base" style={{ color: "#374151", lineHeight: "1.7" }}>
                            Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of those sites. We encourage you to review their privacy policies before providing any personal information.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-xl font-bold mb-3" style={{ color: "#111827" }}>5. Data Security</h2>
                        <p className="leading-relaxed text-base" style={{ color: "#374151", lineHeight: "1.7" }}>
                            We take reasonable precautions to protect your information. However, no method of transmission over the internet is 100% secure. We strive to use commercially acceptable means to protect your personal data.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-xl font-bold mb-3" style={{ color: "#111827" }}>6. Changes to This Policy</h2>
                        <p className="leading-relaxed text-base" style={{ color: "#374151", lineHeight: "1.7" }}>
                            We may update this Privacy Policy from time to time. Any changes will be reflected on this page with an updated date. We encourage you to review this policy periodically.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-xl font-bold mb-3" style={{ color: "#111827" }}>7. Contact Us</h2>
                        <p className="leading-relaxed text-base" style={{ color: "#374151", lineHeight: "1.7" }}>
                            If you have any questions about this Privacy Policy, please{" "}
                            <Link href="/contact" style={{ color: "#4F46E5", textDecoration: "underline" }}>
                                contact us
                            </Link>
                            . We are happy to address any concerns you may have.
                        </p>
                    </div>
                </div>

                <div className="mt-10 text-center">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 rounded-xl px-8 py-3 text-sm font-bold text-white transition hover:brightness-110"
                        style={{ background: "#4F46E5" }}
                    >
                        ← Back to Home
                    </Link>
                </div>
            </section>
        </div>
    );
}
