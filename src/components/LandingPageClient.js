"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import Link from "next/link";
import VisitTracker from "@/components/VisitTracker";
import { LogoMark, IconComputer, IconPdf, IconQuiz, IconBolt, IconGrad, IconCheck, IconStar, IconChart, IconFree, IconRocket, IconLock, IconPhone, IconTool, IconTrophy, IconMsg, IconClock, IconSparkle, IconBox, IconBook } from "@/components/Icons";

const categories = [
    { icon: <IconComputer size={36} />, title: "Computer Course", subtitle: "Basic to Advanced learning" },
    { icon: <IconPdf size={36} />, title: "PDF Notes", subtitle: "Downloadable study material" },
    { icon: <IconQuiz size={36} />, title: "Computer Quiz", subtitle: "Computer MCQ practice sets" },
    { icon: <IconBolt size={36} />, title: "Computer Tricks", subtitle: "Computer Tips, Tricks & shortcuts" },
];
const defaultReviews = [
    { name: "Abhijit Patgirri", initial: "A", rating: 5, text: "One of the best platforms to learn for free. Practical computer skills with strong quality." },
    { name: "Sakshi Kanojiya", initial: "S", rating: 5, text: "Very useful for students. Courses are full of practical knowledge and help with career growth." },
    { name: "Madhusudan Pal", initial: "M", rating: 5, text: "A true opportunity for students who cannot afford paid classes to build skills and confidence." },
];
const whyUs = [
    {
        icon: <IconFree size={22} color="#3b82f6" />,
        iconBg: "rgba(59,130,246,.12)",
        title: "100% Free",
        text: "Access courses and resources with no hidden costs.",
    },
    {
        icon: <IconPdf size={22} color="#10b981" />,
        iconBg: "rgba(16,185,129,.12)",
        title: "PDF Notes",
        text: "Download concise notes for quick revision and exam prep.",
    },
    {
        icon: <IconRocket size={22} color="#f59e0b" />,
        iconBg: "rgba(245,158,11,.14)",
        title: "No Login",
        text: "Start learning instantly-no account required.",
    },
    {
        icon: <IconLock size={22} color="#8b5cf6" />,
        iconBg: "rgba(139,92,246,.12)",
        title: "Secure",
        text: "Privacy-first experience with reliable uptime.",
    },
    {
        icon: <IconPhone size={22} color="#10b981" />,
        iconBg: "rgba(16,185,129,.12)",
        title: "Call Support",
        text: "Mon-Sat, 10:00 AM-12:00 PM for phone assistance.",
    },
    {
        icon: <IconTool size={22} color="#0ea5e9" />,
        iconBg: "rgba(14,165,233,.12)",
        title: "Project-based Practice",
        text: "Build real projects to strengthen skills and portfolio.",
    },
];
const faqs = [
    {
        q: "WEBCOM kya hai?",
        a: "WEBCOM ek online platform hai jo students ko 100% Free Computer Courses provide karta hai. Iska maqsad (mission) har student ko free mein quality computer education dena hai, chahe woh kisi bhi background se ho.",
    },
    {
        q: "Kya yahan sabhi courses sach mein free hain?",
        a: "Haan, yahan ke core computer courses bilkul free hain. Aap bina kisi fees ke learning start kar sakte hain aur available study material ka use kar sakte hain.",
    },
    {
        q: "Course ki language (bhasha) kya hai?",
        a: "Courses simple Hindi aur easy English mix mein explain kiye gaye hain, taaki beginners bhi concepts ko easily follow kar saken.",
    },
];
/* ── 3D Particle Globe ── */
function HeroGlobe() {
    const canvasRef = useRef(null);
    const sectionRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const section = sectionRef.current;
        if (!canvas || !section) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let w = 0, h = 0, raf = 0, t = 0, paused = false;
        let targetRX = 0, targetRY = 0, rotX = 0, rotY = 0, isNear = false;
        let cachedRect = null, rectTimer = 0;
        const N = 400;
        const dots = Array.from({ length: N }, (_, i) => {
            const phi = Math.acos(1 - 2 * (i + 0.5) / N);
            const theta = Math.PI * (1 + Math.sqrt(5)) * i;
            return { sp: Math.sin(phi), cp: Math.cos(phi), theta, r: 155 + Math.random() * 55, spd: 0.0003 + Math.random() * 0.0002 };
        });

        const resize = () => { w = canvas.width = canvas.offsetWidth; h = canvas.height = canvas.offsetHeight; cachedRect = null; };
        resize();
        window.addEventListener("resize", resize);

        const getRect = () => { if (!cachedRect) { cachedRect = section.getBoundingClientRect(); } return cachedRect; };

        let mouseRaf = 0;
        const onMouse = (e) => {
            if (mouseRaf) return;
            mouseRaf = requestAnimationFrame(() => {
                mouseRaf = 0;
                const rect = getRect();
                const pad = 80;
                isNear = e.clientX >= rect.left - pad && e.clientX <= rect.right + pad && e.clientY >= rect.top - pad && e.clientY <= rect.bottom + pad;
                if (isNear) {
                    targetRY = ((e.clientX - rect.left) / rect.width - 0.5) * 4.5;
                    targetRX = ((e.clientY - rect.top) / rect.height - 0.5) * 3.0;
                }
            });
        };
        window.addEventListener("mousemove", onMouse, { passive: true });

        const onScroll = () => { cachedRect = null; };
        window.addEventListener("scroll", onScroll, { passive: true });

        const onLeave = () => { isNear = false; targetRX = 0; targetRY = 0; };
        section.addEventListener("mouseleave", onLeave);

        const onVis = () => { paused = document.hidden; };
        document.addEventListener("visibilitychange", onVis);

        const colors = [[99, 102, 241], [139, 92, 246], [34, 211, 238]];
        const colorCache = colors.map(c => {
            const arr = [];
            for (let a = 0; a <= 10; a++) { arr.push(`rgba(${c[0]},${c[1]},${c[2]},${(a / 10).toFixed(2)})`); }
            return arr;
        });

        const render = () => {
            if (!paused) {
                t++;
                if (++rectTimer > 60) { rectTimer = 0; cachedRect = null; }

                const spd = isNear ? 0.12 : 0.04;
                rotX += (targetRX - rotX) * spd;
                rotY += (targetRY - rotY) * spd;
                if (!isNear) { targetRX *= 0.98; targetRY *= 0.98; }

                const sRX = Math.sin(rotX), cRX = Math.cos(rotX);
                const sRY = Math.sin(rotY), cRY = Math.cos(rotY);
                const aS = Math.sin(t * 0.004), aC = Math.cos(t * 0.004);

                ctx.clearRect(0, 0, w, h);
                const cx = w * 0.5, cy = h * 0.5;

                for (let i = 0; i < N; i++) {
                    const d = dots[i];
                    const th = d.theta + t * d.spd;
                    const st = Math.sin(th), ct = Math.cos(th);
                    let px = d.r * d.sp * ct, py = d.r * d.sp * st, pz = d.r * d.cp;
                    let tx = px * aC - pz * aS, tz = px * aS + pz * aC; px = tx; pz = tz;
                    tx = px * cRY - pz * sRY; tz = px * sRY + pz * cRY; px = tx; pz = tz;
                    let ty = py * cRX - pz * sRX; tz = py * sRX + pz * cRX; py = ty; pz = tz;

                    const sc = (pz + d.r) / (2 * d.r);
                    const aIdx = Math.min(10, (sc * 10 + 0.7) | 0);
                    const sz = 0.5 + sc * 3.0;

                    ctx.beginPath();
                    ctx.arc(cx + px, cy + py * 0.45, sz, 0, 6.28);
                    ctx.fillStyle = colorCache[i % 3][aIdx];
                    ctx.fill();
                }
            }
            raf = requestAnimationFrame(render);
        };
        render();

        return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); window.removeEventListener("mousemove", onMouse); window.removeEventListener("scroll", onScroll); section.removeEventListener("mouseleave", onLeave); document.removeEventListener("visibilitychange", onVis); };
    }, []);

    return (
        <div ref={sectionRef} className="absolute inset-0 overflow-hidden">
            <canvas ref={canvasRef} className="absolute right-0 top-0 h-full w-[55%] opacity-85 max-md:w-full max-md:opacity-30" />
        </div>
    );
}

