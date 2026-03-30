"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import VisitTracker from "@/components/VisitTracker";

const revealUp = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: 0.5, ease: "easeOut" },
};

const categories = [
    {
        title: "Computer Course",
        subtitle: "Basic to Advanced learning",
    },
    {
        title: "PDF Notes",
        subtitle: "Downloadable study material",
    },
    {
        title: "Computer Quiz",
        subtitle: "Computer MCQ practice sets",
    },
    {
        title: "Computer Tricks",
        subtitle: "Computer tips, tricks and shortcuts",
    },
];

const reviewItems = [
    {
        name: "Abhijit Patgirri",
        role: "Computer Course Student",
        rating: "5.0",
        text:
            "I have to say, this is one of the best platforms for students to learn something valuable for free. Classes fit daily life and still provide practical computer skills with strong quality.",
    },
    {
        name: "Sakshi Kanojiya",
        role: "Computer Course Student",
        rating: "5.0",
        text:
            "LearnSphere is very useful for students interested in computer education. Courses are full of practical knowledge and genuinely help with career growth.",
    },
    {
        name: "Madhusudan Pal",
        role: "Computer Course Student",
        rating: "5.0",
        text:
            "For students who cannot afford paid computer classes, this kind of free learning platform is a true opportunity to build skills and confidence for the future.",
    },
];

const whyChooseUs = [
    "100% Free: Access courses and resources with no hidden costs.",
    "PDF Notes: Download concise notes for quick revision and exam prep.",
    "No Login: Start learning instantly without account friction.",
    "Secure: Privacy-first experience with reliable uptime.",
    "Call Support: Mon-Sat, 10:00 AM-12:00 PM phone assistance.",
    "Project-based Practice: Build real projects for portfolio strength.",
];

const faqs = [
    {
        q: "LearnSphere kya hai?",
        a: "LearnSphere ek online platform hai jo students ko 100% free computer courses deta hai. Mission hai quality computer education sab tak pahunchana.",
    },
    {
        q: "Kya yahan sabhi courses sach mein free hain?",
        a: "Haan, courses free access ke saath design kiye gaye hain. Kuch advanced services future mein optional ho sakti hain, but core learning free hai.",
    },
    {
        q: "Course ki language kya hai?",
        a: "Content simple Hindi + English style mein diya jata hai, taki school students aur beginners dono easily follow kar saken.",
    },
];

function splitLines(text) {
    return String(text || "")
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);
}

