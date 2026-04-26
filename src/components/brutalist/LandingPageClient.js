"use client";

import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";
import CourseCard from "./CourseCard";
import FAQSection from "./FAQSection";
import WhyChooseUs from "./WhyChooseUs";
import ReviewMarquee from "./ReviewMarquee";
import TrustedByStats from "./TrustedByStats";
import Footer from "./Footer";
import { IconGrad, IconBook, IconStar, IconArrowRight, IconBolt } from "@/components/Icons";

function useKineticStyles() {
    useEffect(() => {
        const styleId = "brutal-kinetic";
        if (document.getElementById(styleId)) return;

        const style = document.createElement("style");
        style.id = styleId;
        style.textContent = `
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
            @keyframes marqueeScroll {
                0% { transform: translateX(0); }
                100% { transform: translateX(-50%); }
            }
        `;
        document.head.appendChild(style);
        return () => {
            const el = document.getElementById(styleId);
            if (el) el.remove();
        };
    }, []);
}

function DesignLetter({ letter }) {
    const letterStyles = {
        "D": { color: "#ff6b6b", animation: "dJump 2.5s ease-in-out 0s infinite" },
        "E": { color: "#ffe66d", animation: "eJump 2.8s ease-in-out 0.2s infinite" },
        "S": { color: "#4ecdc4", animation: "sJump 3s ease-in-out 0.1s infinite" },
        "I": { color: "#ff6b6b", animation: "iJump 2.2s ease-in-out 0.3s infinite" },
        "G": { color: "#ffe66d", animation: "gJump 2.6s ease-in-out 0.15s infinite" },
        "N": { color: "#ffffff", animation: "nJump 2.4s ease-in-out 0.25s infinite" },
    };

    const style = letterStyles[letter] || letterStyles["D"];

    return (
        <span
            style={{
                display: "inline-block",
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "clamp(3rem, 12vw, 9rem)",
                fontWeight: 900,
                color: style.color,
                animation: style.animation,
                textShadow: `0 0 50px ${style.color}50`,
                margin: "0 -3px",
                lineHeight: 1,
            }}
        >
            {letter}
        </span>
    );
}

function BrutalHero({ siteSettings = {} }) {
    useKineticStyles();

    const heroTitle = siteSettings.heroTitle || "Master Computer Skills";
    const heroSubtitle = siteSettings.heroSubtitle || "100% Free, Forever";
    const heroCtaText = siteSettings.heroCtaText || "Start Learning";
    const designLetters = ["D", "E", "S", "I", "G", "N"];

    return (
        <section style={{
            minHeight: "90vh",
            background: "#0a0a0a",
            color: "#fff",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "60px 20px",
            position: "relative",
            overflow: "hidden",
            borderBottom: "4px solid #ffd400",
        }}>
            <div style={{ textAlign: "center", marginBottom: "40px", maxWidth: "900px" }}>
                <h1 style={{
                    fontSize: "clamp(2.5rem, 8vw, 6rem)",
                    fontWeight: 900,
                    textTransform: "uppercase",
                    letterSpacing: "-0.04em",
                    lineHeight: 1.05,
                    margin: "0 0 1rem",
                }}>
                    {heroTitle}
                </h1>
                <p style={{
                    fontSize: "clamp(1rem, 3vw, 1.4rem)",
                    opacity: 0.7,
                    margin: 0,
                }}>
                    {heroSubtitle}
                </p>
            </div>

            <div style={{
                display: "flex",
                justifyContent: "center",
                gap: "clamp(3px, 1.5vw, 15px)",
                margin: "30px 0",
                flexWrap: "wrap",
            }}>
                {designLetters.map((letter) => (
                    <DesignLetter key={letter} letter={letter} />
                ))}
            </div>

            <Link
                href="/courses"
                style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "18px 40px",
                    background: "#ffd400",
                    color: "#000",
                    borderRadius: "16px",
                    fontWeight: 900,
                    fontSize: "1.1rem",
                    textDecoration: "none",
                    border: "4px solid #000",
                    boxShadow: "8px 8px 0 #000",
                    transition: "all 0.2s ease",
                    marginTop: "20px",
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translate(-4px, -4px)";
                    e.currentTarget.style.boxShadow = "12px 12px 0 #000";
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translate(0, 0)";
                    e.currentTarget.style.boxShadow = "8px 8px 0 #000";
                }}
            >
                {heroCtaText}
                <IconArrowRight size={22} />
            </Link>

            <div style={{
                display: "flex",
                justifyContent: "center",
                gap: "clamp(20px, 5vw, 60px)",
                marginTop: "60px",
                flexWrap: "wrap",
            }}>
                <div style={{ textAlign: "center" }}>
                    <div style={{
                        fontSize: "clamp(2rem, 6vw, 3.5rem)",
                        fontWeight: 900,
                        color: "#ffd400",
                    }}>
                        {siteSettings.statsStudentsCount || "40K+"}
                    </div>
                    <div style={{
                        fontSize: "0.8rem",
                        textTransform: "uppercase",
                        letterSpacing: "2px",
                        opacity: 0.6,
                        marginTop: "4px",
                    }}>
                        Students
                    </div>
                </div>
                <div style={{ textAlign: "center" }}>
                    <div style={{
                        fontSize: "clamp(2rem, 6vw, 3.5rem)",
                        fontWeight: 900,
                        color: "#ffd400",
                    }}>
                        {siteSettings.statsRating || "4.7"} ★
                    </div>
                    <div style={{
                        fontSize: "0.8rem",
                        textTransform: "uppercase",
                        letterSpacing: "2px",
                        opacity: 0.6,
                        marginTop: "4px",
                    }}>
                        Rating
                    </div>
                </div>
                <div style={{ textAlign: "center" }}>
                    <div style={{
                        fontSize: "clamp(2rem, 6vw, 3.5rem)",
                        fontWeight: 900,
                        color: "#ffd400",
                    }}>
                        {siteSettings.statsMonthly || "150K+"}
                    </div>
                    <div style={{
                        fontSize: "0.8rem",
                        textTransform: "uppercase",
                        letterSpacing: "2px",
                        opacity: 0.6,
                        marginTop: "4px",
                    }}>
                        Monthly Views
                    </div>
                </div>
            </div>

            <div style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                overflow: "hidden",
                borderTop: "3px solid #ffd400",
                padding: "10px 0",
                background: "#111",
            }}>
                <div style={{
                    display: "flex",
                    animation: "marqueeScroll 20s linear infinite",
                    whiteSpace: "nowrap",
                }}>
                    {["100% FREE", "NO LOGIN REQUIRED", "PDF NOTES", "QUIZZES", "EXPERT SUPPORT", "VERIFIED COURSES", "100% FREE", "NO LOGIN REQUIRED", "PDF NOTES", "QUIZZES", "EXPERT SUPPORT", "VERIFIED COURSES"].map((text, i) => (
                        <span key={i} style={{
                            padding: "0 30px",
                            fontWeight: 800,
                            fontSize: "0.85rem",
                            textTransform: "uppercase",
                            letterSpacing: "2px",
                            color: "rgba(255,255,255,0.5)",
                        }}>
                            {text} ✦
                        </span>
                    ))}
                </div>
            </div>
        </section>
    );
}

