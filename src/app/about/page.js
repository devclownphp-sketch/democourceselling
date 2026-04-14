import Link from "next/link";

export const metadata = {
    title: "About Us — WEBCOM",
    description: "Learn about WEBCOM's mission to provide free computer education to every Indian student.",
};

export default function AboutPage() {
    return (
        <div className="min-h-screen" style={{ background: "#F9FAFB", color: "#111827" }}>
            {/* Hero */}
            <section
                className="py-16 md:py-24 text-center"
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
                        Our Story
                    </span>
                    <h1 className="text-4xl font-black leading-tight md:text-5xl" style={{ color: "#111827", letterSpacing: "-0.02em" }}>
                        About WEBCOM
                    </h1>
                    <p className="mt-4 text-lg leading-relaxed" style={{ color: "#6B7280" }}>
                        Empowering every Indian student with free, quality computer education.
                    </p>
                </div>
            </section>

            {/* Content */}
            <section className="mx-auto max-w-3xl px-4 sm:px-6 py-16 md:py-20">
                <div className="space-y-10">
                    <div
                        className="rounded-2xl p-8"
                        style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
                    >
                        <h2 className="text-2xl font-bold mb-4" style={{ color: "#111827" }}>Our Mission</h2>
                        <p className="leading-relaxed text-base" style={{ color: "#374151", lineHeight: "1.7" }}>
                            WEBCOM was created with a single goal: to make quality computer education accessible to every student in India — completely free of charge. We believe that financial barriers should never stand in the way of learning. Whether you are a school student, a job seeker, or someone looking to upgrade your skills, WEBCOM is your go-to platform for practical computer knowledge.
                        </p>
                    </div>

                    <div
                        className="rounded-2xl p-8"
                        style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
                    >
                        <h2 className="text-2xl font-bold mb-4" style={{ color: "#111827" }}>What We Offer</h2>
                        <p className="leading-relaxed text-base" style={{ color: "#374151", lineHeight: "1.7" }}>
                            From beginner-friendly computer courses to advanced digital skills, WEBCOM covers it all. Our platform includes structured video-style courses, downloadable PDF notes, interactive quizzes, and helpful computer tricks — all designed to help you learn at your own pace, on any device, without any login required.
                        </p>
                    </div>

                    <div
                        className="rounded-2xl p-8"
                        style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
                    >
                        <h2 className="text-2xl font-bold mb-4" style={{ color: "#111827" }}>Our Values</h2>
                        <p className="leading-relaxed text-base" style={{ color: "#374151", lineHeight: "1.7" }}>
                            We are committed to transparency, simplicity, and student-first design. No ads cluttering your learning experience, no hidden paywalls, and no complicated sign-up flows. WEBCOM is built for students — by people who believe that education is a right, not a privilege.
                        </p>
                    </div>
                </div>

                <div className="mt-12 text-center">
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
