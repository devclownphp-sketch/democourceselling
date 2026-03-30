"use client";

import { useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import VisitTracker from "@/components/VisitTracker";

/* ─── Data ─── */
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

/* ─── 3D Globe (Canvas2D - no WebGL, zero errors) ─── */
function HeroGlobe() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let w = 0, h = 0, raf = 0, t = 0, paused = false;
        let targetRotX = 0, targetRotY = 0, rotX = 0, rotY = 0;
        let mxNorm = 0.5, myNorm = 0.5; // for color shift
        const N = 700;
        const dots = Array.from({ length: N }, (_, i) => {
            const phi = Math.acos(1 - 2 * (i + 0.5) / N);
            const theta = Math.PI * (1 + Math.sqrt(5)) * i;
            return { phi, theta, r: 160 + Math.random() * 50, spd: 0.0003 + Math.random() * 0.0002 };
        });

        const resize = () => { w = canvas.width = canvas.offsetWidth; h = canvas.height = canvas.offsetHeight; };
        resize();
        window.addEventListener("resize", resize);

        // Listen on WINDOW so it works even when cursor is outside the canvas
        const onMouse = (e) => {
            mxNorm = e.clientX / window.innerWidth;
            myNorm = e.clientY / window.innerHeight;
            targetRotY = (mxNorm - 0.5) * 5.0;  // ultra sensitive horizontal
            targetRotX = (myNorm - 0.5) * 3.5;   // ultra sensitive vertical
        };
        window.addEventListener("mousemove", onMouse);

        const onVis = () => { paused = document.hidden; };
        document.addEventListener("visibilitychange", onVis);

        // Color palettes that shift with mouse X position
        const palettes = [
            // left side: purple/pink/cyan
            [[168, 85, 247], [236, 72, 153], [34, 211, 238]],
            // center: orange/blue/green (default)
            [[249, 115, 22], [59, 130, 246], [16, 185, 129]],
            // right side: rose/amber/teal
            [[244, 63, 94], [245, 158, 11], [20, 184, 166]],
        ];

        function lerpColor(a, b, t) {
            return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
        }

        const render = () => {
            if (!paused) {
                t++;
                // smooth lerp toward mouse - fast response
                rotX += (targetRotX - rotX) * 0.12;
                rotY += (targetRotY - rotY) * 0.12;

                const sinRX = Math.sin(rotX), cosRX = Math.cos(rotX);
                const sinRY = Math.sin(rotY), cosRY = Math.cos(rotY);
                const autoSin = Math.sin(t * 0.004), autoCos = Math.cos(t * 0.004);

                // pick color palette based on mouse X
                const pIdx = mxNorm < 0.33 ? 0 : mxNorm > 0.66 ? 2 : 1;
                const pBlend = mxNorm < 0.33 ? mxNorm / 0.33 : mxNorm > 0.66 ? (mxNorm - 0.66) / 0.34 : (mxNorm - 0.33) / 0.33;
                const nextP = Math.min(pIdx + 1, 2);
                const c0 = lerpColor(palettes[pIdx][0], palettes[nextP][0], pBlend);
                const c1 = lerpColor(palettes[pIdx][1], palettes[nextP][1], pBlend);
                const c2 = lerpColor(palettes[pIdx][2], palettes[nextP][2], pBlend);

                ctx.clearRect(0, 0, w, h);
                const cx = w * 0.5, cy = h * 0.5;

                for (let i = 0; i < N; i++) {
                    const d = dots[i];
                    const sp = Math.sin(d.phi), cp = Math.cos(d.phi);
                    const th = d.theta + t * d.spd;
                    const st = Math.sin(th), ct = Math.cos(th);
                    let px = d.r * sp * ct;
                    let py = d.r * sp * st;
                    let pz = d.r * cp;

                    // auto rotation
                    let tx = px * autoCos - pz * autoSin;
                    let tz = px * autoSin + pz * autoCos;
                    px = tx; pz = tz;

                    // mouse Y-axis rotation
                    tx = px * cosRY - pz * sinRY;
                    tz = px * sinRY + pz * cosRY;
                    px = tx; pz = tz;

                    // mouse X-axis rotation
                    let ty = py * cosRX - pz * sinRX;
                    tz = py * sinRX + pz * cosRX;
                    py = ty; pz = tz;

                    const sc = (pz + d.r) / (2 * d.r);
                    const a = 0.06 + sc * 0.7;
                    const sz = 0.4 + sc * 3.0;
                    const col = i % 3 === 0 ? c0 : i % 3 === 1 ? c1 : c2;

                    ctx.beginPath();
                    ctx.arc(cx + px, cy + py * 0.45, sz, 0, 6.28);
                    ctx.fillStyle = `rgba(${col[0]|0},${col[1]|0},${col[2]|0},${a})`;
                    ctx.fill();
                }
            }
            raf = requestAnimationFrame(render);
        };
        render();

        return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); window.removeEventListener("mousemove", onMouse); document.removeEventListener("visibilitychange", onVis); };
    }, []);

    return <canvas ref={canvasRef} className="absolute right-0 top-0 h-full w-1/2 opacity-90 max-md:w-full max-md:opacity-35" />;
}