function drawThreeDParticles(canvas) {
    const ctx = canvas.getContext("2d");
    let width = 0;
    let height = 0;
    let raf = 0;
    let t = 0;

    const dots = Array.from({ length: 180 }).map((_, index) => {
        const phi = Math.acos(1 - 2 * (index + 0.5) / 180);
        const theta = Math.PI * (1 + Math.sqrt(5)) * index;
        return {
            phi,
            theta,
            radius: 200 + Math.random() * 80,
            speed: 0.00045 + Math.random() * 0.0003,
        };
    });

    const resize = () => {
        width = canvas.width = canvas.offsetWidth;
        height = canvas.height = canvas.offsetHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    const render = () => {
        t += 1;
        ctx.clearRect(0, 0, width, height);

        const cx = width / 2;
        const cy = height / 2;

        dots.forEach((dot, i) => {
            const theta = dot.theta + t * dot.speed;
            const x = cx + dot.radius * Math.sin(dot.phi) * Math.cos(theta);
            const y = cy + dot.radius * Math.sin(dot.phi) * Math.sin(theta) * 0.44;
            const z = dot.radius * Math.cos(dot.phi);
            const scale = (z + dot.radius) / (2 * dot.radius);
            const alpha = 0.1 + scale * 0.48;
            const size = 0.7 + scale * 2.2;

            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fillStyle =
                i % 3 === 0
                    ? `rgba(249, 115, 22, ${alpha})`
                    : i % 3 === 1
                        ? `rgba(37, 99, 235, ${alpha})`
                        : `rgba(16, 185, 129, ${alpha})`;
            ctx.fill();
        });

        raf = requestAnimationFrame(render);
    };

    render();

    return () => {
        cancelAnimationFrame(raf);
        window.removeEventListener("resize", resize);
    };
}

export default function LandingPageClient({ courses }) {
    const heroCanvasRef = useRef(null);

    useEffect(() => {
        if (!heroCanvasRef.current) return;
        return drawThreeDParticles(heroCanvasRef.current);
    }, []);

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100">
            <VisitTracker />

            <section className="relative overflow-hidden border-b border-white/10">
                <canvas ref={heroCanvasRef} className="absolute inset-0 h-full w-full opacity-70" />
                <div className="pointer-events-none absolute -left-40 top-20 h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl" />
                <div className="pointer-events-none absolute right-0 top-0 h-96 w-96 rounded-full bg-orange-500/20 blur-3xl" />

                <div className="relative mx-auto w-[min(1200px,94vw)] py-20 md:py-28">
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="max-w-3xl space-y-6"
                    >
                        <p className="inline-block rounded-full border border-emerald-300/30 bg-emerald-300/10 px-4 py-1 text-xs uppercase tracking-[0.18em] text-emerald-200">
                            100% Free Learning Platform
                        </p>
                        <h1 className="text-4xl font-black leading-tight md:text-6xl">
                            Learn 100% Free Computer Courses
                        </h1>
                        <p className="max-w-2xl text-slate-300 md:text-lg">
                            Free online computer courses for everyone. Learn digital skills from basics to advanced
                            and grow your career with practical, job-ready education.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <a href="#course-grid" className="rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-white hover:bg-orange-400">
                                Start Learning
                            </a>
                            <a href="#categories" className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10">
                                Explore Categories
                            </a>
                        </div>
                        <p className="text-sm text-slate-300">
                            Computer Course | PDF Notes | Quiz | Computer Tricks
                        </p>
                    </motion.div>
                </div>
            </section>

            <section id="categories" className="mx-auto w-[min(1200px,94vw)] py-14 md:py-20">
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {categories.map((item, index) => (
                        <motion.article
                            key={item.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.45, delay: index * 0.05 }}
                            className="rounded-2xl border border-white/15 bg-linear-to-br from-slate-900/85 to-slate-800/70 p-5"
                        >
                            <h3 className="text-lg font-semibold text-orange-200">{item.title}</h3>
                            <p className="mt-2 text-sm text-slate-300">{item.subtitle}</p>
                        </motion.article>
                    ))}
                </div>
            </section>

            <section id="course-grid" className="mx-auto w-[min(1200px,94vw)] py-4 md:py-8">
                <div className="mb-8">
                    <p className="text-sm uppercase tracking-[0.14em] text-orange-200">Free Computer Courses</p>
                    <h2 className="mt-2 text-3xl font-bold md:text-4xl">Basic to Advanced, job-ready skills</h2>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {courses.map((course, index) => (
                        <motion.article
                            key={course.id}
                            initial={{ opacity: 0, y: 22 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.5, delay: index * 0.04 }}
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
                                        <li key={`${course.id}-syllabus-${item}`}>{item}</li>
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
                        </motion.article>
                    ))}

                    {courses.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-white/25 bg-white/5 p-8 text-center text-slate-300 md:col-span-2">
                            No active courses yet. Add courses from admin panel and they will appear here.
                        </div>
                    ) : null}
                </div>

                <div className="mt-8">
                    <Link href="/courses" className="text-sm font-semibold text-orange-200 hover:text-orange-100">View all courses</Link>
                </div>
            </section>

            <motion.section {...revealUp} className="mx-auto w-[min(1200px,94vw)] py-14 md:py-20">
                <div className="rounded-3xl border border-white/10 bg-linear-to-br from-slate-900 to-slate-800 p-8">
                    <p className="text-sm uppercase tracking-[0.14em] text-orange-200">Trusted by Students</p>
                    <h3 className="mt-2 text-2xl font-bold">Real learners, real outcomes</h3>

                    <div className="mt-8 grid gap-4 md:grid-cols-4">
                        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                            <p className="text-2xl font-black text-emerald-300">40,25,000+</p>
                            <p className="mt-1 text-sm text-slate-300">Students joined our courses and resources</p>
                        </div>
                        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                            <p className="text-lg font-bold text-cyan-200">Verified Learning Platform</p>
                            <p className="mt-1 text-sm text-slate-300">Secure content delivery and privacy focused</p>
                        </div>
                        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                            <p className="text-2xl font-black text-orange-200">4.7 / 5</p>
                            <p className="mt-1 text-sm text-slate-300">Average rating</p>
                        </div>
                        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                            <p className="text-2xl font-black text-orange-200">150k+</p>
                            <p className="mt-1 text-sm text-slate-300">Monthly learners</p>
                        </div>
                    </div>

                    <p className="mt-5 text-sm text-slate-300">Trusted by schools, coaching institutes, and self-learners.</p>
                </div>
            </motion.section>

            <motion.section {...revealUp} className="mx-auto w-[min(1200px,94vw)] py-4 md:py-6">
                <div className="mb-8">
                    <p className="text-sm uppercase tracking-[0.14em] text-orange-200">Student Reviews</p>
                    <h3 className="mt-2 text-2xl font-bold">Real feedback from learners</h3>
                    <p className="mt-2 text-slate-300">4.7 / 5 (21,255 reviews)</p>
                </div>

                <div className="grid gap-5 md:grid-cols-3">
                    {reviewItems.map((review, index) => (
                        <motion.article
                            key={review.name}
                            initial={{ opacity: 0, y: 18 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.45, delay: index * 0.06 }}
                            className="rounded-2xl border border-white/10 bg-slate-900/70 p-5"
                        >
                            <div className="mb-3 flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500/25 text-sm font-bold text-orange-100">
                                    {review.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-semibold text-orange-200">{review.name}</p>
                                    <p className="text-xs text-slate-400">{review.role}</p>
                                </div>
                            </div>
                            <p className="mb-2 text-sm font-semibold text-emerald-200">({review.rating})</p>
                            <p className="text-sm leading-relaxed text-slate-300">{review.text}</p>
                        </motion.article>
                    ))}
                </div>
            </motion.section>

            <motion.section {...revealUp} className="mx-auto w-[min(1200px,94vw)] py-14 md:py-20">
                <div className="grid gap-5 md:grid-cols-2">
                    <div>
                        <p className="text-sm uppercase tracking-[0.14em] text-orange-200">Why Choose Us</p>
                        <h3 className="mt-2 text-2xl font-bold">Simple, secure, and student-friendly</h3>
                    </div>
                    <div className="grid gap-3">
                        {whyChooseUs.map((item, index) => (
                            <motion.div
                                key={item}
                                initial={{ opacity: 0, x: 18 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, amount: 0.2 }}
                                transition={{ duration: 0.4, delay: index * 0.05 }}
                                className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-slate-200"
                            >
                                {item}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.section>

            <motion.section {...revealUp} className="mx-auto w-[min(1200px,94vw)] pb-16 pt-2 md:pb-24">
                <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 md:p-8">
                    <p className="text-sm uppercase tracking-[0.14em] text-orange-200">Frequently Asked Questions</p>
                    <div className="mt-5 grid gap-4">
                        {faqs.map((faq, index) => (
                            <motion.article
                                key={faq.q}
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.2 }}
                                transition={{ duration: 0.4, delay: index * 0.05 }}
                                className="rounded-xl border border-white/10 bg-white/5 p-4"
                            >
                                <h4 className="font-semibold text-orange-100">{faq.q}</h4>
                                <p className="mt-1 text-sm text-slate-300">{faq.a}</p>
                            </motion.article>
                        ))}
                    </div>
                </div>
            </motion.section>

            <footer className="border-t border-white/10 bg-slate-950/95 py-10">
                <div className="mx-auto grid w-[min(1200px,94vw)] gap-7 md:grid-cols-3">
                    <div>
                        <h4 className="text-lg font-semibold text-orange-200">LearnSphere</h4>
                        <p className="mt-2 text-sm text-slate-300">FOLLOW US :</p>
                    </div>

                    <div>
                        <p className="text-sm font-semibold uppercase tracking-wide text-slate-200">Useful Links</p>
                        <ul className="mt-2 space-y-1 text-sm text-slate-300">
                            <li>Courses</li>
                            <li>Notes</li>
                            <li>Quiz</li>
                            <li>Blogs</li>
                        </ul>
                    </div>

                    <div>
                        <p className="text-sm font-semibold uppercase tracking-wide text-slate-200">Important Links</p>
                        <ul className="mt-2 space-y-1 text-sm text-slate-300">
                            <li>Privacy Policy</li>
                            <li>Contact Us</li>
                            <li>About Us</li>
                        </ul>
                    </div>
                </div>
                <p className="mt-8 text-center text-xs text-slate-400">Copyright 2026 LearnSphere. All Rights Reserved.</p>
            </footer>
        </div>
    );
}