/* ── 3D Tilt Card ── */
function Tilt3D({ children, className = "", intensity = 10 }) {
    const ref = useRef(null);
    const onMove = useCallback((e) => {
        const el = ref.current; if (!el) return;
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(600px) rotateX(${-y * intensity}deg) rotateY(${x * intensity}deg) translateZ(8px) scale3d(1.03,1.03,1.03)`;
    }, [intensity]);
    const onLeave = useCallback(() => {
        if (ref.current) ref.current.style.transform = "perspective(600px) rotateX(0) rotateY(0) translateZ(0) scale3d(1,1,1)";
    }, []);
    return <div ref={ref} className={className} onMouseMove={onMove} onMouseLeave={onLeave} style={{ transition: "transform 0.18s ease-out", willChange: "transform", transformStyle: "preserve-3d" }}>{children}</div>;
}

/* ── Scroll Reveal ── */
function Reveal({ children, className = "", delay = 0, direction = "up" }) {
    const ref = useRef(null);
    useEffect(() => {
        const el = ref.current; if (!el) return;
        const obs = new IntersectionObserver(([e]) => {
            if (e.isIntersecting) { setTimeout(() => { el.style.opacity = "1"; el.style.transform = "translate3d(0,0,0) rotateX(0) rotateY(0)"; }, delay); obs.unobserve(el); }
        }, { threshold: 0.08 });
        obs.observe(el);
        return () => obs.disconnect();
    }, [delay]);
    const init = direction === "left" ? "translate3d(-40px,0,0) rotateY(5deg)" : direction === "right" ? "translate3d(40px,0,0) rotateY(-5deg)" : "translate3d(0,35px,-20px) rotateX(5deg)";
    return <div ref={ref} className={className} style={{ opacity: 0, transform: init, transition: "opacity 0.65s ease, transform 0.65s ease", transformStyle: "preserve-3d" }}>{children}</div>;
}

/* ── 3D Parallax Section ── */
function Parallax3D({ children, className = "" }) {
    const ref = useRef(null);
    useEffect(() => {
        const el = ref.current; if (!el) return;
        let ticking = false;
        const onScroll = () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(() => {
                const rect = el.getBoundingClientRect();
                const center = rect.top + rect.height / 2;
                const vh = window.innerHeight;
                const ratio = (center - vh / 2) / vh;
                el.style.transform = `perspective(1000px) rotateX(${ratio * 3}deg) translateY(${ratio * -8}px)`;
                ticking = false;
            });
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();
        return () => window.removeEventListener("scroll", onScroll);
    }, []);
    return <div ref={ref} className={className} style={{ transition: "transform 0.1s linear", transformStyle: "preserve-3d" }}>{children}</div>;
}

/* ── 3D Scale on scroll ── */
function ScaleReveal({ children, className = "" }) {
    const ref = useRef(null);
    useEffect(() => {
        const el = ref.current; if (!el) return;
        let ticking = false;
        const onScroll = () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(() => {
                const rect = el.getBoundingClientRect();
                const vh = window.innerHeight;
                const progress = Math.max(0, Math.min(1, (vh - rect.top) / (vh * 0.6)));
                const sc = 0.92 + progress * 0.08;
                const op = Math.max(0, Math.min(1, progress * 1.5));
                el.style.transform = `scale3d(${sc},${sc},1)`;
                el.style.opacity = op;
                ticking = false;
            });
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();
        return () => window.removeEventListener("scroll", onScroll);
    }, []);
    return <div ref={ref} className={className} style={{ transformOrigin: "center center", transition: "transform 0.05s linear, opacity 0.05s linear" }}>{children}</div>;
}

/* ── Main ── */
export default function LandingPageClient({ courses, reviews = [], googleReviewUrl = "https://www.google.com" }) {
    const [openFaqIndex, setOpenFaqIndex] = useState(0);
    const reviewCards = reviews.length > 0
        ? reviews.map((review) => ({
            name: review.name,
            role: review.role || "Student",
            rating: Number(review.rating || 5),
            text: review.reviewText,
        }))
        : defaultReviews.map((review) => ({ ...review, role: "Computer Course Student" }));
    const marqueeReviews = [...reviewCards, ...reviewCards];

    return (
        <div style={{ perspective: "1200px", background: "var(--bg)", color: "var(--ink)", transition: "background 0.3s,color 0.3s" }}>
            <VisitTracker />

            {/* HERO */}
            <section className="relative overflow-hidden" style={{ background: "linear-gradient(135deg,var(--hero-from),var(--hero-via),var(--hero-to))", borderBottom: "1px solid var(--line)", transition: "background 0.3s" }}>
                <HeroGlobe />
                <div className="relative mx-auto max-w-[1100px] px-[4vw] py-16 md:py-28">
                    <div className="max-w-2xl space-y-5" style={{ transformStyle: "preserve-3d" }}>
                        <span className="hero-animate inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest" style={{ border: "1px solid var(--line)", background: "var(--paper)", color: "var(--brand)", backdropFilter: "blur(8px)" }}>
                            <IconSparkle size={14} /> 100% Free Learning Platform
                        </span>
                        <h1 className="hero-animate-d1 text-3xl font-black leading-tight md:text-5xl" style={{ color: "var(--ink)" }}>
                            Learn 100% Free <span style={{ background: "linear-gradient(to right, var(--brand), var(--accent))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Computer Courses</span>
                        </h1>
                        <p className="hero-animate-d2 md:text-lg leading-relaxed" style={{ color: "var(--text-muted)" }}>
                            Free online computer courses for everyone. Learn digital skills from basics to advanced and grow your career with practical, job-ready education.
                        </p>
                        <div className="hero-animate-d2 flex flex-wrap gap-3 pt-1">
                            <a href="#course-grid" className="inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-bold text-white shadow-lg transition-all duration-200 hover:-translate-y-1 hover:scale-105 active:scale-100" style={{ background: "linear-gradient(to right, var(--brand), var(--accent))" }}>
                                <IconRocket size={16} color="#fff" /> Start Learning
                            </a>
                            <a href="#categories" className="inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-semibold transition-all duration-200 hover:scale-105 active:scale-100" style={{ border: "1px solid var(--line)", background: "var(--paper)", color: "var(--brand)", backdropFilter: "blur(8px)" }}>
                                <IconBook size={16} /> Explore Categories
                            </a>
                        </div>
                        <p className="hero-animate-d3 flex items-center gap-3 flex-wrap text-sm" style={{ color: "var(--text-muted)" }}>
                            <span className="inline-flex items-center gap-1"><IconComputer size={14} /> Computer Course</span>
                            <span className="inline-flex items-center gap-1"><IconPdf size={14} /> PDF Notes</span>
                            <span className="inline-flex items-center gap-1"><IconQuiz size={14} /> Quiz</span>
                            <span className="inline-flex items-center gap-1"><IconBolt size={14} /> Tricks</span>
                        </p>
                    </div>
                </div>
            </section>

            {/* CATEGORIES */}
            <Parallax3D>
                <section id="categories" className="py-14 md:py-16" style={{ background: "#f3f4f6" }}>
                    <div className="mx-auto max-w-[1100px] px-[4vw]">
                        <Reveal>
                            <div className="text-center">
                                <h2 className="text-[2rem] font-semibold leading-tight" style={{ color: "#1f2937" }}>Explore Categories</h2>
                                <p className="mt-2 text-sm" style={{ color: "#6b7280" }}>
                                    Computer Course • PDF Notes • Quiz • Computer Tricks
                                </p>
                            </div>
                        </Reveal>
                        <div className="mt-9 grid grid-cols-1 gap-8 text-center sm:grid-cols-2 lg:grid-cols-4">
                            {categories.map((c, i) => (
                                <Reveal key={c.title} delay={i * 80}>
                                    <Tilt3D className="cursor-pointer transition-transform" intensity={7}>
                                        <div className="mx-auto flex h-[74px] w-[74px] items-center justify-center rounded-full shadow-sm" style={{ background: "#ffffff", border: "1px solid rgba(148,163,184,.22)", color: "#3b82f6" }}>
                                            {c.icon}
                                        </div>
                                        <h3 className="mt-4 text-[1.28rem] font-semibold leading-tight" style={{ color: "#1f2937" }}>{c.title}</h3>
                                        <p className="mt-1 text-[15px]" style={{ color: "#6b7280" }}>{c.subtitle}</p>
                                    </Tilt3D>
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </section>
            </Parallax3D>

            {/* COURSES */}
            <ScaleReveal>
                <section id="course-grid" className="py-10 md:py-14" style={{ background: "var(--bg-alt)", transition: "background 0.3s" }}>
                    <div className="mx-auto max-w-[1100px] px-[4vw]">
                        <Reveal>
                            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--brand)" }}><IconGrad size={14} /> Free Computer Courses</p>
                            <h2 className="mt-1 text-2xl font-extrabold md:text-3xl">Basic to Advanced, job-ready skills</h2>
                        </Reveal>
                        <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                            {courses.map((course, i) => (
                                <Reveal key={course.id} delay={i * 60}>
                                    <article className="overflow-hidden rounded-xl shadow-sm transition-shadow hover:shadow-xl" style={{ border: "1px solid var(--line)", background: "var(--paper)" }}>
                                        <div className="relative aspect-[16/9] w-full overflow-hidden" style={{ background: "linear-gradient(120deg, #0f172a, #312e81)" }}>
                                            {course.courseImage ? (
                                                <img src={course.courseImage} alt={`${course.title} banner`} className="h-full w-full object-cover" loading="lazy" />
                                            ) : (
                                                <div className="flex h-full w-full items-end p-4 text-white">
                                                    <p className="text-2xl font-semibold uppercase leading-tight">{course.title}</p>
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-4">
                                            <div className="mb-2 flex items-center justify-between gap-2 text-[11px]">
                                                <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-semibold" style={{ border: "1px solid var(--badge-green-border)", background: "var(--badge-green-bg)", color: "var(--badge-green-text)" }}>
                                                    {course.courseType?.name || "General"}
                                                </span>
                                                <span className="inline-flex items-center gap-1" style={{ color: "var(--text-muted)" }}><IconClock size={12} /> {course.duration}</span>
                                            </div>
                                            <h3 className="text-[1.12rem] font-semibold" style={{ color: "var(--ink)" }}>{course.title}</h3>
                                            <div className="mt-1 flex items-center gap-0.5">
                                                {Array.from({ length: Math.round(Number(course.rating || 4.5)) }).map((_, starIndex) => (
                                                    <IconStar key={`${course.id}-star-${starIndex}`} size={13} color="#facc15" />
                                                ))}
                                                <span className="ml-1 text-xs" style={{ color: "var(--text-muted)" }}>({Number(course.rating || 4.5).toFixed(1)})</span>
                                            </div>
                                            <div className="mt-2 flex items-center gap-2 text-sm">
                                                <span className="font-bold" style={{ color: "var(--ink)" }}>₹ {course.offerPrice.toFixed(2)}</span>
                                                <span className="line-through" style={{ color: "var(--text-muted)" }}>₹ {course.originalPrice.toFixed(0)}</span>
                                                <span className="font-semibold" style={{ color: "#ef4444" }}>| {Number(course.discountPercent || 0).toFixed(0)}% OFF</span>
                                            </div>
                                            <Link href={`/courses/${course.slug}`} className="mt-3 inline-flex text-sm font-semibold hover:underline" style={{ color: "var(--brand)" }}>
                                                View course details
                                            </Link>
                                        </div>
                                    </article>
                                </Reveal>
                            ))}
                            {courses.length === 0 && (
                                <div className="col-span-full rounded-xl border border-dashed p-8 text-center" style={{ borderColor: "var(--line)", background: "var(--paper)", color: "var(--text-muted)" }}>
                                    <IconBox size={20} /> No active courses yet. Add from admin panel.
                                </div>
                            )}
                        </div>
                        <Reveal>
                            <div className="mt-6 flex justify-center">
                                <Link href="/courses" className="inline-flex items-center rounded-md px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:brightness-110" style={{ background: "linear-gradient(to right, #2563eb, #1d4ed8)" }}>
                                    View all courses
                                </Link>
                            </div>
                        </Reveal>
                    </div>
                </section>
            </ScaleReveal>

            {/* STATS */}
            <section className="mx-auto max-w-[1100px] px-[4vw] py-14 md:py-20">
                <Reveal>
                    <div className="rounded-3xl p-6 md:p-8" style={{ border: "1px solid var(--line)", background: "linear-gradient(170deg, rgba(255,255,255,.95), rgba(232,229,248,.6))", transition: "background 0.3s" }}>
                        <div className="text-center">
                            <p className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em]" style={{ color: "var(--brand)", border: "1px solid rgba(99,102,241,0.18)", background: "rgba(99,102,241,.08)" }}><IconTrophy size={14} /> Trusted by Students</p>
                            <h3 className="mt-2 text-[1.55rem] font-semibold md:text-[2rem]" style={{ color: "#1f2937" }}>Real learners, real outcomes</h3>
                        </div>

                        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                            <article className="rounded-2xl p-6 text-center shadow-sm" style={{ border: "1px solid rgba(15,23,42,0.08)", background: "rgba(255,255,255,.95)" }}>
                                <p className="text-4xl font-semibold tracking-tight md:text-5xl" style={{ color: "#111827" }}>40,25,000 <span className="text-xl font-medium" style={{ color: "#6b7280" }}>+ students</span></p>
                                <p className="mt-2 text-sm" style={{ color: "#6b7280" }}>Joined our courses and resources</p>
                            </article>

                            <div className="grid grid-cols-1 gap-4">
                                <article className="rounded-2xl p-4 shadow-sm" style={{ border: "1px solid rgba(15,23,42,0.08)", background: "rgba(255,255,255,.95)" }}>
                                    <div className="flex items-center gap-3">
                                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full" style={{ background: "rgba(34,197,94,.12)", color: "#16a34a" }}><IconCheck size={18} color="#16a34a" /></span>
                                        <div>
                                            <p className="text-sm font-semibold" style={{ color: "#111827" }}>Verified Learning Platform</p>
                                            <p className="text-sm" style={{ color: "#6b7280" }}>Secure content delivery and privacy focused</p>
                                        </div>
                                    </div>
                                </article>

                                <div className="grid grid-cols-2 gap-4">
                                    <article className="rounded-2xl p-4 text-center shadow-sm" style={{ border: "1px solid rgba(15,23,42,0.08)", background: "rgba(255,255,255,.95)" }}>
                                        <IconStar size={20} color="#f59e0b" />
                                        <p className="mt-2 text-xl font-semibold" style={{ color: "#111827" }}>4.7/5</p>
                                        <p className="text-xs" style={{ color: "#6b7280" }}>Average rating</p>
                                    </article>
                                    <article className="rounded-2xl p-4 text-center shadow-sm" style={{ border: "1px solid rgba(15,23,42,0.08)", background: "rgba(255,255,255,.95)" }}>
                                        <IconChart size={20} color="#2563eb" />
                                        <p className="mt-2 text-xl font-semibold" style={{ color: "#111827" }}>150k+</p>
                                        <p className="text-xs" style={{ color: "#6b7280" }}>Monthly learners</p>
                                    </article>
                                </div>
                            </div>
                        </div>

                        <div className="mt-5 flex justify-center">
                            <p className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs" style={{ border: "1px solid rgba(15,23,42,0.08)", background: "rgba(255,255,255,.9)", color: "#6b7280" }}>
                                <span className="inline-block h-2 w-2 rounded-full" style={{ background: "#2563eb" }} />
                                Trusted by schools, coaching institutes, and self-learners
                            </p>
                        </div>
                    </div>
                </Reveal>
            </section>

            {/* REVIEWS */}
            <Parallax3D>
                <section className="py-10 md:py-14" style={{ background: "var(--bg-alt)", transition: "background 0.3s" }}>
                    <div className="mx-auto max-w-[1100px] px-[4vw]">
                        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                            <Reveal>
                                <div>
                                    <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--brand)" }}><IconMsg size={14} /> Student Reviews</p>
                                    <h3 className="mt-1 text-xl font-extrabold md:text-2xl">Real feedback from learners</h3>
                                    <p className="mt-1 flex items-center gap-1 text-sm" style={{ color: "var(--text-muted)" }}><IconStar size={14} /> {reviewCards.length} active reviews</p>
                                </div>
                            </Reveal>
                            <Reveal>
                                <a
                                    href={googleReviewUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition hover:scale-[1.02] active:scale-100"
                                    style={{ border: "1px solid var(--line)", background: "var(--paper)", color: "var(--brand)" }}
                                >
                                    <IconStar size={14} /> Add Review
                                </a>
                            </Reveal>
                        </div>
                        <div className="mt-6 overflow-hidden rounded-2xl border" style={{ borderColor: "var(--line)", background: "linear-gradient(180deg, rgba(255,255,255,.55), rgba(255,255,255,.35))" }}>
                            <div className="marquee-track flex w-max gap-4 py-4 pl-4 pr-4">
                                {marqueeReviews.map((review, index) => (
                                    <article
                                        key={`${review.name}-${index}`}
                                        className="flex h-[178px] w-[290px] shrink-0 flex-col rounded-2xl bg-white p-5 shadow-sm"
                                        style={{ border: "1px solid rgba(15,23,42,0.06)" }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold" style={{ background: "var(--brand-soft)", color: "var(--brand)" }}>
                                                {review.name?.[0]?.toUpperCase() || "S"}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold" style={{ color: "var(--ink)" }}>{review.name}</p>
                                                <p className="text-xs" style={{ color: "var(--text-muted)" }}>{review.role}</p>
                                            </div>
                                        </div>
                                        <div className="mt-3 flex gap-0.5">
                                            {Array.from({ length: review.rating || 5 }).map((_, j) => (
                                                <IconStar key={j} size={14} color="#f59e0b" />
                                            ))}
                                        </div>
                                        <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--text-muted)", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                                            {review.text}
                                        </p>
                                    </article>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            </Parallax3D>

            {/* WHY US */}
            <ScaleReveal>
                <section className="mx-auto max-w-[1100px] px-[4vw] py-14 md:py-20">
                    <Reveal>
                        <div className="mx-auto max-w-2xl text-center">
                            <p className="flex items-center justify-center gap-1.5 text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--brand)" }}><IconSparkle size={14} /> Why Choose Us</p>
                            <h3 className="mt-1 text-2xl font-medium md:text-[31px]">Simple, secure, and truly student-friendly</h3>
                        </div>
                    </Reveal>
                    <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {whyUs.map((item, i) => (
                            <Reveal key={item.title} delay={i * 60}>
                                <div className="rounded-2xl bg-white p-4 shadow-[0_2px_10px_rgba(15,23,42,0.06)] transition-shadow hover:shadow-[0_6px_20px_rgba(15,23,42,0.08)]" style={{ border: "1px solid rgba(15,23,42,0.06)" }}>
                                    <div className="flex items-start gap-3">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full" style={{ background: item.iconBg }}>
                                            {item.icon}
                                        </div>
                                        <div className="min-w-0">
                                            <h4 className="text-base font-semibold leading-tight" style={{ color: "#111827" }}>{item.title}</h4>
                                            <p className="mt-1 text-sm leading-relaxed" style={{ color: "#6b7280" }}>{item.text}</p>
                                        </div>
                                    </div>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </section>
            </ScaleReveal>

            {/* FAQ */}
            <section className="py-10 md:py-14" style={{ background: "var(--bg-alt)", transition: "background 0.3s" }}>
                <div className="mx-auto max-w-[1100px] px-[4vw]">
                    <Reveal><p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--brand)" }}><IconQuiz size={14} /> FAQ</p></Reveal>
                    <div className="mt-4 grid gap-3">
                        {faqs.map((f, i) => {
                            const isOpen = openFaqIndex === i;

                            return (
                                <Reveal key={f.q} delay={i * 80}>
                                    <div
                                        className="overflow-hidden rounded-xl shadow-sm transition-all duration-300"
                                        style={{ border: "1px solid var(--line)", background: isOpen ? "#dbeafe" : "var(--paper)" }}
                                    >
                                        <button
                                            type="button"
                                            onClick={() => setOpenFaqIndex(isOpen ? -1 : i)}
                                            aria-expanded={isOpen}
                                            className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left transition-colors duration-300 md:px-5"
                                            style={{ color: "var(--ink)" }}
                                        >
                                            <h4 className="text-[15px] font-medium leading-snug md:text-base">{f.q}</h4>
                                            <span
                                                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-transform duration-300"
                                                style={{ borderColor: isOpen ? "rgba(59,130,246,.35)" : "var(--line)", background: isOpen ? "rgba(255,255,255,.7)" : "rgba(255,255,255,.55)", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                                                aria-hidden="true"
                                            >
                                                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M6 9l6 6 6-6" />
                                                </svg>
                                            </span>
                                        </button>
                                        <div
                                            className="grid transition-[grid-template-rows] duration-300 ease-in-out"
                                            style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                                        >
                                            <div className="overflow-hidden">
                                                <div className="px-4 pb-4 text-sm leading-relaxed md:px-5" style={{ color: "var(--text-muted)" }}>
                                                    {f.a}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Reveal>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="py-10" style={{ borderTop: "1px solid var(--line)", background: "var(--bg-alt)", transition: "background 0.3s" }}>
                <div className="mx-auto grid max-w-[1100px] grid-cols-1 gap-7 px-[4vw] md:grid-cols-3">
                    <div>
                        <h4 className="flex items-center gap-2 text-lg font-bold" style={{ color: "var(--brand)" }}><LogoMark size={24} /> WEBCOM</h4>
                        <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>FOLLOW US</p>
                    </div>
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wide" style={{ color: "var(--ink-secondary)" }}>Useful Links</p>
                        <ul className="mt-2 space-y-1 text-sm" style={{ color: "var(--text-muted)" }}>
                            <li><Link href="/courses" className="hover:underline transition">Courses</Link></li>
                            <li className="cursor-pointer transition">Notes</li>
                            <li><Link href="/quiz" className="hover:underline transition">Quiz</Link></li>
                            <li className="cursor-pointer transition">Blogs</li>
                        </ul>
                    </div>
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wide" style={{ color: "var(--ink-secondary)" }}>Important Links</p>
                        <ul className="mt-2 space-y-1 text-sm" style={{ color: "var(--text-muted)" }}>
                            <li className="cursor-pointer transition">Privacy Policy</li>
                            <li><Link href="/contact" className="hover:underline transition">Contact Us</Link></li>
                            <li className="cursor-pointer transition">About Us</li>
                        </ul>
                    </div>
                </div>
                <p className="mt-8 text-center text-xs" style={{ color: "var(--text-muted)" }}>Copyright 2026 WEBCOM. All Rights Reserved.</p>
            </footer>
        </div>
    );
}