function CategoriesSection({ courseTypes = [] }) {
    const categories = [
        { icon: "💻", title: "Computer Course", subtitle: "Basic to Advanced", color: "#6366f1", href: "/courses" },
        { icon: "📄", title: "PDF Notes", subtitle: "Download & Study", color: "#10b981", href: "/study-materials" },
        { icon: "📝", title: "Quiz", subtitle: "Practice Tests", color: "#f59e0b", href: "/quiz" },
        { icon: "📚", title: "Study Materials", subtitle: "Full Resources", color: "#8b5cf6", href: "/study-materials" },
    ];

    return (
        <section style={{
            padding: "4rem 0",
            background: "#fff",
            borderBottom: "4px solid #000",
        }}>
            <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 1.5rem" }}>
                <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                    <h2 style={{
                        fontSize: "clamp(2rem, 5vw, 3rem)",
                        fontWeight: 900,
                        textTransform: "uppercase",
                        letterSpacing: "-0.02em",
                        margin: "0 0 0.5rem",
                    }}>
                        Explore Categories
                    </h2>
                    <p style={{ opacity: 0.7, margin: 0 }}>
                        Computer Course • PDF Notes • Study Materials • Quiz
                    </p>
                </div>

                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                    gap: "1.5rem",
                }}>
                    {categories.map((cat, i) => (
                        <Link
                            key={i}
                            href={cat.href}
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                padding: "2rem 1.5rem",
                                background: "#fff",
                                border: "4px solid #000",
                                borderRadius: "24px",
                                boxShadow: "8px 8px 0 #000",
                                textDecoration: "none",
                                color: "#000",
                                transition: "all 0.2s ease",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = "translate(-4px, -4px)";
                                e.currentTarget.style.boxShadow = "12px 12px 0 #000";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "translate(0, 0)";
                                e.currentTarget.style.boxShadow = "8px 8px 0 #000";
                            }}
                        >
                            <div style={{
                                width: "60px",
                                height: "60px",
                                background: cat.color,
                                borderRadius: "16px",
                                border: "3px solid #000",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "1.8rem",
                                marginBottom: "1rem",
                            }}>
                                {cat.icon}
                            </div>
                            <h3 style={{
                                fontSize: "1.1rem",
                                fontWeight: 800,
                                margin: "0 0 0.25rem",
                                textAlign: "center",
                            }}>
                                {cat.title}
                            </h3>
                            <p style={{
                                fontSize: "0.85rem",
                                opacity: 0.7,
                                margin: 0,
                            }}>
                                {cat.subtitle}
                            </p>
                        </Link>
                    ))}
                </div>

                <div style={{ textAlign: "center", marginTop: "2rem" }}>
                    <Link
                        href="/categories"
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "8px",
                            padding: "0.75rem 1.5rem",
                            background: "#000",
                            color: "#ffd400",
                            borderRadius: "12px",
                            fontWeight: 700,
                            textDecoration: "none",
                            border: "3px solid #000",
                            boxShadow: "4px 4px 0 #ffd400",
                        }}
                    >
                        View All Categories
                        <IconArrowRight size={18} />
                    </Link>
                </div>
            </div>
        </section>
    );
}

