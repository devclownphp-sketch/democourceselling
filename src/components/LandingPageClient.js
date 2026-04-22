"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import Link from "next/link";
import VisitTracker from "@/components/VisitTracker";
import { IconComputer, IconPdf, IconQuiz, IconBolt, IconGrad, IconCheck, IconStar, IconChart, IconFree, IconRocket, IconLock, IconPhone, IconTool, IconTrophy, IconMsg, IconClock, IconSparkle, IconBox, IconBook, IconYoutube, IconInstagram, IconTelegram, IconMail, IconArrowLeft } from "@/components/Icons";
import { useSettings } from "./SettingsProvider";
import CategoryLogo from "./CategoryLogo";

// Helper to convert Decimal to number/string
function toNum(val) {
    if (!val) return 0;
    if (typeof val === "number") return val;
    if (typeof val === "string") return parseFloat(val) || 0;
    if (val.toString) return parseFloat(val.toString()) || 0;
    return 0;
}

// ═══════════════════════════════════════════════════════════
// KINETIC TYPOGRAPHY HERO SECTION (Design 08)
// ═══════════════════════════════════════════════════════════

// Keyframe CSS injection
function useKineticStyles() {
    useEffect(() => {
        const styleId = "kinetic-keyframes";
        if (document.getElementById(styleId)) return;

        const style = document.createElement("style");
        style.id = styleId;
        style.textContent = `
            @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800;900&display=swap');

            /* DESIGN letter animations - different positions like the reference image */
            @keyframes dJump {
                0%, 100% { transform: translateY(0) rotate(0deg); }
                25% { transform: translateY(-30px) rotate(-3deg); }
                50% { transform: translateY(0) rotate(0deg); }
                75% { transform: translateY(-15px) rotate(2deg); }
            }
            @keyframes eJump {
                0%, 100% { transform: translateY(0) rotate(0deg); }
                30% { transform: translateY(-40px) rotate(5deg); }
                60% { transform: translateY(-20px) rotate(-3deg); }
            }
            @keyframes sJump {
                0%, 100% { transform: translateY(0) rotate(-5deg); }
                40% { transform: translateY(-25px) rotate(0deg); }
                70% { transform: translateY(-35px) rotate(-8deg); }
            }
            @keyframes iJump {
                0%, 100% { transform: translateY(0) rotate(8deg); }
                20% { transform: translateY(-50px) rotate(12deg); }
                50% { transform: translateY(-30px) rotate(5deg); }
                80% { transform: translateY(-45px) rotate(10deg); }
            }
            @keyframes gJump {
                0%, 100% { transform: translateY(0) rotate(0deg); }
                35% { transform: translateY(-35px) rotate(-4deg); }
                65% { transform: translateY(-15px) rotate(3deg); }
            }
            @keyframes nJump {
                0%, 100% { transform: translateY(0) rotate(0deg); }
                45% { transform: translateY(-55px) rotate(6deg); }
                85% { transform: translateY(-25px) rotate(-2deg); }
            }
            @keyframes waveUp {
                0%, 100% { transform: translateY(0) rotate(0deg); }
                50% { transform: translateY(-15px) rotate(3deg); }
            }
            @keyframes kineticScroll {
                0% { transform: translateX(0); }
                100% { transform: translateX(-33.333%); }
            }
            @keyframes gradientPulse {
                0%, 100% { filter: hue-rotate(0deg) brightness(1); }
                50% { filter: hue-rotate(20deg) brightness(1.1); }
            }
        `;
        document.head.appendChild(style);
        return () => {
            const el = document.getElementById(styleId);
            if (el) el.remove();
        };
    }, []);
}

