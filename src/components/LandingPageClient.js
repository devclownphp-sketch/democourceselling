"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import VisitTracker from "@/components/VisitTracker";

const categories = [
    { emoji: "💻", title: "Computer Course", subtitle: "Basic to Advanced learning" },
    { emoji: "📄", title: "PDF Notes", subtitle: "Downloadable study material" },
    { emoji: "🧠", title: "Computer Quiz", subtitle: "Computer MCQ practice sets" },
    { emoji: "⚡", title: "Computer Tricks", subtitle: "Tips, tricks and shortcuts" },
];

const reviewItems = [
    { name: "Abhijit Patgirri", initial: "A", rating: 5, text: "One of the best platforms to learn for free. Practical computer skills with strong quality." },
    { name: "Sakshi Kanojiya", initial: "S", rating: 5, text: "Very useful for students. Courses are full of practical knowledge and help with career growth." },
    { name: "Madhusudan Pal", initial: "M", rating: 5, text: "A true opportunity for students who cannot afford paid classes to build skills and confidence." },
];

const whyUs = [
    { emoji: "🆓", text: "100% Free: No hidden costs ever" },
    { emoji: "📑", text: "PDF Notes: Download for quick revision" },
    { emoji: "🚀", text: "No Login: Start learning instantly" },
    { emoji: "🔒", text: "Secure: Privacy-first experience" },
    { emoji: "📞", text: "Call Support: Mon-Sat 10AM-12PM" },
    { emoji: "🛠", text: "Project-based Practice for real skills" },
];

const faqs = [
    { q: "LearnSphere kya hai?", a: "Ek online platform jo students ko 100% free computer courses deta hai." },
    { q: "Kya courses sach mein free hain?", a: "Haan, core learning completely free hai." },
    { q: "Course ki language?", a: "Simple Hindi + English style, taki beginners bhi easily follow kar saken." },
];

const stats = [
    { emoji: "🎓", value: "40,25,000+", label: "Students" },
    { emoji: "✅", value: "Verified", label: "Platform" },
    { emoji: "⭐", value: "4.7 / 5", label: "Rating" },
    { emoji: "📈", value: "150k+", label: "Monthly" },
];

function splitLines(text) {
    return String(text || "").split("\n").map(l => l.trim()).filter(Boolean);
}

function RevealOnScroll({ children, className = "", delay = 0 }) {
    const ref = useRef(null);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([e]) => {
                if (e.isIntersecting) {
                    setTimeout(() => {
                        el.style.opacity = "1";
                        el.style.transform = "translateY(0)";
                    }, delay);
                    obs.unobserve(el);
                }
            },
            { threshold: 0.1 }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, [delay]);
    return (
        <div
            ref={ref}
            className={className}
            style={{ opacity: 0, transform: "translateY(20px)", transition: "opacity 0.5s ease, transform 0.5s ease" }}
        >
            {children}
        </div>
    );
}

