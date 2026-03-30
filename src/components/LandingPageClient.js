"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import VisitTracker from "@/components/VisitTracker";

const categories = [
    { emoji: "\ud83d\udcbb", title: "Computer Course", subtitle: "Basic to Advanced learning" },
    { emoji: "\ud83d\udcc4", title: "PDF Notes", subtitle: "Downloadable study material" },
    { emoji: "\ud83e\udde0", title: "Computer Quiz", subtitle: "Computer MCQ practice sets" },
    { emoji: "\u26a1", title: "Computer Tricks", subtitle: "Tips, tricks and shortcuts" },
];

const reviewItems = [
    { name: "Abhijit Patgirri", emoji: "\ud83d\ude0e", rating: 5, text: "One of the best platforms to learn for free. Practical computer skills with strong quality." },
    { name: "Sakshi Kanojiya", emoji: "\ud83d\udc69\u200d\ud83d\udcbb", rating: 5, text: "Very useful for students. Courses are full of practical knowledge and help with career growth." },
    { name: "Madhusudan Pal", emoji: "\ud83d\udcaa", rating: 5, text: "A true opportunity for students who cannot afford paid classes to build skills and confidence." },
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
    { q: "Kya courses sach mein free hain?", a: "Haan, core learning completely free hai." },
    { q: "Course ki language?", a: "Simple Hindi + English style, taki beginners bhi easily follow kar saken." },
];

const stats = [
    { emoji: "\ud83c\udf93", value: "40,25,000+", label: "Students" },
    { emoji: "\u2705", value: "Verified", label: "Platform" },
    { emoji: "\u2b50", value: "4.7 / 5", label: "Rating" },
    { emoji: "\ud83d\udcc8", value: "150k+", label: "Monthly" },
];

function splitLines(text) {
    return String(text || "").split("\n").map(l => l.trim()).filter(Boolean);
}

function RevealOnScroll({ children, className = "", delay = 0 }) {
    const ref = useRef(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setTimeout(() => el.classList.add("revealed"), delay);
                    observer.unobserve(el);
                }
            },
            { threshold: 0.1 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [delay]);

    return (
        <div ref={ref} className={`reveal-up ${className}`}>
            {children}
        </div>
    );
}

