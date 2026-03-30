import Link from "next/link";
import { prisma } from "@/lib/prisma";
import VisitTracker from "@/components/VisitTracker";

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
        <div className="min-h-screen bg-slate-950 text-slate-100">
            <VisitTracker />
            <section className="mx-auto w-[min(1200px,94vw)] py-12 md:py-16">
                <div className="mb-8 flex items-end justify-between gap-4">
                    <div>
                        <p className="text-sm uppercase tracking-[0.14em] text-orange-200">All Courses</p>
                        <h1 className="mt-2 text-3xl font-bold md:text-4xl">Choose a course and view full details</h1>
                    </div>
                    <Link href="/" className="text-sm font-semibold text-orange-200 hover:text-orange-100">
                        Back to Home
                    </Link>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {normalizedCourses.map((course) => (
                        <article
                            key={course.id}
                            className="rounded-2xl border border-white/10 bg-linear-to-b from-slate-900/85 to-slate-800/80 p-6 shadow-xl"
                        >
                            <div className="mb-3 flex flex-wrap items-center gap-2 text-xs">
                                <span className="rounded-full bg-emerald-400/20 px-2.5 py-1 text-emerald-200">{course.level}</span>
                                <span className="rounded-full bg-cyan-400/20 px-2.5 py-1 text-cyan-200">{course.duration}</span>
                                <span className="rounded-full bg-orange-400/20 px-2.5 py-1 text-orange-200">{course.classType}</span>
                            </div>

                            <h3 className="text-xl font-semibold text-orange-200">{course.title}</h3>
                            <p className="mt-2 text-sm leading-relaxed text-slate-300">{course.shortDescription}</p>

                            <div className="mt-4 text-sm text-slate-300">
                                <p className="font-semibold text-emerald-200">Course Highlights</p>
                                <ul className="mt-1 list-disc space-y-1 pl-5">
                                    {splitLines(course.syllabusTopics).slice(0, 4).map((item) => (
                                        <li key={`${course.id}-course-list-${item}`}>{item}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="mt-5 flex flex-wrap items-center gap-3">
                                <span className="text-lg font-bold text-emerald-300">INR {course.offerPrice.toFixed(2)}</span>
                                <span className="text-sm text-slate-400 line-through">INR {course.originalPrice.toFixed(2)}</span>
                                <span className="rounded-full bg-orange-500 px-3 py-1 text-xs font-semibold uppercase text-white">100% OFF</span>
                            </div>

                            <div className="mt-6">
                                <Link
                                    href={`/courses/${course.slug}`}
                                    className="inline-flex rounded-full border border-orange-300/45 px-5 py-2 text-sm font-semibold text-orange-100 transition hover:bg-orange-500/20"
                                >
                                    View Details
                                </Link>
                            </div>
                        </article>
                    ))}

                    {normalizedCourses.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-white/25 bg-white/5 p-8 text-center text-slate-300 md:col-span-2">
                            No active courses available yet.
                        </div>
                    ) : null}
                </div>
            </section>
        </div>
    );
}