function CoursesSection({ courses = [] }) {
    return (
        <section style={{
            padding: "4rem 0",
            background: "#f8f9fc",
            borderBottom: "4px solid #000",
        }}>
            <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 1.5rem" }}>
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "2rem",
                    flexWrap: "wrap",
                    gap: "1rem",
                }}>
                    <div>
                        <p style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            fontSize: "0.8rem",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "2px",
                            color: "#6366f1",
                            margin: "0 0 0.5rem",
                        }}>
                            <IconGrad size={14} /> Free Computer Courses
                        </p>
                        <h2 style={{
                            fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
                            fontWeight: 900,
                            textTransform: "uppercase",
                            margin: 0,
                        }}>
                            Basic to Advanced
                        </h2>
                    </div>
                </div>

                {courses.length > 0 ? (
                    <>
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                            gap: "1.5rem",
                        }}>
                            {courses.slice(0, 6).map((course) => (
                                <CourseCard key={course.id} course={course} />
                            ))}
                        </div>

                        {courses.length > 6 && (
                            <div style={{ textAlign: "center", marginTop: "2rem" }}>
                                <Link
                                    href="/courses"
                                    style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: "8px",
                                        padding: "1rem 2rem",
                                        background: "#ffd400",
                                        color: "#000",
                                        borderRadius: "16px",
                                        fontWeight: 900,
                                        fontSize: "1rem",
                                        textDecoration: "none",
                                        border: "4px solid #000",
                                        boxShadow: "6px 6px 0 #000",
                                        transition: "all 0.2s ease",
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = "translate(-3px, -3px)";
                                        e.currentTarget.style.boxShadow = "9px 9px 0 #000";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = "translate(0, 0)";
                                        e.currentTarget.style.boxShadow = "6px 6px 0 #000";
                                    }}
                                >
                                    View All Courses
                                    <IconArrowRight size={20} />
                                </Link>
                            </div>
                        )}
                    </>
                ) : (
                    <div style={{
                        textAlign: "center",
                        padding: "4rem",
                        background: "#fff",
                        borderRadius: "20px",
                        border: "4px solid #000",
                    }}>
                        <p style={{ fontSize: "1.2rem", fontWeight: 700, margin: "0 0 0.5rem" }}>
                            Courses Coming Soon
                        </p>
                        <p style={{ opacity: 0.7, margin: 0 }}>
                            We are preparing amazing content for you!
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}

export default function BrutalLandingPage({ courses = [], reviews = [], siteSettings = {} }) {
    const mergedSettings = { ...siteSettings };

    return (
        <main style={{ background: "#fff", color: "#000" }}>
            <BrutalHero siteSettings={mergedSettings} />

            <CategoriesSection />

            <CoursesSection courses={courses} />

            <TrustedByStats siteSettings={mergedSettings} />

            <ReviewMarquee reviews={reviews} />

            <WhyChooseUs />

            <FAQSection />

            <section style={{
                padding: "4rem 0",
                background: "#000",
                color: "#fff",
                textAlign: "center",
            }}>
                <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 1.5rem" }}>
                    <h2 style={{
                        fontSize: "clamp(2rem, 5vw, 3rem)",
                        fontWeight: 900,
                        marginBottom: "1rem",
                    }}>
                        Still Have Questions?
                    </h2>
                    <p style={{ opacity: 0.7, marginBottom: "2rem" }}>
                        Our team is here to help you get started on your learning journey.
                    </p>
                    <Link
                        href="/contact"
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "8px",
                            padding: "1rem 2rem",
                            background: "#ffd400",
                            color: "#000",
                            borderRadius: "16px",
                            fontWeight: 900,
                            fontSize: "1rem",
                            textDecoration: "none",
                            border: "4px solid #000",
                            boxShadow: "6px 6px 0 #000",
                        }}
                    >
                        Contact Us
                    </Link>
                </div>
            </section>

            <Footer siteSettings={mergedSettings} />
        </main>
    );
}
