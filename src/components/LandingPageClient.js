"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import VisitTracker from "@/components/VisitTracker";

/* ───────── data ───────── */
const categories = [
    { emoji: "\ud83d\udcbb", title: "Computer Course", subtitle: "Basic to Advanced learning" },
    { emoji: "\ud83d\udcc4", title: "PDF Notes", subtitle: "Downloadable study material" },
    { emoji: "\ud83e\udde0", title: "Computer Quiz", subtitle: "Computer MCQ practice sets" },
    { emoji: "\u26a1", title: "Computer Tricks", subtitle: "Tips, tricks and shortcuts" },
];

const reviewItems = [
    { name: "Abhijit Patgirri", emoji: "\ud83d\ude0e", rating: 5, text: "One of the best platforms to learn something valuable for free. Classes fit daily life and still provide practical computer skills with strong quality." },
    { name: "Sakshi Kanojiya", emoji: "\ud83d\udc69\u200d\ud83d\udcbb", rating: 5, text: "Very useful for students interested in computer education. Courses are full of practical knowledge and genuinely help with career growth." },
    { name: "Madhusudan Pal", emoji: "\ud83d\udcaa", rating: 5, text: "For students who cannot afford paid classes, this free learning platform is a true opportunity to build skills and confidence." },
];

const whyUs = [
    { emoji: "\ud83c\udd93", text: "100% Free: No hidden costs ever" },
    { emoji: "\ud83d\udcd1", text: "PDF Notes: Download for quick revision" },
    { emoji: "\ud83d\ude80", text: "No Login: Start learning instantly" },
    { emoji: "\ud83d\udd12", text: "Secure: Privacy-first experience" },
    { emoji: "\ud83d\udcde", text: "Call Support: Mon-Sat 10AM-12PM" },
    { emoji: "\ud83d\udee0\ufe0f", text: "Project-based Practice for real skills" },
];

const faqs = [
    { q: "LearnSphere kya hai?", a: "Ek online platform jo students ko 100% free computer courses deta hai." },
    { q: "Kya courses sach mein free hain?", a: "Haan, core learning completely free hai. Future mein kuch advanced optional ho sakti hain." },
    { q: "Course ki language?", a: "Simple Hindi + English style, taki beginners bhi easily follow kar saken." },
];

const stats = [
    { emoji: "\ud83c\udf93", value: "40,25,000+", label: "Students joined" },
    { emoji: "\u2705", value: "Verified", label: "Learning platform" },
    { emoji: "\u2b50", value: "4.7 / 5", label: "Average rating" },
    { emoji: "\ud83d\udcc8", value: "150k+", label: "Monthly learners" },
];

function splitLines(text) {
    return String(text || "").split("\n").map(l => l.trim()).filter(Boolean);
}

