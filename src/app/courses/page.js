import Link from "next/link";
import { prisma } from "@/lib/prisma";
import VisitTracker from "@/components/VisitTracker";
import { IconClock, IconStar } from "@/components/Icons";

export const dynamic = "force-dynamic";

export default async function CoursesPage() {
    const courses = await prisma.course.findMany({
        where: { isActive: true },
        orderBy: { createdAt: "desc" },
        include: { courseType: true },
    });

    const normalizedCourses = courses.map((course) => ({
        ...course,
        rating: Number(course.rating || 4.5),
        discountPercent: Number(course.discountPercent || 0),
        originalPrice: Number(course.originalPrice || 0),
        offerPrice: Number(course.offerPrice || 0),
    }));

    return (
        <div className="min-h-screen" style={{ background: "var(--bg)", color: "var(--text-primary)" }}>
            <VisitTracker />
            <section className="mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20" style={{ maxWidth: "1300px" }}>
                {/* Header */}
                <div className="mb-12">
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--brand-primary)" }}>
                                Our Library
                            </p>
                            <h1 className="mt-3 text-4xl font-bold" style={{ letterSpacing: "-0.02em" }}>
                                Explore Our Courses
                            </h1>
                            <p className="mt-2 text-base" style={{ color: "var(--text-secondary)" }}>
                                {normalizedCourses.length} {normalizedCourses.length === 1 ? "course" : "courses"} available
                            </p>
                        </div>
                        <Link
                            href="/"
                            className="inline-flex items-center justify-center px-5 py-2 rounded-lg font-medium transition-all hover:translate-x-1"
                            style={{
                                background: "var(--brand-primary-light)",
                                color: "var(--brand-primary)",
                            }}
                        >
                            ← Back to Home
                        </Link>
                    </div>
                </div>

                {/* Course Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {normalizedCourses.map((course) => (
                        <Link
                            key={course.id}
                            href={`/courses/${course.slug}`}
                            className="group rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg hover:translate-y-[-4px]"
                            style={{
                                border: "1px solid var(--border-light)",
                                background: "var(--paper)",
                                boxShadow: "var(--shadow-sm)",
                            }}
                        >
                            {/* Image */}
                            <div className="relative aspect-video w-full overflow-hidden bg-gradient-to-br from-slate-200 to-slate-300">
                                {course.courseImage ? (
                                    <img
                                        src={course.courseImage}
                                        alt={`${course.title} banner`}
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        loading="lazy"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center">
                                        <div className="text-center px-4">
                                            <p className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
                                                {course.title}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Discount Badge */}
                                {course.discountPercent > 0 && (
                                    <div
                                        className="absolute top-3 right-3 px-3 py-1 rounded-full font-bold text-sm text-white"
                                        style={{
                                            background: "var(--danger)",
                                            boxShadow: "var(--shadow-md)",
                                        }}
                                    >
                                        {Math.round(course.discountPercent)}% OFF
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="p-5">
                                {/* Category Badge */}
                                <div className="flex items-center gap-2 mb-3">
                                    <span
                                        className="inline-block px-2.5 py-1 rounded-md text-xs font-semibold"
                                        style={{
                                            background: "var(--brand-primary-light)",
                                            color: "var(--brand-primary)",
                                        }}
                                    >
                                        {course.courseType?.name || "General"}
                                    </span>
                                    {course.duration && (
                                        <span className="inline-flex items-center gap-1 text-xs" style={{ color: "var(--text-tertiary)" }}>
                                            <IconClock size={12} /> {course.duration}
                                        </span>
                                    )}
                                </div>

                                {/* Title */}
                                <h3 className="text-base font-semibold leading-snug line-clamp-2" style={{ color: "var(--text-primary)" }}>
                                    {course.title}
                                </h3>

                                {/* Rating */}
                                <div className="mt-3 flex items-center gap-1">
                                    <div className="flex items-center gap-0.5">
                                        {Array.from({ length: Math.round(course.rating) }).map((_, idx) => (
                                            <IconStar key={idx} size={13} color="var(--warning)" />
                                        ))}
                                    </div>
                                    <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
                                        {course.rating.toFixed(1)}
                                    </span>
                                </div>

                                {/* Pricing */}
                                <div className="mt-4 pt-4" style={{ borderTop: "1px solid var(--border-light)" }}>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
                                            ₹{course.offerPrice.toFixed(0)}
                                        </span>
                                        {course.originalPrice > course.offerPrice && (
                                            <span className="text-sm" style={{ color: "var(--text-tertiary)", textDecoration: "line-through" }}>
                                                ₹{course.originalPrice.toFixed(0)}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Empty State */}
                {normalizedCourses.length === 0 && (
                    <div
                        className="rounded-xl border-2 border-dashed p-12 text-center"
                        style={{
                            borderColor: "var(--border-default)",
                            background: "var(--paper)",
                        }}
                    >
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ background: "var(--bg)" }}>
                            <span className="text-2xl">📚</span>
                        </div>
                        <h3 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
                            No Courses Available
                        </h3>
                        <p className="mt-2" style={{ color: "var(--text-secondary)" }}>
                            Check back soon for new courses!
                        </p>
                    </div>
                )}
            </section>
        </div>
    );
}