export default function LandingPageClient({ courses }) {
    return (
        <div className="landing-root">
            <VisitTracker />

            {/* HERO */}
            <section className="hero-section">
                <div className="hero-inner">
                    <div className="hero-content reveal-up revealed-instant">
                        <span className="hero-badge">{"\ud83c\udf1f"} 100% Free Learning Platform</span>
                        <h1 className="hero-title">
                            Learn 100% Free <span className="hero-highlight">Computer Courses</span>
                        </h1>
                        <p className="hero-desc">
                            Free online computer courses for everyone. Learn digital skills from basics to advanced and grow your career with practical, job-ready education.
                        </p>
                        <div className="hero-actions">
                            <a href="#course-grid" className="cta-primary">{"\ud83d\ude80"} Start Learning</a>
                            <a href="#categories" className="cta-outline">{"\ud83d\udcda"} Explore Categories</a>
                        </div>
                        <p className="hero-tags">
                            {"\ud83d\udcbb"} Computer Course &nbsp;|&nbsp; {"\ud83d\udcc4"} PDF Notes &nbsp;|&nbsp; {"\ud83e\udde0"} Quiz &nbsp;|&nbsp; {"\u26a1"} Tricks
                        </p>
                    </div>
                </div>
            </section>

            {/* CATEGORIES */}
            <section id="categories" className="section-pad">
                <div className="section-inner">
                    <RevealOnScroll>
                        <p className="section-tag">{"\ud83d\udcda"} Categories</p>
                        <h2 className="section-title">What do you want to learn?</h2>
                    </RevealOnScroll>
                    <div className="cat-grid">
                        {categories.map((c, i) => (
                            <RevealOnScroll key={c.title} delay={i * 60}>
                                <div className="cat-card">
                                    <span className="cat-emoji">{c.emoji}</span>
                                    <h3>{c.title}</h3>
                                    <p>{c.subtitle}</p>
                                </div>
                            </RevealOnScroll>
                        ))}
                    </div>
                </div>
            </section>

            {/* COURSES */}
            <section id="course-grid" className="section-pad section-alt">
                <div className="section-inner">
                    <RevealOnScroll>
                        <p className="section-tag">{"\ud83c\udf93"} Free Computer Courses</p>
                        <h2 className="section-title">Basic to Advanced, job-ready skills</h2>
                    </RevealOnScroll>
                    <div className="course-list">
                        {courses.map((course, i) => (
                            <RevealOnScroll key={course.id} delay={i * 50}>
                                <article className="course-card">
                                    <div className="course-badges">
                                        <span className="badge-green">{"\ud83c\udfaf"} {course.level}</span>
                                        <span className="badge-blue">{"\u23f0"} {course.duration}</span>
                                        <span className="badge-orange">{"\ud83d\udcf9"} {course.classType}</span>
                                    </div>
                                    <h3>{course.title}</h3>
                                    <p className="course-desc">{course.shortDescription}</p>
                                    <div className="course-highlights">
                                        <p className="hl-title">{"\ud83d\udcdd"} Course Highlights</p>
                                        <ul>
                                            {splitLines(course.syllabusTopics).slice(0, 4).map((item) => (
                                                <li key={`${course.id}-${item}`}>{item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="course-price">
                                        <span className="price-now">INR {course.offerPrice.toFixed(0)}</span>
                                        <span className="price-was">INR {course.originalPrice.toFixed(0)}</span>
                                        <span className="price-tag">{"\ud83c\udf89"} FREE</span>
                                    </div>
                                    <Link href={`/courses/${course.slug}`} className="course-link">
                                        View Details {"\u2192"}
                                    </Link>
                                </article>
                            </RevealOnScroll>
                        ))}
                        {courses.length === 0 && (
                            <div className="empty-courses">{"\ud83d\udce6"} No active courses yet. Add from admin panel.</div>
                        )}
                    </div>
                    <RevealOnScroll>
                        <Link href="/courses" className="view-all">View all courses {"\u2192"}</Link>
                    </RevealOnScroll>
                </div>
            </section>

            {/* STATS */}
            <section className="section-pad">
                <div className="section-inner">
                    <RevealOnScroll>
                        <div className="stats-box">
                            <p className="section-tag">{"\ud83c\udfc6"} Trusted by Students</p>
                            <h3 className="section-title">Real learners, real outcomes</h3>
                            <div className="stats-row">
                                {stats.map((s) => (
                                    <div key={s.label} className="stat-item">
                                        <span className="stat-icon">{s.emoji}</span>
                                        <p className="stat-num">{s.value}</p>
                                        <p className="stat-label">{s.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </RevealOnScroll>
                </div>
            </section>

            {/* REVIEWS */}
            <section className="section-pad section-alt">
                <div className="section-inner">
                    <RevealOnScroll>
                        <p className="section-tag">{"\ud83d\udcac"} Student Reviews</p>
                        <h3 className="section-title">Real feedback from learners</h3>
                    </RevealOnScroll>
                    <div className="review-grid">
                        {reviewItems.map((r, i) => (
                            <RevealOnScroll key={r.name} delay={i * 60}>
                                <div className="review-card">
                                    <div className="review-top">
                                        <span className="review-avatar">{r.emoji}</span>
                                        <div>
                                            <p className="review-name">{r.name}</p>
                                            <p className="review-role">Computer Course Student</p>
                                        </div>
                                    </div>
                                    <p className="review-stars">{"".padStart(r.rating, "\u2b50")}</p>
                                    <p className="review-text">{r.text}</p>
                                </div>
                            </RevealOnScroll>
                        ))}
                    </div>
                </div>
            </section>

            {/* WHY US */}
            <section className="section-pad">
                <div className="section-inner">
                    <div className="why-grid">
                        <RevealOnScroll>
                            <div>
                                <p className="section-tag">{"\u2728"} Why Choose Us</p>
                                <h3 className="section-title">Simple, secure, student-friendly</h3>
                            </div>
                        </RevealOnScroll>
                        <div className="why-list">
                            {whyUs.map((item, i) => (
                                <RevealOnScroll key={item.text} delay={i * 50}>
                                    <div className="why-item">
                                        <span className="why-emoji">{item.emoji}</span>
                                        <span>{item.text}</span>
                                    </div>
                                </RevealOnScroll>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="section-pad section-alt">
                <div className="section-inner">
                    <RevealOnScroll>
                        <p className="section-tag">{"\u2753"} FAQ</p>
                    </RevealOnScroll>
                    <div className="faq-list">
                        {faqs.map((f, i) => (
                            <RevealOnScroll key={f.q} delay={i * 60}>
                                <div className="faq-item">
                                    <h4>{f.q}</h4>
                                    <p>{f.a}</p>
                                </div>
                            </RevealOnScroll>
                        ))}
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="footer-section">
                <div className="section-inner footer-grid">
                    <div>
                        <h4 className="footer-brand">{"\ud83c\udf10"} LearnSphere</h4>
                        <p className="footer-sub">FOLLOW US</p>
                    </div>
                    <div>
                        <p className="footer-heading">Useful Links</p>
                        <ul className="footer-links">
                            <li>Courses</li><li>Notes</li><li>Quiz</li><li>Blogs</li>
                        </ul>
                    </div>
                    <div>
                        <p className="footer-heading">Important Links</p>
                        <ul className="footer-links">
                            <li>Privacy Policy</li><li>Contact Us</li><li>About Us</li>
                        </ul>
                    </div>
                </div>
                <p className="footer-copy">Copyright 2026 LearnSphere. All Rights Reserved.</p>
            </footer>

            <style jsx>{`
                .landing-root { background: #fff; color: #1e293b; }

                /* reveal animation - CSS only */
                .reveal-up {
                    opacity: 0;
                    transform: translateY(20px);
                    transition: opacity 0.45s ease, transform 0.45s ease;
                }
                .reveal-up.revealed, .revealed-instant { opacity: 1; transform: translateY(0); }

                /* hero */
                .hero-section {
                    background: linear-gradient(135deg, #fff7ed 0%, #fef3c7 50%, #ecfdf5 100%);
                    border-bottom: 1px solid #e2e8f0;
                }
                .hero-inner { max-width: 1100px; margin: 0 auto; padding: 4.5rem 4vw 4rem; }
                .hero-content { max-width: 700px; }
                .hero-badge {
                    display: inline-block;
                    background: #ecfdf5;
                    border: 1px solid #a7f3d0;
                    color: #065f46;
                    padding: 0.3rem 0.8rem;
                    border-radius: 999px;
                    font-size: 0.75rem;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.08em;
                }
                .hero-title { font-size: clamp(2rem, 5vw, 3.2rem); margin-top: 1rem; line-height: 1.15; font-weight: 900; }
                .hero-highlight { color: #ea580c; }
                .hero-desc { margin-top: 1rem; color: #475569; line-height: 1.7; font-size: 1.05rem; }
                .hero-actions { display: flex; flex-wrap: wrap; gap: 0.7rem; margin-top: 1.5rem; }
                .cta-primary {
                    display: inline-flex; align-items: center; gap: 0.4rem;
                    background: linear-gradient(135deg, #f97316, #ea580c);
                    color: #fff; padding: 0.7rem 1.5rem; border-radius: 999px;
                    font-weight: 700; font-size: 0.9rem; text-decoration: none;
                    box-shadow: 0 4px 14px rgba(249,115,22,0.25);
                    transition: transform 0.15s, box-shadow 0.15s;
                }
                .cta-primary:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(249,115,22,0.3); }
                .cta-outline {
                    display: inline-flex; align-items: center; gap: 0.4rem;
                    border: 1px solid #e2e8f0; padding: 0.7rem 1.5rem; border-radius: 999px;
                    font-weight: 600; font-size: 0.9rem; text-decoration: none; color: #475569;
                    transition: all 0.15s;
                }
                .cta-outline:hover { border-color: #f97316; color: #ea580c; }
                .hero-tags { margin-top: 1.5rem; color: #94a3b8; font-size: 0.85rem; }

                /* sections */
                .section-pad { padding: 3.5rem 4vw; }
                .section-alt { background: #f8fafc; }
                .section-inner { max-width: 1100px; margin: 0 auto; }
                .section-tag { font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.12em; color: #ea580c; font-weight: 600; }
                .section-title { font-size: 1.7rem; font-weight: 800; margin-top: 0.4rem; }

                /* categories */
                .cat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-top: 1.5rem; }
                .cat-card {
                    background: #fff; border: 1px solid #e2e8f0; border-radius: 1rem; padding: 1.3rem;
                    transition: all 0.2s; cursor: pointer;
                }
                .cat-card:hover { border-color: #f97316; transform: translateY(-3px); box-shadow: 0 6px 20px rgba(0,0,0,0.06); }
                .cat-emoji { font-size: 2rem; }
                .cat-card h3 { font-size: 1rem; margin-top: 0.6rem; font-weight: 700; }
                .cat-card p { font-size: 0.85rem; color: #64748b; margin-top: 0.25rem; }

                /* courses */
                .course-list { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.2rem; margin-top: 1.5rem; }
                .course-card {
                    background: #fff; border: 1px solid #e2e8f0; border-radius: 1rem; padding: 1.3rem;
                    transition: all 0.2s;
                }
                .course-card:hover { border-color: #f97316; box-shadow: 0 6px 20px rgba(0,0,0,0.06); }
                .course-badges { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 0.7rem; }
                .badge-green { background: #ecfdf5; border: 1px solid #a7f3d0; color: #065f46; padding: 0.15rem 0.5rem; border-radius: 999px; font-size: 0.72rem; font-weight: 600; }
                .badge-blue { background: #eff6ff; border: 1px solid #bfdbfe; color: #1e40af; padding: 0.15rem 0.5rem; border-radius: 999px; font-size: 0.72rem; font-weight: 600; }
                .badge-orange { background: #fff7ed; border: 1px solid #fed7aa; color: #c2410c; padding: 0.15rem 0.5rem; border-radius: 999px; font-size: 0.72rem; font-weight: 600; }
                .course-card h3 { font-size: 1.15rem; font-weight: 700; }
                .course-desc { font-size: 0.88rem; color: #64748b; margin-top: 0.4rem; line-height: 1.6; }
                .course-highlights { margin-top: 0.8rem; }
                .hl-title { font-size: 0.82rem; font-weight: 700; color: #059669; }
                .course-highlights ul { list-style: none; padding: 0; margin-top: 0.3rem; }
                .course-highlights li { font-size: 0.84rem; color: #64748b; padding: 0.15rem 0; }
                .course-highlights li::before { content: "\u2022 "; color: #f97316; }
                .course-price { display: flex; align-items: center; gap: 0.6rem; flex-wrap: wrap; margin-top: 1rem; }
                .price-now { font-size: 1.15rem; font-weight: 800; color: #16a34a; }
                .price-was { font-size: 0.88rem; text-decoration: line-through; color: #94a3b8; }
                .price-tag {
                    background: linear-gradient(135deg, #f97316, #ea580c); color: #fff;
                    padding: 0.15rem 0.6rem; border-radius: 999px; font-size: 0.72rem; font-weight: 700;
                }
                .course-link {
                    display: inline-flex; margin-top: 1rem; border: 1px solid #e2e8f0;
                    padding: 0.5rem 1.2rem; border-radius: 999px; font-size: 0.85rem; font-weight: 600;
                    text-decoration: none; color: #ea580c; transition: all 0.15s;
                }
                .course-link:hover { background: #fff7ed; border-color: #f97316; }
                .empty-courses { grid-column: 1/-1; text-align: center; padding: 2rem; color: #94a3b8; border: 1px dashed #e2e8f0; border-radius: 1rem; }
                .view-all { display: inline-block; margin-top: 1.5rem; font-size: 0.9rem; font-weight: 600; color: #ea580c; text-decoration: none; }
                .view-all:hover { text-decoration: underline; }

                /* stats */
                .stats-box { background: linear-gradient(135deg, #fff7ed, #fef3c7); border: 1px solid #fed7aa; border-radius: 1.2rem; padding: 2rem; }
                .stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-top: 1.5rem; }
                .stat-item { text-align: center; background: #fff; border: 1px solid #e2e8f0; border-radius: 0.8rem; padding: 1rem; }
                .stat-icon { font-size: 1.8rem; }
                .stat-num { font-size: 1.3rem; font-weight: 800; color: #ea580c; margin-top: 0.2rem; }
                .stat-label { font-size: 0.78rem; color: #64748b; }

                /* reviews */
                .review-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-top: 1.5rem; }
                .review-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 1rem; padding: 1.2rem; transition: all 0.2s; }
                .review-card:hover { border-color: #f97316; transform: translateY(-2px); box-shadow: 0 4px 14px rgba(0,0,0,0.05); }
                .review-top { display: flex; align-items: center; gap: 0.7rem; }
                .review-avatar { font-size: 1.8rem; }
                .review-name { font-weight: 700; font-size: 0.9rem; }
                .review-role { font-size: 0.75rem; color: #94a3b8; }
                .review-stars { margin: 0.5rem 0 0.3rem; font-size: 0.85rem; }
                .review-text { font-size: 0.85rem; color: #64748b; line-height: 1.6; }

                /* why us */
                .why-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
                .why-list { display: grid; gap: 0.6rem; }
                .why-item {
                    display: flex; align-items: center; gap: 0.7rem;
                    background: #fff; border: 1px solid #e2e8f0; border-radius: 0.7rem;
                    padding: 0.8rem 1rem; font-size: 0.9rem; transition: all 0.15s; cursor: pointer;
                }
                .why-item:hover { border-color: #f97316; transform: translateX(4px); }
                .why-emoji { font-size: 1.3rem; }

                /* faq */
                .faq-list { display: grid; gap: 0.7rem; margin-top: 1rem; }
                .faq-item {
                    background: #fff; border: 1px solid #e2e8f0; border-radius: 0.8rem; padding: 1rem;
                    transition: all 0.15s;
                }
                .faq-item:hover { border-color: #f97316; }
                .faq-item h4 { font-size: 0.95rem; font-weight: 700; color: #1e293b; }
                .faq-item p { font-size: 0.85rem; color: #64748b; margin-top: 0.3rem; }

                /* footer */
                .footer-section { background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 2.5rem 4vw 1.5rem; }
                .footer-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; }
                .footer-brand { font-size: 1.15rem; font-weight: 700; color: #ea580c; }
                .footer-sub { font-size: 0.8rem; color: #94a3b8; margin-top: 0.3rem; }
                .footer-heading { font-size: 0.82rem; font-weight: 700; text-transform: uppercase; color: #475569; letter-spacing: 0.05em; }
                .footer-links { list-style: none; padding: 0; margin-top: 0.4rem; }
                .footer-links li { font-size: 0.85rem; color: #64748b; padding: 0.2rem 0; cursor: pointer; transition: color 0.15s; }
                .footer-links li:hover { color: #ea580c; }
                .footer-copy { text-align: center; font-size: 0.75rem; color: #94a3b8; margin-top: 2rem; }

                @media (max-width: 768px) {
                    .cat-grid { grid-template-columns: repeat(2, 1fr); }
                    .course-list { grid-template-columns: 1fr; }
                    .stats-row { grid-template-columns: repeat(2, 1fr); }
                    .review-grid { grid-template-columns: 1fr; }
                    .why-grid { grid-template-columns: 1fr; }
                    .footer-grid { grid-template-columns: 1fr; }
                    .hero-title { font-size: 1.8rem; }
                }
            `}</style>
        </div>
    );
}
