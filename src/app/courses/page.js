import Link from "next/link";
import { prisma } from "@/lib/prisma";
import VisitTracker from "@/components/VisitTracker";
import { IconTarget, IconClock, IconVideo, IconEdit } from "@/components/Icons";

export const dynamic = "force-dynamic";

function splitLines(text) {
    return String(text || "")
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);
}

export default async function CoursesPage() {
    const courses = await prisma.course.findMany({
        where: { isActive: true },
        orderBy: { createdAt: "desc" },
    });

    const normalizedCourses = courses.map((course) => ({
        ...course,
        originalPrice: Number(course.originalPrice || 0),
        offerPrice: Number(course.offerPrice || 0),
    }));

    return (
        <div className="min-h-screen" style={{ background: "var(--bg)", color: "var(--ink)" }}>
            <VisitTracker />
            <section className="mx-auto w-[min(1200px,94vw)] py-12 md:py-16">
                <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div>
                        <p className="text-sm uppercase tracking-[0.14em] font-semibold" style={{ color: "var(--brand)" }}>All Courses</p>
                        <h1 className="mt-2 text-3xl font-bold md:text-4xl">Choose a course and view full details</h1>
                    </div>
                    <Link href="/" className="text-sm font-semibold transition hover:underline" style={{ color: "var(--brand)" }}>
                        Back to Home
                    </Link>
                </div>

                <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                    {normalizedCourses.map((course) => (
                        <article
                            key={course.id}
                            className="rounded-2xl p-6 shadow-sm transition-shadow hover:shadow-xl"
                            style={{ border: "1px solid var(--line)", background: "var(--paper)" }}
                        >
                            <div className="mb-3 flex flex-wrap items-center gap-2 text-xs">
                                <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-semibold" style={{ border: "1px solid var(--badge-green-border)", background: "var(--badge-green-bg)", color: "var(--badge-green-text)" }}><IconTarget size={12} /> {course.level}</span>
                                <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-semibold" style={{ border: "1px solid var(--badge-blue-border)", background: "var(--badge-blue-bg)", color: "var(--badge-blue-text)" }}><IconClock size={12} /> {course.duration}</span>
                                <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-semibold" style={{ border: "1px solid var(--badge-violet-border)", background: "var(--badge-violet-bg)", color: "var(--badge-violet-text)" }}><IconVideo size={12} /> {course.classType}</span>
                            </div>

                            <h3 className="text-xl font-semibold" style={{ color: "var(--ink)" }}>{course.title}</h3>
                            <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{course.shortDescription}</p>

                            <div className="mt-4 text-sm" style={{ color: "var(--text-muted)" }}>
                                <p className="flex items-center gap-1 font-semibold" style={{ color: "var(--success)" }}><IconEdit size={12} /> Course Highlights</p>
                                <ul className="mt-1 list-disc space-y-1 pl-5 break-words">
                                    {splitLines(course.syllabusTopics).slice(0, 4).map((item) => (
                                        <li key={`${course.id}-course-list-${item}`}>{item}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="mt-5 flex flex-wrap items-center gap-3">
                                <span className="text-lg font-bold" style={{ color: "var(--success)" }}>INR {course.offerPrice.toFixed(0)}</span>
                                <span className="text-sm line-through" style={{ color: "var(--text-muted)" }}>INR {course.originalPrice.toFixed(0)}</span>
                                <span className="rounded-full px-3 py-1 text-xs font-semibold uppercase text-white" style={{ background: "linear-gradient(to right, var(--brand), var(--accent))" }}>100% OFF</span>
                            </div>

                            <div className="mt-6">
                                <Link
                                    href={`/courses/${course.slug}`}
                                    className="inline-flex rounded-full px-5 py-2 text-sm font-semibold transition hover:scale-105 active:scale-100"
                                    style={{ border: "1px solid var(--line)", color: "var(--brand)" }}
                                >
                                    View Details &rarr;
                                </Link>
                            </div>
                        </article>
                    ))}

                    {normalizedCourses.length === 0 ? (
                        <div className="rounded-2xl border border-dashed p-8 text-center md:col-span-2" style={{ borderColor: "var(--line)", background: "var(--paper)", color: "var(--text-muted)" }}>
                            No active courses available yet.
                        </div>
                    ) : null}
                </div>
            </section>
        </div>
    );
}
