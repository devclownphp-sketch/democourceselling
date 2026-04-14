import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import VisitTracker from "@/components/VisitTracker";
import CourseEnrollButton from "@/components/CourseEnrollButton";
import { IconTarget, IconClock, IconVideo, IconStar, IconMsg } from "@/components/Icons";

export const dynamic = "force-dynamic";

function splitLines(text) {
    return String(text || "")
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);
}

export default async function CourseDetailsPage({ params }) {
    const { slug } = await params;

    const [course, reviews] = await Promise.all([
        prisma.course.findUnique({
            where: { slug },
            include: {
                courseType: true,
                driveFolders: {
                    select: { id: true },
                },
            },
        }),
        prisma.review.findMany({
            where: { isActive: true },
            orderBy: [{ sortOrder: "desc" }, { createdAt: "desc" }],
        }),
    ]);

    if (!course || !course.isActive) {
        notFound();
    }

    const normalizedCourse = {
        ...course,
        rating: Number(course.rating || 4.5),
        discountPercent: Number(course.discountPercent || 0),
        originalPrice: Number(course.originalPrice || 0),
        offerPrice: Number(course.offerPrice || 0),
    };
    const notesHref = `/courses/${normalizedCourse.slug}/notes`;

    const reviewCards = reviews.map((review) => ({
        name: review.name,
        role: review.role || "Student",
        rating: Number(review.rating || 5),
        text: review.reviewText,
    }));
    const marqueeReviews = [...reviewCards, ...reviewCards];

    return (
        <div className="min-h-screen" style={{ background: "var(--bg)", color: "var(--text-primary)" }}>
            <VisitTracker />
            <section className="mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16" style={{ maxWidth: "1280px" }}>
                {/* Back Link */}
                <div className="mb-8">
                    <Link
                        href="/courses"
                        className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:text-blue-700"
                        style={{ color: "var(--brand-primary)" }}
                    >
                        ← Back to Courses
                    </Link>
                </div>

                {/* Main Content */}
                <article
                    className="rounded-2xl overflow-hidden"
                    style={{
                        border: "1px solid var(--border-light)",
                        background: "var(--paper)",
                        boxShadow: "var(--shadow-lg)",
                    }}
                >
                    <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-0">
                        {/* Sidebar */}
                        <aside
                            className="p-8 lg:border-r"
                            style={{
                                borderColor: "var(--border-light)",
                                background: "var(--bg)",
                            }}
                        >
                            {/* Course Image */}
                            <div
                                className="aspect-video w-full overflow-hidden rounded-lg mb-6"
                                style={{
                                    border: "1px solid var(--border-light)",
                                    background: "linear-gradient(135deg, #f0f4f8, #d9e8f8)",
                                }}
                            >
                                {normalizedCourse.courseImage ? (
                                    <img
                                        src={normalizedCourse.courseImage}
                                        alt={`${normalizedCourse.title} banner`}
                                        className="h-full w-full object-cover"
                                        loading="lazy"
                                    />
                                ) : null}
                            </div>

                            {/* Metadata */}
                            <div className="space-y-4 pb-6" style={{ borderBottom: "1px solid var(--border-light)" }}>
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--text-tertiary)" }}>
                                        Category
                                    </p>
                                    <p
                                        className="mt-2 text-sm font-semibold px-3 py-1 inline-block rounded-md"
                                        style={{
                                            background: "var(--brand-primary-light)",
                                            color: "var(--brand-primary)",
                                        }}
                                    >
                                        {normalizedCourse.courseType?.name || "General"}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--text-tertiary)" }}>
                                        Rating
                                    </p>
                                    <div className="mt-2 flex items-center gap-2">
                                        <div className="flex gap-1">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <IconStar
                                                    key={i}
                                                    size={16}
                                                    color={i < Math.round(normalizedCourse.rating) ? "var(--warning)" : "var(--border-default)"}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                                            {normalizedCourse.rating.toFixed(1)}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--text-tertiary)" }}>
                                        Course Details
                                    </p>
                                    <ul className="space-y-1.5 text-sm" style={{ color: "var(--text-secondary)" }}>
                                        <li className="flex items-center gap-2"><IconClock size={14} /> {normalizedCourse.duration}</li>
                                        <li className="flex items-center gap-2"><IconVideo size={14} /> {normalizedCourse.classType}</li>
                                        <li className="flex items-center gap-2"><IconTarget size={14} /> {normalizedCourse.level}</li>
                                    </ul>
                                </div>
                            </div>

                            {/* Pricing */}
                            <div className="py-6 space-y-4">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--text-tertiary)" }}>
                                        Price
                                    </p>
                                    <div className="mt-2 flex items-baseline gap-2">
                                        <span className="text-3xl font-bold" style={{ color: "var(--text-primary)" }}>
                                            ₹{normalizedCourse.offerPrice.toFixed(0)}
                                        </span>
                                        {normalizedCourse.originalPrice > normalizedCourse.offerPrice && (
                                            <>
                                                <span className="text-sm line-through" style={{ color: "var(--text-tertiary)" }}>
                                                    ₹{normalizedCourse.originalPrice.toFixed(0)}
                                                </span>
                                                <span className="text-xs font-bold px-2 py-1 rounded" style={{ background: "var(--danger-light)", color: "var(--danger)" }}>
                                                    Save {normalizedCourse.discountPercent.toFixed(0)}%
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <CourseEnrollButton course={normalizedCourse} />
                                <Link
                                    href={notesHref}
                                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-semibold transition-all hover:-translate-y-px"
                                    style={{
                                        border: "1px solid var(--border-default)",
                                        color: "var(--text-primary)",
                                        background: "var(--paper)",
                                        boxShadow: "var(--shadow-xs)",
                                    }}
                                >
                                    <span aria-hidden="true">📄</span>
                                    <span>View PDF Notes</span>
                                </Link>
                            </div>
                        </aside>

                        {/* Main Content Area */}
                        <div className="p-8 md:p-10 space-y-10">
                            {/* Course Title & Description */}
                            <div>
                                <h1 className="text-4xl font-bold leading-tight" style={{ letterSpacing: "-0.02em", color: "var(--text-primary)" }}>
                                    {normalizedCourse.title}
                                </h1>
                                <p className="mt-4 text-lg leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                                    {normalizedCourse.whatIs}
                                </p>
                            </div>

                            {/* What You will Learn */}
                            <section>
                                <h2 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
                                    What You&apos;ll Learn
                                </h2>
                                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {splitLines(normalizedCourse.syllabusTopics).slice(0, 8).map((item, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-start gap-3 p-3 rounded-lg"
                                            style={{
                                                background: "var(--bg)",
                                                border: "1px solid var(--border-light)",
                                            }}
                                        >
                                            <span style={{ color: "var(--brand-primary)", fontWeight: "bold" }}>✓</span>
                                            <span style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Course Info Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <article
                                    className="p-6 rounded-lg"
                                    style={{
                                        border: "1px solid var(--border-light)",
                                        background: "var(--bg)",
                                    }}
                                >
                                    <h3 className="font-semibold" style={{ color: "var(--text-primary)" }}>Who Can Join</h3>
                                    <ul className="mt-3 space-y-2">
                                        {splitLines(normalizedCourse.whoCanJoin).map((item, idx) => (
                                            <li key={idx} className="text-sm flex gap-2" style={{ color: "var(--text-secondary)" }}>
                                                <span className="text-brand-primary">•</span>
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </article>

                                <article
                                    className="p-6 rounded-lg"
                                    style={{
                                        border: "1px solid var(--border-light)",
                                        background: "var(--bg)",
                                    }}
                                >
                                    <h3 className="font-semibold" style={{ color: "var(--text-primary)" }}>How to Study</h3>
                                    <ul className="mt-3 space-y-2">
                                        {splitLines(normalizedCourse.studyPlan).map((item, idx) => (
                                            <li key={idx} className="text-sm flex gap-2" style={{ color: "var(--text-secondary)" }}>
                                                <span className="text-brand-primary">•</span>
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </article>

                                <article
                                    className="p-6 rounded-lg"
                                    style={{
                                        border: "1px solid var(--border-light)",
                                        background: "var(--bg)",
                                    }}
                                >
                                    <h3 className="font-semibold" style={{ color: "var(--text-primary)" }}>After Completion</h3>
                                    <ul className="mt-3 space-y-2">
                                        {splitLines(normalizedCourse.jobsAfter).map((item, idx) => (
                                            <li key={idx} className="text-sm flex gap-2" style={{ color: "var(--text-secondary)" }}>
                                                <span className="text-brand-primary">•</span>
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </article>

                                <article
                                    className="p-6 rounded-lg"
                                    style={{
                                        border: "1px solid var(--border-light)",
                                        background: "var(--bg)",
                                    }}
                                >
                                    <h3 className="font-semibold" style={{ color: "var(--text-primary)" }}>Support Included</h3>
                                    <ul className="mt-3 space-y-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                                        <li>• {normalizedCourse.liveQna}</li>
                                        <li>• {normalizedCourse.pdfNotes}</li>
                                        <li>• {normalizedCourse.callSupport}</li>
                                        <li>• {normalizedCourse.lifetimeAccess ? "Lifetime Access" : "Limited Access"}</li>
                                    </ul>
                                </article>
                            </div>
                        </div>
                    </div>
                </article>

                {/* Reviews Section */}
                {marqueeReviews.length > 0 && (
                    <section className="mt-16">
                        <div className="mb-8">
                            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--brand-primary)" }}>
                                Student Feedback
                            </p>
                            <h2 className="mt-2 text-3xl font-bold" style={{ color: "var(--text-primary)" }}>
                                Loved by Learners
                            </h2>
                        </div>
                        <div className="overflow-hidden rounded-lg" style={{ border: "1px solid var(--border-light)" }}>
                            <div className="marquee-track flex gap-4 p-6" style={{ background: "var(--paper)" }}>
                                {marqueeReviews.map((review, idx) => (
                                    <article
                                        key={idx}
                                        className="shrink-0 w-80 p-6 rounded-lg"
                                        style={{
                                            border: "1px solid var(--border-light)",
                                            background: "var(--paper)",
                                        }}
                                    >
                                        <div className="flex items-center gap-3 mb-4">
                                            <div
                                                className="flex items-center justify-center w-12 h-12 rounded-full font-bold text-sm"
                                                style={{
                                                    background: "var(--brand-primary-light)",
                                                    color: "var(--brand-primary)",
                                                }}
                                            >
                                                {review.name?.[0]?.toUpperCase() || "U"}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
                                                    {review.name}
                                                </p>
                                                <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                                                    {review.role}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex gap-1 mb-3">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <IconStar
                                                    key={i}
                                                    size={14}
                                                    color={i < (review.rating || 5) ? "var(--warning)" : "var(--border-default)"}
                                                />
                                            ))}
                                        </div>
                                        <p
                                            className="text-sm leading-relaxed line-clamp-4"
                                            style={{ color: "var(--text-secondary)" }}
                                        >
                                            {review.text}
                                        </p>
                                    </article>
                                ))}
                            </div>
                        </div>
                    </section>
                )}
            </section>
        </div>
    );
}