// Animated DESIGN Letter - each has unique jump animation and position
function DesignLetter({ letter, index }) {
    const [hovered, setHovered] = useState(false);

    const letterStyles = {
        "D": { color: "#ff6b6b", animation: "dJump 2.5s ease-in-out 0s infinite", size: "clamp(4rem, 10vw, 8rem)", translateY: "0px" },
        "E": { color: "#ffe66d", animation: "eJump 2.8s ease-in-out 0.2s infinite", size: "clamp(3.5rem, 9vw, 7rem)", translateY: "-20px" },
        "S": { color: "#4ecdc4", animation: "sJump 3s ease-in-out 0.1s infinite", size: "clamp(4.5rem, 11vw, 9rem)", translateY: "15px" },
        "I": { color: "#ff6b6b", animation: "iJump 2.2s ease-in-out 0.3s infinite", size: "clamp(5rem, 14vw, 12rem)", translateY: "40px" },
        "G": { color: "#ffe66d", animation: "gJump 2.6s ease-in-out 0.15s infinite", size: "clamp(4rem, 10vw, 8rem)", translateY: "-10px" },
        "N": { color: "#ffffff", animation: "nJump 2.4s ease-in-out 0.25s infinite", size: "clamp(4.5rem, 11vw, 9rem)", translateY: "-30px" },
    };

    const style = letterStyles[letter] || { color: "#fff", animation: "dJump 2.5s ease-in-out 0s infinite", size: "clamp(4rem, 10vw, 8rem)", translateY: "0px" };

    return (
        <span
            style={{
                display: "inline-block",
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: style.size,
                fontWeight: 900,
                color: style.color,
                animation: hovered ? "none" : style.animation,
                textShadow: hovered ? `0 0 80px ${style.color}` : `0 0 50px ${style.color}50`,
                cursor: "default",
                transition: "text-shadow 0.3s ease, transform 0.3s ease",
                transform: hovered ? "scale(1.4) rotate(10deg)" : `translateY(${style.translateY})`,
                margin: "0 -5px",
                lineHeight: 1,
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {letter}
        </span>
    );
}

// Old Animated Letter - for other uses
function AnimatedLetter({ letter, delay = 0, color = "#fff" }) {
    const [hovered, setHovered] = useState(false);

    return (
        <span
            style={{
                display: "inline-block",
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "clamp(3rem, 12vw, 10rem)",
                fontWeight: 900,
                color: color,
                animation: `letterBounce 2s ease-in-out ${delay}s infinite`,
                textShadow: hovered ? `0 0 60px ${color}` : `0 0 40px ${color}40`,
                cursor: "default",
                transition: "text-shadow 0.3s ease, transform 0.3s ease",
                transform: hovered ? "scale(1.3) rotate(5deg)" : "scale(1) rotate(0deg)",
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {letter}
        </span>
    );
}

// Kinetic Title Word with mouse interaction
function KineticWord({ text, color = "#fff" }) {
    const ref = useRef(null);

    const handleMouseMove = (e) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        ref.current.style.transform = `translateY(${x * 15}px) skewX(${x * 3}deg)`;
    };

    const handleMouseLeave = () => {
        if (ref.current) ref.current.style.transform = "none";
    };

    return (
        <span
            ref={ref}
            style={{
                display: "inline-block",
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "clamp(4rem, 15vw, 12rem)",
                fontWeight: 900,
                color: color,
                lineHeight: 0.9,
                margin: "0 10px",
                transition: "transform 0.3s ease",
                textShadow: `0 0 60px ${color}30`,
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            {text}
        </span>
    );
}

// Wave Text Animation
function WaveText({ text, style = {} }) {
    return (
        <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "2px", ...style }}>
            {text.split("").map((char, i) => (
                <span
                    key={i}
                    style={{
                        display: "inline-block",
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontSize: "clamp(2rem, 6vw, 4rem)",
                        fontWeight: 700,
                        color: "#fff",
                        animation: `waveUp 2s ease-in-out ${i * 0.1}s infinite`,
                    }}
                >
                    {char === " " ? " " : char}
                </span>
            ))}
        </div>
    );
}

// Scrolling Marquee
function KineticMarquee() {
    const items = ["Kinetic Typography", "Motion Design", "Creative Layout", "Dynamic Text", "Animation Studio"];

    return (
        <div style={{
            overflow: "hidden",
            padding: "30px 0",
            borderTop: "1px solid rgba(255,255,255,0.1)",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
            margin: "40px 0",
        }}>
            <div style={{ display: "flex", animation: "kineticScroll 25s linear infinite" }}>
                {[...items, ...items, ...items].map((item, i) => (
                    <span key={i} style={{
                        whiteSpace: "nowrap",
                        padding: "0 30px",
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontSize: "clamp(1.5rem, 4vw, 3rem)",
                        fontWeight: 700,
                        color: "rgba(255,255,255,0.8)",
                        letterSpacing: "0.05em",
                    }}>
                        {item} <span style={{ color: "#ff6b6b", marginLeft: "20px" }}>✦</span>
                    </span>
                ))}
            </div>
        </div>
    );
}

// Feature Card
function FeatureCard({ number, title, description }) {
    const [hovered, setHovered] = useState(false);

    return (
        <div
            style={{
                background: hovered ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.03)",
                borderRadius: "24px",
                padding: "40px",
                position: "relative",
                overflow: "hidden",
                transition: "all 0.4s ease",
                border: "1px solid rgba(255,255,255,0.05)",
                transform: hovered ? "translateY(-10px)" : "translateY(0)",
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <span style={{
                position: "absolute",
                top: "15px",
                right: "25px",
                fontSize: "5rem",
                fontWeight: 900,
                color: "rgba(255,255,255,0.05)",
                fontFamily: "'Playfair Display', Georgia, serif",
            }}>
                {number}
            </span>
            <h3 style={{
                fontSize: "1.5rem",
                fontWeight: 700,
                color: "#fff",
                marginBottom: "15px",
                fontFamily: "'Playfair Display', Georgia, serif",
                position: "relative",
                zIndex: 1,
            }}>
                {title}
            </h3>
            <p style={{
                color: "rgba(255,255,255,0.6)",
                lineHeight: 1.7,
                fontSize: "0.95rem",
                position: "relative",
                zIndex: 1,
            }}>
                {description}
            </p>
        </div>
    );
}

// Gradient Stats
function GradientStat({ value, label }) {
    return (
        <div style={{ textAlign: "center" }}>
            <div style={{
                fontSize: "clamp(2.5rem, 6vw, 4rem)",
                fontWeight: 900,
                background: "linear-gradient(135deg, #ff6b6b, #ffe66d, #4ecdc4)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                animation: "gradientPulse 5s ease infinite",
                fontFamily: "'Playfair Display', Georgia, serif",
            }}>
                {value}
            </div>
            <div style={{
                fontSize: "0.85rem",
                color: "rgba(255,255,255,0.5)",
                textTransform: "uppercase",
                letterSpacing: "3px",
                marginTop: "10px",
                fontWeight: 600,
            }}>
                {label}
            </div>
        </div>
    );
}

// Gradient CTA Button
function GradientButton({ children, href = "#" }) {
    const [hovered, setHovered] = useState(false);

    return (
        <a
            href={href}
            style={{
                display: "inline-block",
                padding: "18px 50px",
                background: "linear-gradient(135deg, #ff6b6b, #ffe66d)",
                color: "#0a0a0a",
                border: "none",
                borderRadius: "50px",
                fontFamily: "'Playfair Display', Georgia, serif",
                fontWeight: 700,
                fontSize: "1.1rem",
                textDecoration: "none",
                transition: "all 0.3s ease",
                boxShadow: hovered ? "0 20px 60px rgba(255, 107, 107, 0.5)" : "0 10px 40px rgba(255, 107, 107, 0.3)",
                transform: hovered ? "scale(1.05)" : "scale(1)",
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {children}
        </a>
    );
}

// ═══════════════════════════════════════════════════════════
// MAIN KINETIC TYPOGRAPHY HERO
// ═══════════════════════════════════════════════════════════
function KineticHero({ siteSettings = {} }) {
    useKineticStyles();

    // Get values from site settings or use defaults
    const heroTitle = siteSettings.heroTitle || "Master Computer Skills";
    const heroSubtitle = siteSettings.heroSubtitle || "100% Free, Forever";
    const heroCtaText = siteSettings.heroCtaText || "Start Learning";
    const statsStudents = siteSettings.statsStudentsCount || "40K+";
    const statsRating = siteSettings.statsRating || "4.7";
    const statsMonthly = siteSettings.statsMonthly || "150K+";

    const designLetters = ["D", "E", "S", "I", "G", "N"];
    const designColors = ["#ff6b6b", "#ffe66d", "#4ecdc4", "#fff", "#ffe66d", "#4ecdc4"];

    // Split hero title into words for kinetic display
    const titleWords = heroTitle.split(" ");
    const subtitleWords = heroSubtitle.split(" ");

    return (
        <section style={{
            minHeight: "100vh",
            background: "#0a0a0a",
            color: "#fff",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "60px 20px",
            position: "relative",
            overflow: "hidden",
        }}>
            {/* Main Title */}
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
                <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", marginBottom: "10px" }}>
                    {titleWords.slice(0, Math.ceil(titleWords.length / 2)).map((word, i) => (
                        <KineticWord key={i} text={word} color={i % 2 === 0 ? "#ff6b6b" : "#4ecdc4"} />
                    ))}
                </div>
                <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}>
                    {titleWords.slice(Math.ceil(titleWords.length / 2)).map((word, i) => (
                        <KineticWord key={i} text={word} color={i % 2 === 0 ? "#4ecdc4" : "#ffe66d"} />
                    ))}
                </div>
            </div>

            {/* DESIGN Letters - Jumpy Animation */}
            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-end",
                gap: "clamp(5px, 2vw, 20px)",
                margin: "40px 0",
                flexWrap: "wrap",
                height: "auto",
                minHeight: "clamp(5rem, 15vw, 12rem)",
            }}>
                {designLetters.map((letter, i) => (
                    <DesignLetter key={i} letter={letter} index={i} />
                ))}
            </div>

            {/* ANIMATE Wave Text - Subtitle */}
            <WaveText text={heroSubtitle} style={{ marginBottom: "50px" }} />

            {/* CTA Button */}
            <div style={{ marginBottom: "30px" }}>
                <GradientButton href="#course-grid">
                    {heroCtaText} →
                </GradientButton>
            </div>

            {/* Marquee */}
            <KineticMarquee />

            {/* Feature Cards */}
            <div
                id="features"
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                    gap: "30px",
                    maxWidth: "1200px",
                    width: "100%",
                    marginTop: "40px",
                    padding: "0 20px",
                }}
            >
                <FeatureCard
                    number="01"
                    title="Text Animation"
                    description="Transform static text into dynamic visual elements with CSS animations and transitions."
                />
                <FeatureCard
                    number="02"
                    title="Character Motion"
                    description="Individual letter animations that create mesmerizing wave and bounce effects."
                />
                <FeatureCard
                    number="03"
                    title="Scrolling Marquee"
                    description="Infinite scrolling text that adds continuous motion to any section."
                />
            </div>

            {/* Stats */}
            <div style={{
                display: "flex",
                justifyContent: "center",
                gap: "clamp(30px, 8vw, 80px)",
                marginTop: "80px",
                flexWrap: "wrap",
            }}>
                <GradientStat value={statsStudents} label="Students" />
                <GradientStat value={statsRating} label="Rating" />
                <GradientStat value={statsMonthly} label="Monthly" />
            </div>
        </section>
    );
}

// ═══════════════════════════════════════════════════════════
// EXISTING COMPONENTS (Categories, Courses, Reviews, etc.)
// ═══════════════════════════════════════════════════════════

const categories = [
    { icon: <IconComputer size={28} color="#4F46E5" />, iconBg: "#EEF2FF", borderColor: "#4F46E5", title: "Computer Course", subtitle: "Basic to Advanced learning" },
    { icon: <IconPdf size={28} color="#10B981" />, iconBg: "#ECFDF5", borderColor: "#10B981", title: "PDF Notes & Material", subtitle: "Downloadable study material" },
    { icon: <IconQuiz size={28} color="#F59E0B" />, iconBg: "#FFFBEB", borderColor: "#F59E0B", title: "Computer Quiz", subtitle: "Computer MCQ practice sets" },
    { icon: <IconBolt size={28} color="#F43F5E" />, iconBg: "#FFF1F2", borderColor: "#F43F5E", title: "Computer Tricks", subtitle: "Computer Tips, Tricks & shortcuts" },
];
const defaultReviews = [
    { name: "Abhijit Patgirri", initial: "A", rating: 5, text: "One of the best platforms to learn for free. Practical computer skills with strong quality." },
    { name: "Sakshi Kanojiya", initial: "S", rating: 5, text: "Very useful for students. Courses are full of practical knowledge and help with career growth." },
    { name: "Madhusudan Pal", initial: "M", rating: 5, text: "A true opportunity for students who cannot afford paid classes to build skills and confidence." },
];
const whyUs = [
    { icon: <IconFree size={22} color="#3b82f6" />, iconBg: "rgba(59,130,246,.12)", title: "100% Free", text: "Access courses and resources with no hidden costs." },
    { icon: <IconPdf size={22} color="#10b981" />, iconBg: "rgba(16,185,129,.12)", title: "PDF Notes", text: "Download concise notes for quick revision and exam prep." },
    { icon: <IconRocket size={22} color="#f59e0b" />, iconBg: "rgba(245,158,11,.14)", title: "No Login", text: "Start learning instantly—no account required." },
    { icon: <IconLock size={22} color="#8b5cf6" />, iconBg: "rgba(139,92,246,.12)", title: "Secure", text: "Privacy-first experience with reliable uptime." },
    { icon: <IconPhone size={22} color="#10b981" />, iconBg: "rgba(16,185,129,.12)", title: "Expert Support", text: "Reach us Mon–Sat via phone or message." },
    { icon: <IconTool size={22} color="#0ea5e9" />, iconBg: "rgba(14,165,233,.12)", title: "Project-based Practice", text: "Build real projects to strengthen skills and portfolio." },
];
const faqs = [
    { q: "WEBCOM kya hai?", a: "WEBCOM ek online platform hai jo students ko 100% Free Computer Courses provide karta hai." },
    { q: "Kya yahan sabhi courses sach mein free hain?", a: "Haan, yahan ke core computer courses bilkul free hain." },
    { q: "PDF Notes kaise download karein?", a: "Kisi bhi course ke notes section mein jaakar aap PDF ko directly download kar sakte hain." },
    { q: "Quiz mein kitne questions hote hain?", a: "Har quiz mein multiple choice questions hote hain jo aapki computer knowledge ko test karte hain." },
];

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
export default function LandingPageClient({ courses, reviews = [], googleReviewUrl = "https://www.google.com", siteSettings = {} }) {
    const { settings } = useSettings();
    const mergedSettings = { ...siteSettings, ...settings };
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
        <div style={{ perspective: "1200px", background: "#0a0a0a", color: "#fff" }}>
            <VisitTracker />

            {/* KINETIC TYPOGRAPHY HERO */}
            <KineticHero siteSettings={mergedSettings} />

            {/* CATEGORIES */}
            <Parallax3D>
                <section id="categories" className="py-14 md:py-16" style={{ background: "#111" }}>
                    <div className="mx-auto max-w-[1100px] px-[4vw]">
                        <Reveal>
                            <div className="text-center">
                                <h2 className="text-[2rem] font-semibold leading-tight" style={{ color: "#fff" }}>Explore Categories</h2>
                                <p className="mt-2 text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
                                    Computer Course • PDF Notes • Quiz • Computer Tricks
                                </p>
                            </div>
                        </Reveal>
                        <div className="mt-9 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {categories.map((c, i) => (
                                <Reveal key={c.title} delay={i * 80}>
                                    <Tilt3D intensity={7}>
                                        <div
                                            className="cursor-pointer rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1"
                                            style={{
                                                background: "rgba(255,255,255,0.05)",
                                                border: "1px solid rgba(255,255,255,0.1)",
                                                borderLeft: `4px solid ${c.borderColor}`,
                                            }}
                                        >
                                            <div
                                                className="inline-flex items-center justify-center rounded-xl p-3 mb-4"
                                                style={{ background: c.iconBg }}
                                            >
                                                {c.icon}
                                            </div>
                                            <h3 className="text-[1.1rem] font-semibold leading-tight" style={{ color: "#fff" }}>{c.title}</h3>
                                            <p className="mt-1 text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>{c.subtitle}</p>
                                        </div>
                                    </Tilt3D>
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </section>
            </Parallax3D>

            {/* COURSES */}
            <ScaleReveal>
                <section id="course-grid" className="py-10 md:py-14" style={{ background: "#0a0a0a" }}>
                    <div className="mx-auto max-w-[1100px] px-[4vw]">
                        <Reveal>
                            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest" style={{ color: "#ff6b6b" }}><IconGrad size={14} /> Free Computer Courses</p>
                            <h2 className="mt-1 text-2xl font-extrabold md:text-3xl" style={{ color: "#fff" }}>Basic to Advanced, job-ready skills</h2>
                        </Reveal>
                        <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                            {courses.map((course, i) => (
                                <Reveal key={course.id} delay={i * 60}>
                                    <article className="overflow-hidden rounded-xl transition-shadow hover:shadow-xl" style={{ border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)" }}>
                                        <div className="relative aspect-[16/9] w-full overflow-hidden" style={{ background: "linear-gradient(120deg, #1a1a2e, #16213e)" }}>
                                            {course.courseImage ? (
                                                <img src={course.courseImage} alt={`${course.title} banner`} className="h-full w-full object-cover" loading="lazy" />
                                            ) : (
                                                <div className="flex h-full w-full flex-col items-center justify-center">
                                                    <CategoryLogo category={course.courseType?.name || course.title} size={100} />
                                                    <p className="mt-2 text-center text-sm font-semibold uppercase leading-tight text-white px-4">{course.title}</p>
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-4">
                                            <div className="mb-2 flex items-center justify-between gap-2 text-[11px]">
                                                <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-semibold" style={{ background: "rgba(16,185,129,0.2)", color: "#10b981" }}>
                                                    {course.courseType?.name || "General"}
                                                </span>
                                                <span className="inline-flex items-center gap-1" style={{ color: "rgba(255,255,255,0.5)" }}><IconClock size={12} /> {course.duration}</span>
                                            </div>
                                            <h3 className="text-[1.12rem] font-semibold" style={{ color: "#fff" }}>{course.title}</h3>
                                            <div className="mt-1 flex items-center gap-0.5">
                                                {Array.from({ length: Math.round(Number(course.rating || 4.5)) }).map((_, starIndex) => (
                                                    <IconStar key={`${course.id}-star-${starIndex}`} size={13} color="#facc15" />
                                                ))}
                                                <span className="ml-1 text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>({Number(course.rating || 4.5).toFixed(1)})</span>
                                            </div>
                                            <div className="mt-2 flex items-center gap-2 text-sm">
                                                <span className="font-bold" style={{ color: "#fff" }}>₹ {toNum(course.offerPrice).toFixed(2)}</span>
                                                <span className="line-through" style={{ color: "rgba(255,255,255,0.4)" }}>₹ {toNum(course.originalPrice).toFixed(0)}</span>
                                                <span className="font-semibold" style={{ color: "#ef4444" }}>| {Number(course.discountPercent || 0).toFixed(0)}% OFF</span>
                                            </div>
                                            <Link href={`/courses/${course.slug}`} className="mt-3 inline-flex text-sm font-semibold hover:underline" style={{ color: "#4ecdc4" }}>
                                                View course details
                                            </Link>
                                        </div>
                                    </article>
                                </Reveal>
                            ))}
                            {courses.length === 0 && (
                                <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
                                    <div className="flex h-20 w-20 items-center justify-center rounded-full mb-5" style={{ background: "rgba(99,102,241,0.2)" }}>
                                        <IconBook size={36} color="#6366f1" />
                                    </div>
                                    <h3 className="text-xl font-bold" style={{ color: "#fff" }}>Courses Coming Soon</h3>
                                    <p className="mt-2 text-sm max-w-xs" style={{ color: "rgba(255,255,255,0.6)" }}>
                                        We are preparing amazing content for you. Check back soon!
                                    </p>
                                </div>
                            )}
                        </div>
                        <Reveal>
                            <div className="mt-6 flex justify-center">
                                <Link href="/courses" style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    padding: "12px 28px",
                                    background: "linear-gradient(135deg, #ff6b6b, #ffe66d)",
                                    color: "#0a0a0a",
                                    borderRadius: "50px",
                                    fontWeight: 700,
                                    textDecoration: "none",
                                    transition: "all 0.3s ease",
                                }}>
                                    View all courses
                                </Link>
                            </div>
                        </Reveal>
                    </div>
                </section>
            </ScaleReveal>

            {/* REVIEWS */}
            <Parallax3D>
                <section className="py-10 md:py-14" style={{ background: "#111" }}>
                    <div className="mx-auto max-w-[1100px] px-[4vw]">
                        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                            <Reveal>
                                <div>
                                    <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest" style={{ color: "#ffe66d" }}><IconMsg size={14} /> Student Reviews</p>
                                    <h3 className="mt-1 text-xl font-extrabold md:text-2xl" style={{ color: "#fff" }}>Real feedback from learners</h3>
                                    <p className="mt-1 flex items-center gap-1 text-sm" style={{ color: "rgba(255,255,255,0.6)" }}><IconStar size={14} /> {reviewCards.length} active reviews</p>
                                </div>
                            </Reveal>
                            <Reveal>
                                <a
                                    href={googleReviewUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition hover:scale-[1.02] active:scale-100"
                                    style={{ border: "1px solid rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.05)", color: "#fff" }}
                                >
                                    <IconStar size={14} /> Review us on Google ↗
                                </a>
                            </Reveal>
                        </div>

                        {/* Review Cards */}
                        <div className="mt-6 grid gap-5 md:grid-cols-3">
                            {reviewCards.slice(0, 3).map((review, i) => (
                                <Reveal key={review.name} delay={i * 80}>
                                    <div className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full font-bold" style={{ background: "linear-gradient(135deg, #ff6b6b, #ffe66d)", color: "#0a0a0a" }}>
                                                {review.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-semibold" style={{ color: "#fff" }}>{review.name}</p>
                                                <p className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>{review.role}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-0.5 mb-2">
                                            {Array.from({ length: review.rating }).map((_, si) => (
                                                <IconStar key={si} size={14} color="#f59e0b" />
                                            ))}
                                        </div>
                                        <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.7)" }}>{review.text}</p>
                                    </div>
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </section>
            </Parallax3D>

            {/* WHY US */}
            <ScaleReveal>
                <section className="py-12 md:py-20" style={{ background: "#0a0a0a" }}>
                    <div className="mx-auto max-w-[1100px] px-[4vw]">
                        <Reveal>
                            <div className="text-center">
                                <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#4ecdc4" }}>Why Choose Us</p>
                                <h2 className="mt-2 text-2xl font-extrabold md:text-3xl" style={{ color: "#fff" }}>Everything you need to succeed</h2>
                            </div>
                        </Reveal>
                        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {whyUs.map((item, i) => (
                                <Reveal key={item.title} delay={i * 60}>
                                    <div className="flex gap-4 rounded-xl p-4" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg" style={{ background: item.iconBg }}>
                                            {item.icon}
                                        </div>
                                        <div>
                                            <h4 className="font-semibold" style={{ color: "#fff" }}>{item.title}</h4>
                                            <p className="mt-0.5 text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>{item.text}</p>
                                        </div>
                                    </div>
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </section>
            </ScaleReveal>

            {/* CONTACT CTA */}
            <Parallax3D>
                <section className="py-10 md:py-14" style={{ background: "linear-gradient(180deg, #111 0%, #0a0a0a 100%)" }}>
                    <div className="mx-auto max-w-[800px] px-[4vw] text-center">
                        <Reveal>
                            <h2 className="text-2xl font-extrabold md:text-3xl" style={{ color: "#fff" }}>Still have questions?</h2>
                            <p className="mt-3" style={{ color: "rgba(255,255,255,0.6)" }}>Our team is here to help you get started on your learning journey.</p>
                            <a href="/contact" style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "8px",
                                marginTop: "24px",
                                padding: "12px 32px",
                                background: "linear-gradient(135deg, #ff6b6b, #ffe66d)",
                                color: "#0a0a0a",
                                borderRadius: "50px",
                                fontWeight: 700,
                                textDecoration: "none",
                                transition: "all 0.3s ease",
                            }}>
                                <IconMail size={16} /> Contact Us
                            </a>
                        </Reveal>
                    </div>
                </section>
            </Parallax3D>

            {/* FOOTER */}
            <footer className="py-8 text-center text-sm" style={{ background: "#0a0a0a", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                <p style={{ color: "rgba(255,255,255,0.4)" }}>
                    © 2026 WEBCOM. All Rights Reserved. Made with ❤️ in India
                </p>
            </footer>
        </div>
    );
}
