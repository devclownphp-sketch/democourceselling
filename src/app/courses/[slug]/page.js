import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import VisitTracker from "@/components/VisitTracker";
import CourseEnrollButton from "@/components/CourseEnrollButton";

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
        <div className="min-h-screen bg-slate-950 text-slate-100">
            <VisitTracker />
            <section className="mx-auto w-[min(1000px,94vw)] py-10 md:py-14">
                <div className="mb-8">
                    <Link href="/courses" className="text-sm font-semibold text-orange-200 hover:text-orange-100">
                        Back to Courses
                    </Link>
                </div>

                <article className="rounded-3xl border border-white/10 bg-linear-to-b from-slate-900/90 to-slate-800/80 p-7 shadow-2xl md:p-10">
                    <div className="mb-5 flex flex-wrap items-center gap-2 text-xs">
                        <span className="rounded-full bg-emerald-400/20 px-2.5 py-1 text-emerald-200">{normalizedCourse.level}</span>
                        <span className="rounded-full bg-cyan-400/20 px-2.5 py-1 text-cyan-200">{normalizedCourse.duration}</span>
                        <span className="rounded-full bg-orange-400/20 px-2.5 py-1 text-orange-200">{normalizedCourse.classType}</span>
                    </div>

                    <h1 className="text-3xl font-bold text-orange-200 md:text-4xl">{normalizedCourse.title}</h1>
                    <p className="mt-3 text-slate-300">{normalizedCourse.shortDescription}</p>

                    <div className="mt-8 grid gap-5 md:grid-cols-2">
                        <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
                            <h2 className="text-lg font-semibold text-emerald-200">What is this course?</h2>
                            <p className="mt-2 text-sm text-slate-300">{normalizedCourse.whatIs}</p>
                        </section>

                        <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
                            <h2 className="text-lg font-semibold text-emerald-200">Who Can Join?</h2>
                            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-300">
                                {splitLines(normalizedCourse.whoCanJoin).map((item) => (
                                    <li key={`${normalizedCourse.id}-join-${item}`}>{item}</li>
                                ))}
                            </ul>
                        </section>

                        <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
                            <h2 className="text-lg font-semibold text-emerald-200">Course Syllabus & Topics</h2>
                            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-300">
                                {splitLines(normalizedCourse.syllabusTopics).map((item) => (
                                    <li key={`${normalizedCourse.id}-syllabus-${item}`}>{item}</li>
                                ))}
                            </ul>
                        </section>

                        <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
                            <h2 className="text-lg font-semibold text-emerald-200">How to Study the Course</h2>
                            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-300">
                                {splitLines(normalizedCourse.studyPlan).map((item) => (
                                    <li key={`${normalizedCourse.id}-study-${item}`}>{item}</li>
                                ))}
                            </ul>
                        </section>

                        <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
                            <h2 className="text-lg font-semibold text-emerald-200">Jobs After Course</h2>
                            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-300">
                                {splitLines(normalizedCourse.jobsAfter).map((item) => (
                                    <li key={`${normalizedCourse.id}-jobs-${item}`}>{item}</li>
                                ))}
                            </ul>
                        </section>

                        <section className="rounded-2xl border border-orange-300/35 bg-orange-500/10 p-4">
                            <h2 className="text-lg font-semibold text-orange-100">Start Your Learning</h2>
                            <p className="mt-2 text-sm text-slate-200">{normalizedCourse.startLearningText}</p>
                            <ul className="mt-3 space-y-1 text-sm text-slate-200">
                                <li>{normalizedCourse.liveQna}</li>
                                <li>{normalizedCourse.pdfNotes}</li>
                                <li>{normalizedCourse.callSupport}</li>
                                <li>{normalizedCourse.lifetimeAccess ? "Lifetime Course Access" : "Limited Access"}</li>
                                <li>{normalizedCourse.socialPrompt}</li>
                            </ul>
                        </section>
                    </div>

                    <div className="mt-8 flex flex-wrap items-center gap-3">
                        <span className="text-2xl font-bold text-emerald-300">INR {normalizedCourse.offerPrice.toFixed(2)}</span>
                        <span className="text-base text-slate-400 line-through">INR {normalizedCourse.originalPrice.toFixed(2)}</span>
                        <span className="rounded-full bg-orange-500 px-3 py-1 text-xs font-semibold uppercase text-white">100% OFF</span>
                    </div>

                    <div className="mt-8">
                        <CourseEnrollButton course={normalizedCourse} />
                    </div>
                </article>
            </section>
        </div>
    );
}