/* ───────── 3D tilt card ───────── */
function TiltCard({ children, className = "", intensity = 12 }) {
    const ref = useRef(null);
    const rotateX = useMotionValue(0);
    const rotateY = useMotionValue(0);
    const springX = useSpring(rotateX, { stiffness: 200, damping: 20 });
    const springY = useSpring(rotateY, { stiffness: 200, damping: 20 });

    const handleMouse = useCallback((e) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        rotateX.set(-y * intensity);
        rotateY.set(x * intensity);
    }, [intensity, rotateX, rotateY]);

    const handleLeave = useCallback(() => {
        rotateX.set(0);
        rotateY.set(0);
    }, [rotateX, rotateY]);

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouse}
            onMouseLeave={handleLeave}
            style={{ rotateX: springX, rotateY: springY, transformStyle: "preserve-3d" }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

/* ───────── cursor follower ───────── */
function CursorGlow() {
    const x = useMotionValue(-100);
    const y = useMotionValue(-100);

    useEffect(() => {
        const move = (e) => { x.set(e.clientX - 160); y.set(e.clientY - 160); };
        window.addEventListener("mousemove", move);
        return () => window.removeEventListener("mousemove", move);
    }, [x, y]);

    return (
        <motion.div
            className="pointer-events-none fixed z-0 h-80 w-80 rounded-full opacity-15 blur-3xl"
            style={{ x, y, background: "radial-gradient(circle, #f97316 0%, #3b82f6 60%, transparent 80%)" }}
        />
    );
}

/* ───────── hero particles (3D sphere) ───────── */
function drawParticles(canvas) {
    const ctx = canvas.getContext("2d");
    let w = 0, h = 0, raf = 0, t = 0;
    const N = 140;
    const dots = Array.from({ length: N }, (_, i) => {
        const phi = Math.acos(1 - 2 * (i + 0.5) / N);
        const theta = Math.PI * (1 + Math.sqrt(5)) * i;
        return { phi, theta, r: 180 + Math.random() * 60, spd: 0.0004 + Math.random() * 0.0003 };
    });
    const resize = () => { w = canvas.width = canvas.offsetWidth; h = canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);
    const render = () => {
        t++;
        ctx.clearRect(0, 0, w, h);
        const cx = w / 2, cy = h / 2;
        dots.forEach((d, i) => {
            const th = d.theta + t * d.spd;
            const x = cx + d.r * Math.sin(d.phi) * Math.cos(th);
            const y = cy + d.r * Math.sin(d.phi) * Math.sin(th) * 0.42;
            const z = d.r * Math.cos(d.phi);
            const sc = (z + d.r) / (2 * d.r);
            const a = 0.12 + sc * 0.5;
            const sz = 0.8 + sc * 2.5;
            ctx.beginPath();
            ctx.arc(x, y, sz, 0, Math.PI * 2);
            ctx.fillStyle = i % 3 === 0 ? `rgba(249,115,22,${a})` : i % 3 === 1 ? `rgba(59,130,246,${a})` : `rgba(16,185,129,${a})`;
            ctx.fill();
        });
        raf = requestAnimationFrame(render);
    };
    render();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
}

/* ───────── scroll reveal wrapper ───────── */
const reveal = {
    initial: { opacity: 0, y: 40, rotateX: 8 },
    whileInView: { opacity: 1, y: 0, rotateX: 0 },
    viewport: { once: true, amount: 0.15 },
    transition: { duration: 0.6, ease: "easeOut" },
};

const revealLeft = {
    initial: { opacity: 0, x: -40, rotateY: 6 },
    whileInView: { opacity: 1, x: 0, rotateY: 0 },
    viewport: { once: true, amount: 0.15 },
    transition: { duration: 0.55, ease: "easeOut" },
};

/* ───────── main component ───────── */
export default function LandingPageClient({ courses }) {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
    const smoothProgress = useSpring(scrollYProgress, { stiffness: 60, damping: 20 });
    const bgY = useTransform(smoothProgress, [0, 1], ["0%", "12%"]);

    useEffect(() => {
        if (!canvasRef.current) return;
        return drawParticles(canvasRef.current);
    }, []);

    return (
        <div ref={containerRef} className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100" style={{ perspective: "1200px" }}>
            <VisitTracker />
            <CursorGlow />

            {/* ── HERO ── */}
            <section className="relative overflow-hidden border-b border-white/10">
                <canvas ref={canvasRef} className="absolute inset-0 h-full w-full opacity-60" />
                <div className="pointer-events-none absolute -left-32 top-16 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
                <div className="pointer-events-none absolute -right-10 top-0 h-80 w-80 rounded-full bg-orange-500/20 blur-3xl" />

                <motion.div style={{ y: bgY }} className="relative mx-auto w-[min(1100px,92vw)] py-20 md:py-28">
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        className="max-w-3xl space-y-5"
                    >
                        <motion.p
                            initial={{ opacity: 0, scale: 0.8, rotateZ: -3 }}
                            animate={{ opacity: 1, scale: 1, rotateZ: 0 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                            className="inline-block rounded-full border border-emerald-300/30 bg-emerald-300/10 px-4 py-1.5 text-xs uppercase tracking-[0.18em] text-emerald-200"
                        >
                            {"\ud83c\udf1f"} 100% Free Learning Platform
                        </motion.p>

                        <motion.h1
                            initial={{ opacity: 0, y: 30, rotateX: 15 }}
                            animate={{ opacity: 1, y: 0, rotateX: 0 }}
                            transition={{ delay: 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                            className="text-4xl font-black leading-tight md:text-6xl"
                            style={{ transformStyle: "preserve-3d" }}
                        >
                            Learn 100% Free{" "}
                            <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500 bg-clip-text text-transparent">
                                Computer Courses
                            </span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.35, duration: 0.6 }}
                            className="max-w-2xl text-slate-300 md:text-lg leading-relaxed"
                        >
                            Free online computer courses for everyone. Learn digital skills from basics to advanced and grow your career with practical, job-ready education.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                            className="flex flex-wrap gap-3 pt-2"
                        >
                            <a href="#course-grid" className="group relative inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-7 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition-all hover:shadow-orange-500/40 hover:scale-105 active:scale-100">
                                {"\ud83d\ude80"} Start Learning
                            </a>
                            <a href="#categories" className="group inline-flex items-center gap-2 rounded-full border border-white/20 px-7 py-3 text-sm font-semibold text-white transition-all hover:bg-white/10 hover:border-white/30 hover:scale-105 active:scale-100">
                                {"\ud83d\udcda"} Explore Categories
                            </a>
                        </motion.div>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7, duration: 0.5 }}
                            className="pt-2 text-sm text-slate-400"
                        >
                            {"\ud83d\udcbb"} Computer Course &nbsp;|&nbsp; {"\ud83d\udcc4"} PDF Notes &nbsp;|&nbsp; {"\ud83e\udde0"} Quiz &nbsp;|&nbsp; {"\u26a1"} Computer Tricks
                        </motion.p>
                    </motion.div>
                </motion.div>
            </section>

            {/* ── CATEGORIES ── */}
            <section id="categories" className="mx-auto w-[min(1100px,92vw)] py-14 md:py-20">
                <motion.div {...reveal} className="mb-8 text-center">
                    <p className="text-sm uppercase tracking-[0.14em] text-orange-200">{"\ud83d\udcda"} Categories</p>
                    <h2 className="mt-2 text-3xl font-bold">What do you want to learn?</h2>
                </motion.div>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {categories.map((item, i) => (
                        <TiltCard key={item.title}>
                            <motion.article
                                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                viewport={{ once: true, amount: 0.2 }}
                                transition={{ duration: 0.5, delay: i * 0.08 }}
                                whileHover={{ y: -4 }}
                                className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/90 to-slate-800/70 p-6 transition-colors hover:border-orange-400/30 cursor-pointer"
                            >
                                <span className="text-3xl">{item.emoji}</span>
                                <h3 className="mt-3 text-lg font-semibold text-orange-200">{item.title}</h3>
                                <p className="mt-1 text-sm text-slate-400">{item.subtitle}</p>
                            </motion.article>
                        </TiltCard>
                    ))}
                </div>
            </section>

            {/* ── COURSES ── */}
            <section id="course-grid" className="mx-auto w-[min(1100px,92vw)] py-6 md:py-10">
                <motion.div {...reveal} className="mb-8">
                    <p className="text-sm uppercase tracking-[0.14em] text-orange-200">{"\ud83c\udf93"} Free Computer Courses</p>
                    <h2 className="mt-2 text-3xl font-bold md:text-4xl">Basic to Advanced, job-ready skills</h2>
                </motion.div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {courses.map((course, i) => (
                        <TiltCard key={course.id} intensity={8}>
                            <motion.article
                                initial={{ opacity: 0, y: 30, rotateX: 6 }}
                                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                                viewport={{ once: true, amount: 0.15 }}
                                transition={{ duration: 0.55, delay: i * 0.06 }}
                                className="rounded-2xl border border-white/10 bg-gradient-to-b from-slate-900/90 to-slate-800/80 p-6 shadow-xl transition-colors hover:border-orange-400/25"
                            >
                                <div className="mb-3 flex flex-wrap items-center gap-2 text-xs">
                                    <span className="rounded-full bg-emerald-400/15 px-2.5 py-1 text-emerald-200">{"\ud83c\udfaf"} {course.level}</span>
                                    <span className="rounded-full bg-cyan-400/15 px-2.5 py-1 text-cyan-200">{"\u23f0"} {course.duration}</span>
                                    <span className="rounded-full bg-orange-400/15 px-2.5 py-1 text-orange-200">{"\ud83d\udcf9"} {course.classType}</span>
                                </div>

                                <h3 className="text-xl font-semibold text-orange-200">{course.title}</h3>
                                <p className="mt-2 text-sm leading-relaxed text-slate-400">{course.shortDescription}</p>

                                <div className="mt-4 text-sm text-slate-300">
                                    <p className="font-semibold text-emerald-200">{"\ud83d\udcdd"} Course Highlights</p>
                                    <ul className="mt-1 list-none space-y-1 pl-1 break-words">
                                        {splitLines(course.syllabusTopics).slice(0, 4).map((item) => (
                                            <li key={`${course.id}-${item}`} className="text-slate-400 before:content-['\u2022_'] before:text-orange-400">{item}</li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="mt-5 flex flex-wrap items-center gap-3">
                                    <span className="text-lg font-bold text-emerald-300">INR {course.offerPrice.toFixed(2)}</span>
                                    <span className="text-sm text-slate-500 line-through">INR {course.originalPrice.toFixed(2)}</span>
                                    <span className="rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-3 py-0.5 text-xs font-bold text-white">{"\ud83c\udf89"} FREE</span>
                                </div>

                                <div className="mt-5">
                                    <Link href={`/courses/${course.slug}`} className="inline-flex items-center gap-1.5 rounded-full border border-orange-300/40 px-5 py-2 text-sm font-semibold text-orange-100 transition-all hover:bg-orange-500/15 hover:scale-105 active:scale-100">
                                        View Details {"\u2192"}
                                    </Link>
                                </div>
                            </motion.article>
                        </TiltCard>
                    ))}

                    {courses.length === 0 && (
                        <motion.div {...reveal} className="rounded-2xl border border-dashed border-white/20 bg-white/5 p-8 text-center text-slate-400 md:col-span-2">
                            {"\ud83d\udce6"} No active courses yet. Add courses from admin panel and they will appear here.
                        </motion.div>
                    )}
                </div>

                <motion.div {...reveal} className="mt-8">
                    <Link href="/courses" className="text-sm font-semibold text-orange-200 transition hover:text-orange-100">View all courses {"\u2192"}</Link>
                </motion.div>
            </section>

            {/* ── STATS ── */}
            <motion.section {...reveal} className="mx-auto w-[min(1100px,92vw)] py-14 md:py-20">
                <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-800 p-8">
                    <p className="text-sm uppercase tracking-[0.14em] text-orange-200">{"\ud83c\udfc6"} Trusted by Students</p>
                    <h3 className="mt-2 text-2xl font-bold">Real learners, real outcomes</h3>

                    <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
                        {stats.map((s, i) => (
                            <TiltCard key={s.label} intensity={10}>
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.08, duration: 0.4 }}
                                    className="rounded-xl border border-white/10 bg-white/5 p-4 text-center"
                                >
                                    <span className="text-2xl">{s.emoji}</span>
                                    <p className="mt-1 text-xl font-black text-orange-200">{s.value}</p>
                                    <p className="mt-1 text-xs text-slate-400">{s.label}</p>
                                </motion.div>
                            </TiltCard>
                        ))}
                    </div>
                    <p className="mt-5 text-sm text-slate-400">Trusted by schools, coaching institutes, and self-learners.</p>
                </div>
            </motion.section>

            {/* ── REVIEWS ── */}
            <motion.section {...reveal} className="mx-auto w-[min(1100px,92vw)] py-6 md:py-10">
                <div className="mb-8">
                    <p className="text-sm uppercase tracking-[0.14em] text-orange-200">{"\ud83d\udcac"} Student Reviews</p>
                    <h3 className="mt-2 text-2xl font-bold">Real feedback from learners</h3>
                    <p className="mt-1 text-slate-400">{"\u2b50"} 4.7 / 5 (21,255 reviews)</p>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                    {reviewItems.map((r, i) => (
                        <TiltCard key={r.name} intensity={10}>
                            <motion.article
                                initial={{ opacity: 0, y: 25, rotateY: -5 }}
                                whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                                viewport={{ once: true, amount: 0.15 }}
                                transition={{ duration: 0.5, delay: i * 0.08 }}
                                className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 transition-colors hover:border-orange-400/20"
                            >
                                <div className="mb-3 flex items-center gap-3">
                                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500/20 text-xl">{r.emoji}</span>
                                    <div>
                                        <p className="font-semibold text-orange-200">{r.name}</p>
                                        <p className="text-xs text-slate-500">Computer Course Student</p>
                                    </div>
                                </div>
                                <p className="mb-2 text-sm text-amber-300">{"".padStart(r.rating, "\u2b50")}</p>
                                <p className="text-sm leading-relaxed text-slate-400">{r.text}</p>
                            </motion.article>
                        </TiltCard>
                    ))}
                </div>
            </motion.section>

            {/* ── WHY US ── */}
            <motion.section {...reveal} className="mx-auto w-[min(1100px,92vw)] py-14 md:py-20">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                        <p className="text-sm uppercase tracking-[0.14em] text-orange-200">{"\u2728"} Why Choose Us</p>
                        <h3 className="mt-2 text-2xl font-bold">Simple, secure, and student-friendly</h3>
                    </div>
                    <div className="grid gap-3">
                        {whyUs.map((item, i) => (
                            <motion.div
                                key={item.text}
                                {...revealLeft}
                                transition={{ ...revealLeft.transition, delay: i * 0.06 }}
                                whileHover={{ x: 6, scale: 1.01 }}
                                className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3.5 text-sm text-slate-300 cursor-pointer transition-colors hover:border-orange-400/25"
                            >
                                <span className="text-xl">{item.emoji}</span>
                                <span>{item.text}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.section>

            {/* ── FAQ ── */}
            <motion.section {...reveal} className="mx-auto w-[min(1100px,92vw)] pb-16 pt-2 md:pb-24">
                <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 md:p-8">
                    <p className="text-sm uppercase tracking-[0.14em] text-orange-200">{"\u2753"} Frequently Asked Questions</p>
                    <div className="mt-5 grid gap-4">
                        {faqs.map((faq, i) => (
                            <motion.article
                                key={faq.q}
                                initial={{ opacity: 0, y: 20, rotateX: 5 }}
                                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                                viewport={{ once: true, amount: 0.2 }}
                                transition={{ duration: 0.45, delay: i * 0.06 }}
                                whileHover={{ scale: 1.01 }}
                                className="rounded-xl border border-white/10 bg-white/5 p-4 transition-colors hover:border-orange-400/20 cursor-pointer"
                            >
                                <h4 className="font-semibold text-orange-100">{faq.q}</h4>
                                <p className="mt-1 text-sm text-slate-400">{faq.a}</p>
                            </motion.article>
                        ))}
                    </div>
                </div>
            </motion.section>

            {/* ── FOOTER ── */}
            <footer className="border-t border-white/10 bg-slate-950/95 py-10">
                <div className="mx-auto grid grid-cols-1 w-[min(1100px,92vw)] gap-7 md:grid-cols-3">
                    <div>
                        <h4 className="text-lg font-semibold text-orange-200">{"\ud83c\udf10"} LearnSphere</h4>
                        <p className="mt-2 text-sm text-slate-500">FOLLOW US :</p>
                    </div>
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-wide text-slate-300">Useful Links</p>
                        <ul className="mt-2 space-y-1 text-sm text-slate-500">
                            <li className="cursor-pointer transition hover:text-slate-300">Courses</li>
                            <li className="cursor-pointer transition hover:text-slate-300">Notes</li>
                            <li className="cursor-pointer transition hover:text-slate-300">Quiz</li>
                            <li className="cursor-pointer transition hover:text-slate-300">Blogs</li>
                        </ul>
                    </div>
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-wide text-slate-300">Important Links</p>
                        <ul className="mt-2 space-y-1 text-sm text-slate-500">
                            <li className="cursor-pointer transition hover:text-slate-300">Privacy Policy</li>
                            <li className="cursor-pointer transition hover:text-slate-300">Contact Us</li>
                            <li className="cursor-pointer transition hover:text-slate-300">About Us</li>
                        </ul>
                    </div>
                </div>
                <p className="mt-8 text-center text-xs text-slate-600">Copyright 2026 LearnSphere. All Rights Reserved.</p>
            </footer>
        </div>
    );
}