export default function LandingPageClient({ courses }) {
    return (
        <div className="bg-white text-slate-800">
            <VisitTracker />

            {/* HERO */}
            <section className="bg-gradient-to-br from-orange-50 via-amber-50 to-emerald-50 border-b border-slate-200">
                <div className="mx-auto max-w-[1100px] px-[4vw] py-16 md:py-24">
                    <div className="max-w-2xl space-y-5">
                        <span className="inline-block rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-emerald-700">
                            🌟 100% Free Learning Platform
                        </span>
                        <h1 className="text-3xl font-black leading-tight md:text-5xl">
                            Learn 100% Free <span className="text-orange-600">Computer Courses</span>
                        </h1>
                        <p className="text-slate-500 md:text-lg leading-relaxed">
                            Free online computer courses for everyone. Learn digital skills from basics to advanced and grow your career with practical, job-ready education.
                        </p>
                        <div className="flex flex-wrap gap-3 pt-1">
                            <a href="#course-grid" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-orange-200 transition hover:-translate-y-0.5 hover:shadow-orange-300">
                                🚀 Start Learning
                            </a>
                            <a href="#categories" className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-600 transition hover:border-orange-300 hover:text-orange-600">
                                📚 Explore Categories
                            </a>
                        </div>
                        <p className="pt-1 text-sm text-slate-400">
                            💻 Computer Course &nbsp;|&nbsp; 📄 PDF Notes &nbsp;|&nbsp; 🧠 Quiz &nbsp;|&nbsp; ⚡ Tricks
                        </p>
                    </div>
                </div>
            </section>

            {/* CATEGORIES */}
            <section id="categories" className="mx-auto max-w-[1100px] px-[4vw] py-14 md:py-20">
                <RevealOnScroll>
                    <p className="text-xs font-semibold uppercase tracking-widest text-orange-600">📚 Categories</p>
                    <h2 className="mt-1 text-2xl font-extrabold md:text-3xl">What do you want to learn?</h2>
                </RevealOnScroll>
                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {categories.map((c, i) => (
                        <RevealOnScroll key={c.title} delay={i * 60}>
                            <div className="cursor-pointer rounded-xl border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:border-orange-300 hover:shadow-lg hover:shadow-orange-100">
                                <span className="text-3xl">{c.emoji}</span>
                                <h3 className="mt-3 text-base font-bold">{c.title}</h3>
                                <p className="mt-1 text-sm text-slate-500">{c.subtitle}</p>
                            </div>
                        </RevealOnScroll>
                    ))}
                </div>
            </section>

            {/* COURSES */}
            <section id="course-grid" className="bg-slate-50 py-10 md:py-14">
                <div className="mx-auto max-w-[1100px] px-[4vw]">
                    <RevealOnScroll>
                        <p className="text-xs font-semibold uppercase tracking-widest text-orange-600">🎓 Free Computer Courses</p>
                        <h2 className="mt-1 text-2xl font-extrabold md:text-3xl">Basic to Advanced, job-ready skills</h2>
                    </RevealOnScroll>
                    <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
                        {courses.map((course, i) => (
                            <RevealOnScroll key={course.id} delay={i * 50}>
                                <article className="rounded-xl border border-slate-200 bg-white p-5 transition hover:border-orange-300 hover:shadow-lg hover:shadow-orange-50">
                                    <div className="mb-3 flex flex-wrap gap-2 text-xs">
                                        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 font-semibold text-emerald-700">🎯 {course.level}</span>
                                        <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 font-semibold text-blue-700">⏰ {course.duration}</span>
                                        <span className="rounded-full border border-orange-200 bg-orange-50 px-2.5 py-0.5 font-semibold text-orange-700">📹 {course.classType}</span>
                                    </div>
                                    <h3 className="text-lg font-bold">{course.title}</h3>
                                    <p className="mt-2 text-sm leading-relaxed text-slate-500">{course.shortDescription}</p>
                                    <div className="mt-3">
                                        <p className="text-xs font-bold text-emerald-600">📝 Course Highlights</p>
                                        <ul className="mt-1 space-y-0.5 text-sm text-slate-500">
                                            {splitLines(course.syllabusTopics).slice(0, 4).map((item) => (
                                                <li key={`${course.id}-${item}`}><span className="text-orange-400">•</span> {item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="mt-4 flex flex-wrap items-center gap-3">
                                        <span className="text-lg font-extrabold text-green-600">INR {course.offerPrice.toFixed(0)}</span>
                                        <span className="text-sm text-slate-400 line-through">INR {course.originalPrice.toFixed(0)}</span>
                                        <span className="rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-3 py-0.5 text-xs font-bold text-white">🎉 FREE</span>
                                    </div>
                                    <Link href={`/courses/${course.slug}`} className="mt-4 inline-flex rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-orange-600 transition hover:border-orange-300 hover:bg-orange-50">
                                        View Details →
                                    </Link>
                                </article>
                            </RevealOnScroll>
                        ))}
                        {courses.length === 0 && (
                            <div className="col-span-full rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-400">
                                📦 No active courses yet. Add from admin panel.
                            </div>
                        )}
                    </div>
                    <RevealOnScroll>
                        <Link href="/courses" className="mt-6 inline-block text-sm font-semibold text-orange-600 hover:underline">View all courses →</Link>
                    </RevealOnScroll>
                </div>
            </section>

            {/* STATS */}
            <section className="mx-auto max-w-[1100px] px-[4vw] py-14 md:py-20">
                <RevealOnScroll>
                    <div className="rounded-2xl border border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50 p-6 md:p-8">
                        <p className="text-xs font-semibold uppercase tracking-widest text-orange-600">🏆 Trusted by Students</p>
                        <h3 className="mt-1 text-xl font-extrabold md:text-2xl">Real learners, real outcomes</h3>
                        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                            {stats.map((s) => (
                                <div key={s.label} className="rounded-xl border border-slate-200 bg-white p-4 text-center transition hover:-translate-y-1 hover:shadow-md">
                                    <span className="text-2xl">{s.emoji}</span>
                                    <p className="mt-1 text-xl font-extrabold text-orange-600">{s.value}</p>
                                    <p className="text-xs text-slate-500">{s.label}</p>
                                </div>
                            ))}
                        </div>
                        <p className="mt-4 text-sm text-slate-500">Trusted by schools, coaching institutes, and self-learners.</p>
                    </div>
                </RevealOnScroll>
            </section>

            {/* REVIEWS */}
            <section className="bg-slate-50 py-10 md:py-14">
                <div className="mx-auto max-w-[1100px] px-[4vw]">
                    <RevealOnScroll>
                        <p className="text-xs font-semibold uppercase tracking-widest text-orange-600">💬 Student Reviews</p>
                        <h3 className="mt-1 text-xl font-extrabold md:text-2xl">Real feedback from learners</h3>
                        <p className="mt-1 text-sm text-slate-400">⭐ 4.7 / 5 (21,255 reviews)</p>
                    </RevealOnScroll>
                    <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                        {reviewItems.map((r, i) => (
                            <RevealOnScroll key={r.name} delay={i * 60}>
                                <div className="rounded-xl border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:border-orange-300 hover:shadow-md">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-600">{r.initial}</div>
                                        <div>
                                            <p className="font-bold text-sm">{r.name}</p>
                                            <p className="text-xs text-slate-400">Computer Course Student</p>
                                        </div>
                                    </div>
                                    <p className="mt-2 text-sm text-amber-500">{"⭐".repeat(r.rating)}</p>
                                    <p className="mt-1 text-sm leading-relaxed text-slate-500">{r.text}</p>
                                </div>
                            </RevealOnScroll>
                        ))}
                    </div>
                </div>
            </section>

            {/* WHY US */}
            <section className="mx-auto max-w-[1100px] px-[4vw] py-14 md:py-20">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    <RevealOnScroll>
                        <p className="text-xs font-semibold uppercase tracking-widest text-orange-600">✨ Why Choose Us</p>
                        <h3 className="mt-1 text-xl font-extrabold md:text-2xl">Simple, secure, student-friendly</h3>
                    </RevealOnScroll>
                    <div className="grid gap-3">
                        {whyUs.map((item, i) => (
                            <RevealOnScroll key={item.text} delay={i * 50}>
                                <div className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 bg-white p-3.5 text-sm transition hover:translate-x-1 hover:border-orange-300 hover:shadow-sm">
                                    <span className="text-xl">{item.emoji}</span>
                                    <span className="text-slate-600">{item.text}</span>
                                </div>
                            </RevealOnScroll>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="bg-slate-50 py-10 md:py-14">
                <div className="mx-auto max-w-[1100px] px-[4vw]">
                    <RevealOnScroll>
                        <p className="text-xs font-semibold uppercase tracking-widest text-orange-600">❓ FAQ</p>
                    </RevealOnScroll>
                    <div className="mt-4 grid gap-3">
                        {faqs.map((f, i) => (
                            <RevealOnScroll key={f.q} delay={i * 60}>
                                <div className="rounded-lg border border-slate-200 bg-white p-4 transition hover:border-orange-300">
                                    <h4 className="font-bold text-slate-800">{f.q}</h4>
                                    <p className="mt-1 text-sm text-slate-500">{f.a}</p>
                                </div>
                            </RevealOnScroll>
                        ))}
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="border-t border-slate-200 bg-slate-50 py-10">
                <div className="mx-auto grid max-w-[1100px] grid-cols-1 gap-7 px-[4vw] md:grid-cols-3">
                    <div>
                        <h4 className="text-lg font-bold text-orange-600">🌐 LearnSphere</h4>
                        <p className="mt-1 text-sm text-slate-400">FOLLOW US</p>
                    </div>
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wide text-slate-600">Useful Links</p>
                        <ul className="mt-2 space-y-1 text-sm text-slate-500">
                            <li className="cursor-pointer hover:text-orange-600">Courses</li>
                            <li className="cursor-pointer hover:text-orange-600">Notes</li>
                            <li className="cursor-pointer hover:text-orange-600">Quiz</li>
                            <li className="cursor-pointer hover:text-orange-600">Blogs</li>
                        </ul>
                    </div>
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wide text-slate-600">Important Links</p>
                        <ul className="mt-2 space-y-1 text-sm text-slate-500">
                            <li className="cursor-pointer hover:text-orange-600">Privacy Policy</li>
                            <li className="cursor-pointer hover:text-orange-600">Contact Us</li>
                            <li className="cursor-pointer hover:text-orange-600">About Us</li>
                        </ul>
                    </div>
                </div>
                <p className="mt-8 text-center text-xs text-slate-400">Copyright 2026 LearnSphere. All Rights Reserved.</p>
            </footer>
        </div>
    );
}
