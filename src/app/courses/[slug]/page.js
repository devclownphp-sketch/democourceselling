import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import VisitTracker from "@/components/VisitTracker";
import CourseEnrollButton from "@/components/CourseEnrollButton";
import { IconTarget, IconClock, IconVideo } from "@/components/Icons";

export const dynamic = "force-dynamic";

function splitLines(text) {
    return String(text || "")
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);
}

export default async function CourseDetailsPage({ params }) {
    const { slug } = await params;

    const course = await prisma.course.findUnique({
        where: { slug },
    });

    if (!course || !course.isActive) {
        notFound();
    }

    const normalizedCourse = {
        ...course,
        originalPrice: Number(course.originalPrice || 0),
        offerPrice: Number(course.offerPrice || 0),
    };

    return (
        <div className="min-h-screen" style={{ background: "var(--bg)", color: "var(--ink)" }}>
            <VisitTracker />
            <section className="mx-auto w-[min(1000px,94vw)] py-10 md:py-14">
                <div className="mb-8">
                    <Link href="/courses" className="text-sm font-semibold transition hover:underline" style={{ color: "var(--brand)" }}>
                        &larr; Back to Courses
                    </Link>
                </div>

                <article className="rounded-3xl p-7 shadow-lg md:p-10" style={{ border: "1px solid var(--line)", background: "var(--paper)" }}>
                    <div className="mb-5 flex flex-wrap items-center gap-2 text-xs">
                        <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-semibold" style={{ border: "1px solid var(--badge-green-border)", background: "var(--badge-green-bg)", color: "var(--badge-green-text)" }}><IconTarget size={12} /> {normalizedCourse.level}</span>
                        <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-semibold" style={{ border: "1px solid var(--badge-blue-border)", background: "var(--badge-blue-bg)", color: "var(--badge-blue-text)" }}><IconClock size={12} /> {normalizedCourse.duration}</span>
                        <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-semibold" style={{ border: "1px solid var(--badge-violet-border)", background: "var(--badge-violet-bg)", color: "var(--badge-violet-text)" }}><IconVideo size={12} /> {normalizedCourse.classType}</span>
                    </div>

                    <h1 className="text-3xl font-bold md:text-4xl" style={{ color: "var(--ink)" }}>{normalizedCourse.title}</h1>
                    <p className="mt-3" style={{ color: "var(--text-muted)" }}>{normalizedCourse.shortDescription}</p>

                    <div className="mt-8 grid gap-5 grid-cols-1 md:grid-cols-2">
                        <section className="rounded-2xl p-4" style={{ border: "1px solid var(--line)", background: "var(--bg-alt)" }}>
                            <h2 className="text-lg font-semibold" style={{ color: "var(--brand)" }}>What is this course?</h2>
                            <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>{normalizedCourse.whatIs}</p>
                        </section>

                        <section className="rounded-2xl p-4" style={{ border: "1px solid var(--line)", background: "var(--bg-alt)" }}>
                            <h2 className="text-lg font-semibold" style={{ color: "var(--brand)" }}>Who Can Join?</h2>
                            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm break-words" style={{ color: "var(--text-muted)" }}>
                                {splitLines(normalizedCourse.whoCanJoin).map((item) => (
                                    <li key={`${normalizedCourse.id}-join-${item}`}>{item}</li>
                                ))}
                            </ul>
                        </section>

                        <section className="rounded-2xl p-4" style={{ border: "1px solid var(--line)", background: "var(--bg-alt)" }}>
                            <h2 className="text-lg font-semibold" style={{ color: "var(--brand)" }}>Course Syllabus & Topics</h2>
                            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm break-words" style={{ color: "var(--text-muted)" }}>
                                {splitLines(normalizedCourse.syllabusTopics).map((item) => (
                                    <li key={`${normalizedCourse.id}-syllabus-${item}`}>{item}</li>
                                ))}
                            </ul>
                        </section>

                        <section className="rounded-2xl p-4" style={{ border: "1px solid var(--line)", background: "var(--bg-alt)" }}>
                            <h2 className="text-lg font-semibold" style={{ color: "var(--brand)" }}>How to Study the Course</h2>
                            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm break-words" style={{ color: "var(--text-muted)" }}>
                                {splitLines(normalizedCourse.studyPlan).map((item) => (
                                    <li key={`${normalizedCourse.id}-study-${item}`}>{item}</li>
                                ))}
                            </ul>
                        </section>

                        <section className="rounded-2xl p-4" style={{ border: "1px solid var(--line)", background: "var(--bg-alt)" }}>
                            <h2 className="text-lg font-semibold" style={{ color: "var(--brand)" }}>Jobs After Course</h2>
                            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm break-words" style={{ color: "var(--text-muted)" }}>
                                {splitLines(normalizedCourse.jobsAfter).map((item) => (
                                    <li key={`${normalizedCourse.id}-jobs-${item}`}>{item}</li>
                                ))}
                            </ul>
                        </section>

                        <section className="rounded-2xl p-4" style={{ border: "1px solid var(--line)", background: "var(--brand-soft)" }}>
                            <h2 className="text-lg font-semibold" style={{ color: "var(--brand)" }}>Start Your Learning</h2>
                            <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>{normalizedCourse.startLearningText}</p>
                            <ul className="mt-3 space-y-1 text-sm" style={{ color: "var(--text-muted)" }}>
                                <li>{normalizedCourse.liveQna}</li>
                                <li>{normalizedCourse.pdfNotes}</li>
                                <li>{normalizedCourse.callSupport}</li>
                                <li>{normalizedCourse.lifetimeAccess ? "Lifetime Course Access" : "Limited Access"}</li>
                                <li>{normalizedCourse.socialPrompt}</li>
                            </ul>
                        </section>
                    </div>

                    <div className="mt-8 flex flex-wrap items-center gap-3">
                        <span className="text-2xl font-bold" style={{ color: "var(--success)" }}>INR {normalizedCourse.offerPrice.toFixed(0)}</span>
                        <span className="text-base line-through" style={{ color: "var(--text-muted)" }}>INR {normalizedCourse.originalPrice.toFixed(0)}</span>
                        <span className="rounded-full px-3 py-1 text-xs font-semibold uppercase text-white" style={{ background: "linear-gradient(to right, var(--brand), var(--accent))" }}>100% OFF</span>
                    </div>

                    <div className="mt-8">
                        <CourseEnrollButton course={normalizedCourse} />
                    </div>
                </article>
            </section>
        </div>
    );
}