/* ─── 3D Tilt Card (CSS transform, GPU only) ─── */
function Tilt3D({ children, className = "", intensity = 10 }) {
    const ref = useRef(null);

    const onMove = useCallback((e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(600px) rotateX(${-y * intensity}deg) rotateY(${x * intensity}deg) scale3d(1.02,1.02,1.02)`;
    }, [intensity]);

    const onLeave = useCallback(() => {
        if (ref.current) ref.current.style.transform = "perspective(600px) rotateX(0) rotateY(0) scale3d(1,1,1)";
    }, []);

    return (
        <div
            ref={ref}
            className={className}
            onMouseMove={onMove}
            onMouseLeave={onLeave}
            style={{ transition: "transform 0.2s ease-out", willChange: "transform" }}
        >
            {children}
        </div>
    );
}

/* ─── Scroll Reveal ─── */
function Reveal({ children, className = "", delay = 0, direction = "up" }) {
    const ref = useRef(null);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(([e]) => {
            if (e.isIntersecting) {
                setTimeout(() => { el.style.opacity = "1"; el.style.transform = "translate3d(0,0,0) rotateX(0)"; }, delay);
                obs.unobserve(el);
            }
        }, { threshold: 0.08 });
        obs.observe(el);
        return () => obs.disconnect();
    }, [delay]);

    const initial = direction === "left" ? "translate3d(-30px,0,0)" : "translate3d(0,30px,0) rotateX(4deg)";

    return (
        <div ref={ref} className={className} style={{ opacity: 0, transform: initial, transition: "opacity 0.6s ease, transform 0.6s ease", willChange: "transform, opacity" }}>
            {children}
        </div>
    );
}

/* ─── Floating 3D emoji ─── */
function Float3D({ emoji, className }) {
    return (
        <span className={`inline-block ${className}`} style={{
            animation: "float3d 3s ease-in-out infinite",
            transformStyle: "preserve-3d",
        }}>
            {emoji}
        </span>
    );
}

/* ─── Main ─── */
export default function LandingPageClient({ courses }) {
    return (
        <div className="bg-white text-slate-800" style={{ perspective: "1200px" }}>
            <VisitTracker />

            {/* ── HERO ── */}
            <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-amber-50 to-emerald-50 border-b border-slate-200">
                <HeroGlobe />
                <div className="relative mx-auto max-w-[1100px] px-[4vw] py-16 md:py-24">
                    <div className="max-w-2xl space-y-5" style={{ transformStyle: "preserve-3d" }}>
                        <span className="hero-animate inline-block rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-emerald-700">
                            <Float3D emoji="🌟" className="mr-1" /> 100% Free Learning Platform
                        </span>
                        <h1 className="hero-animate-d1 text-3xl font-black leading-tight md:text-5xl">
                            Learn 100% Free <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">Computer Courses</span>
                        </h1>
                        <p className="hero-animate-d2 text-slate-500 md:text-lg leading-relaxed">
                            Free online computer courses for everyone. Learn digital skills from basics to advanced and grow your career with practical, job-ready education.
                        </p>
                        <div className="hero-animate-d2 flex flex-wrap gap-3 pt-1">
                            <a href="#course-grid" className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-orange-200 transition-all duration-200 hover:-translate-y-1 hover:shadow-orange-300 hover:scale-105 active:scale-100">
                                <Float3D emoji="🚀" className="text-base" /> Start Learning
                            </a>
                            <a href="#categories" className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-600 transition-all duration-200 hover:border-orange-300 hover:text-orange-600 hover:scale-105 active:scale-100">
                                📚 Explore Categories
                            </a>
                        </div>
                        <p className="hero-animate-d3 text-sm text-slate-400">
                            💻 Computer Course &nbsp;|&nbsp; 📄 PDF Notes &nbsp;|&nbsp; 🧠 Quiz &nbsp;|&nbsp; ⚡ Tricks
                        </p>
                    </div>
                </div>
            </section>

            {/* ── CATEGORIES ── */}
            <section id="categories" className="mx-auto max-w-[1100px] px-[4vw] py-14 md:py-20">
                <Reveal>
                    <p className="text-xs font-semibold uppercase tracking-widest text-orange-600">📚 Categories</p>
                    <h2 className="mt-1 text-2xl font-extrabold md:text-3xl">What do you want to learn?</h2>
                </Reveal>
                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {categories.map((c, i) => (
                        <Reveal key={c.title} delay={i * 80}>
                            <Tilt3D className="cursor-pointer rounded-xl border border-slate-200 bg-white p-5 hover:border-orange-300 hover:shadow-xl hover:shadow-orange-100/50">
                                <Float3D emoji={c.emoji} className="text-4xl" />
                                <h3 className="mt-3 text-base font-bold">{c.title}</h3>
                                <p className="mt-1 text-sm text-slate-500">{c.subtitle}</p>
                            </Tilt3D>
                        </Reveal>
                    ))}
                </div>
            </section>

            {/* ── COURSES ── */}
            <section id="course-grid" className="bg-slate-50 py-10 md:py-14">
                <div className="mx-auto max-w-[1100px] px-[4vw]">
                    <Reveal>
                        <p className="text-xs font-semibold uppercase tracking-widest text-orange-600">🎓 Free Computer Courses</p>
                        <h2 className="mt-1 text-2xl font-extrabold md:text-3xl">Basic to Advanced, job-ready skills</h2>
                    </Reveal>
                    <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
                        {courses.map((course, i) => (
                            <Reveal key={course.id} delay={i * 60}>
                                <Tilt3D intensity={6} className="rounded-xl border border-slate-200 bg-white p-5 hover:border-orange-300 hover:shadow-xl hover:shadow-orange-50">
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
                                    <Link href={`/courses/${course.slug}`} className="mt-4 inline-flex rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-orange-600 transition hover:border-orange-300 hover:bg-orange-50 hover:scale-105 active:scale-100">
                                        View Details →
                                    </Link>
                                </Tilt3D>
                            </Reveal>
                        ))}
                        {courses.length === 0 && (
                            <div className="col-span-full rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-400">
                                📦 No active courses yet. Add from admin panel.
                            </div>
                        )}
                    </div>
                    <Reveal>
                        <Link href="/courses" className="mt-6 inline-block text-sm font-semibold text-orange-600 hover:underline">View all courses →</Link>
                    </Reveal>
                </div>
            </section>

            {/* ── STATS ── */}
            <section className="mx-auto max-w-[1100px] px-[4vw] py-14 md:py-20">
                <Reveal>
                    <div className="rounded-2xl border border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50 p-6 md:p-8" style={{ transformStyle: "preserve-3d" }}>
                        <p className="text-xs font-semibold uppercase tracking-widest text-orange-600">🏆 Trusted by Students</p>
                        <h3 className="mt-1 text-xl font-extrabold md:text-2xl">Real learners, real outcomes</h3>
                        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                            {stats.map((s, i) => (
                                <Tilt3D key={s.label} intensity={12} className="rounded-xl border border-slate-200 bg-white p-4 text-center">
                                    <Float3D emoji={s.emoji} className="text-3xl" />
                                    <p className="mt-1 text-xl font-extrabold text-orange-600">{s.value}</p>
                                    <p className="text-xs text-slate-500">{s.label}</p>
                                </Tilt3D>
                            ))}
                        </div>
                        <p className="mt-4 text-sm text-slate-500">Trusted by schools, coaching institutes, and self-learners.</p>
                    </div>
                </Reveal>
            </section>

            {/* ── REVIEWS ── */}
            <section className="bg-slate-50 py-10 md:py-14">
                <div className="mx-auto max-w-[1100px] px-[4vw]">
                    <Reveal>
                        <p className="text-xs font-semibold uppercase tracking-widest text-orange-600">💬 Student Reviews</p>
                        <h3 className="mt-1 text-xl font-extrabold md:text-2xl">Real feedback from learners</h3>
                        <p className="mt-1 text-sm text-slate-400">⭐ 4.7 / 5 (21,255 reviews)</p>
                    </Reveal>
                    <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                        {reviewItems.map((r, i) => (
                            <Reveal key={r.name} delay={i * 80}>
                                <Tilt3D intensity={8} className="rounded-xl border border-slate-200 bg-white p-5 hover:border-orange-300 hover:shadow-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-600">{r.initial}</div>
                                        <div>
                                            <p className="text-sm font-bold">{r.name}</p>
                                            <p className="text-xs text-slate-400">Computer Course Student</p>
                                        </div>
                                    </div>
                                    <p className="mt-2 text-sm text-amber-500">{"⭐".repeat(r.rating)}</p>
                                    <p className="mt-1 text-sm leading-relaxed text-slate-500">{r.text}</p>
                                </Tilt3D>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── WHY US ── */}
            <section className="mx-auto max-w-[1100px] px-[4vw] py-14 md:py-20">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    <Reveal>
                        <p className="text-xs font-semibold uppercase tracking-widest text-orange-600">✨ Why Choose Us</p>
                        <h3 className="mt-1 text-xl font-extrabold md:text-2xl">Simple, secure, student-friendly</h3>
                    </Reveal>
                    <div className="grid gap-3">
                        {whyUs.map((item, i) => (
                            <Reveal key={item.text} delay={i * 60} direction="left">
                                <Tilt3D intensity={6} className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 bg-white p-3.5 text-sm hover:border-orange-300 hover:shadow-md">
                                    <span className="text-2xl">{item.emoji}</span>
                                    <span className="text-slate-600">{item.text}</span>
                                </Tilt3D>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── FAQ ── */}
            <section className="bg-slate-50 py-10 md:py-14">
                <div className="mx-auto max-w-[1100px] px-[4vw]">
                    <Reveal>
                        <p className="text-xs font-semibold uppercase tracking-widest text-orange-600">❓ FAQ</p>
                    </Reveal>
                    <div className="mt-4 grid gap-3">
                        {faqs.map((f, i) => (
                            <Reveal key={f.q} delay={i * 80}>
                                <Tilt3D intensity={4} className="rounded-lg border border-slate-200 bg-white p-4 hover:border-orange-300 cursor-pointer">
                                    <h4 className="font-bold text-slate-800">{f.q}</h4>
                                    <p className="mt-1 text-sm text-slate-500">{f.a}</p>
                                </Tilt3D>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── FOOTER ── */}
            <footer className="border-t border-slate-200 bg-slate-50 py-10">
                <div className="mx-auto grid max-w-[1100px] grid-cols-1 gap-7 px-[4vw] md:grid-cols-3">
                    <div>
                        <h4 className="text-lg font-bold text-orange-600">🌐 LearnSphere</h4>
                        <p className="mt-1 text-sm text-slate-400">FOLLOW US</p>
                    </div>
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wide text-slate-600">Useful Links</p>
                        <ul className="mt-2 space-y-1 text-sm text-slate-500">
                            <li className="cursor-pointer hover:text-orange-600 transition">Courses</li>
                            <li className="cursor-pointer hover:text-orange-600 transition">Notes</li>
                            <li className="cursor-pointer hover:text-orange-600 transition">Quiz</li>
                            <li className="cursor-pointer hover:text-orange-600 transition">Blogs</li>
                        </ul>
                    </div>
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wide text-slate-600">Important Links</p>
                        <ul className="mt-2 space-y-1 text-sm text-slate-500">
                            <li className="cursor-pointer hover:text-orange-600 transition">Privacy Policy</li>
                            <li className="cursor-pointer hover:text-orange-600 transition">Contact Us</li>
                            <li className="cursor-pointer hover:text-orange-600 transition">About Us</li>
                        </ul>
                    </div>
                </div>
                <p className="mt-8 text-center text-xs text-slate-400">Copyright 2026 LearnSphere. All Rights Reserved.</p>
            </footer>
        </div>
    );
}
