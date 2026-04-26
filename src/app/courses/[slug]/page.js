import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { IconClock, IconStar, IconCheck, IconDownload, IconMail } from "@/components/Icons";

export const dynamic = "force-dynamic";

function splitLines(text) {
    return String(text || "")
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);
}

export default async function CourseDetailsPage({ params }) {
    const { slug } = await params;

    const isUrlIdFormat = /^[A-Z0-9]{5}$/i.test(slug);

    let course;
    if (isUrlIdFormat) {
        course = await prisma.course.findFirst({
            where: {
                courseUrlId: slug.toUpperCase(),
                isActive: true,
            },
            include: {
                courseType: true,
                driveFolders: {
                    select: { id: true },
                },
            },
        });
    }

    if (!course) {
        course = await prisma.course.findUnique({
            where: {
                slug,
                isActive: true,
            },
            include: {
                courseType: true,
                driveFolders: {
                    select: { id: true },
                },
            },
        });
    }

    if (!course) {
        notFound();
    }

    if (course.courseUrlId && slug === course.slug) {
        redirect(`/courses/${course.courseUrlId}`);
    }

    const normalizedCourse = {
        ...course,
        rating: Number(course.rating || 4.5),
        discountPercent: Number(course.discountPercent || 0),
        originalPrice: Number(course.originalPrice || 0),
        offerPrice: Number(course.offerPrice || 0),
    };

    const topics = splitLines(normalizedCourse.syllabusTopics);
    const whoCanJoin = splitLines(normalizedCourse.whoCanJoin);
    const studyPlan = splitLines(normalizedCourse.studyPlan);
    const jobsAfter = splitLines(normalizedCourse.jobsAfter);
    const notesHref = `/courses/${course.slug}/notes`;

    return (
        <div className="min-h-screen" style={{ background: "#f8f9fc" }}>
            <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 1.5rem" }}>
                <nav style={{ padding: "1rem 0", display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", color: "#64748b" }}>
                    <Link href="/" style={{ color: "#64748b", textDecoration: "none" }}>Home</Link>
                    <span>/</span>
                    <Link href="/courses" style={{ color: "#64748b", textDecoration: "none" }}>Courses</Link>
                    <span>/</span>
                    <span style={{ color: "#0f172a" }}>{normalizedCourse.title}</span>
                </nav>
            </div>

            <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 1.5rem 3rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "2rem", alignItems: "start" }} className="course-detail-grid">

                    <aside style={{ order: 1 }} className="course-sidebar">
                        <div style={{
                            background: "#fff",
                            border: "4px solid #000",
                            borderRadius: "20px",
                            overflow: "hidden",
                            boxShadow: "8px 8px 0 #000",
                            position: "sticky",
                            top: "80px",
                        }}>
                            <div style={{ aspectRatio: "16/9", background: "linear-gradient(135deg, #1a1a2e, #16213e)", position: "relative" }}>
                                {normalizedCourse.courseImage ? (
                                    <img
                                        src={normalizedCourse.courseImage}
                                        alt={`${normalizedCourse.title} banner`}
                                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                        loading="eager"
                                    />
                                ) : (
                                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "3rem", color: "#ffd400" }}>
                                        📚
                                    </div>
                                )}
                                <div style={{ position: "absolute", top: "12px", left: "12px" }}>
                                    <span style={{
                                        background: normalizedCourse.courseType?.color || "#10b981",
                                        color: "#fff",
                                        padding: "0.3rem 0.8rem",
                                        borderRadius: "999px",
                                        fontSize: "0.75rem",
                                        fontWeight: 700,
                                        border: "2px solid #000",
                                    }}>
                                        {normalizedCourse.courseType?.name || "General"}
                                    </span>
                                </div>
                            </div>

                            <div style={{ padding: "1.5rem" }}>
                                <div style={{ marginBottom: "1rem" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                                        <span style={{ fontWeight: 800, fontSize: "2rem", color: "#10b981" }}>₹{normalizedCourse.offerPrice.toFixed(0)}</span>
                                        {normalizedCourse.originalPrice > normalizedCourse.offerPrice && (
                                            <>
                                                <span style={{ fontSize: "1rem", textDecoration: "line-through", color: "#94a3b8" }}>₹{normalizedCourse.originalPrice.toFixed(0)}</span>
                                                <span style={{ background: "#ef4444", color: "#fff", padding: "0.2rem 0.5rem", borderRadius: "6px", fontSize: "0.7rem", fontWeight: 700 }}>
                                                    {normalizedCourse.discountPercent.toFixed(0)}% OFF
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <Link
                                    href={`https://wa.me/91${normalizedCourse.whatsappNumber?.replace(/\D/g, '') || '9999999999'}?text=${encodeURIComponent(`Hi, I want to enroll in ${normalizedCourse.title}`)}`}
                                    target="_blank"
                                    style={{
                                        display: "block",
                                        width: "100%",
                                        padding: "1rem",
                                        background: "#10b981",
                                        color: "#fff",
                                        borderRadius: "16px",
                                        fontWeight: 800,
                                        fontSize: "1.1rem",
                                        textAlign: "center",
                                        textDecoration: "none",
                                        border: "4px solid #000",
                                        boxShadow: "4px 4px 0 #000",
                                        marginBottom: "0.75rem",
                                    }}
                                >
                                    Start Learning 🚀
                                </Link>

                                <Link
                                    href={notesHref}
                                    style={{
                                        display: "block",
                                        width: "100%",
                                        padding: "0.75rem",
                                        background: "#fff",
                                        color: "#0084D1",
                                        borderRadius: "12px",
                                        fontWeight: 700,
                                        textAlign: "center",
                                        textDecoration: "none",
                                        border: "3px solid #0084D1",
                                        marginBottom: "1rem",
                                    }}
                                >
                                    📄 View PDF Notes
                                </Link>

                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", padding: "1rem", background: "#f8f9fc", borderRadius: "12px", border: "2px solid #e2e8f0" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                        <IconClock size={16} color="#64748b" />
                                        <span style={{ fontSize: "0.8rem", color: "#475569" }}>{normalizedCourse.duration}</span>
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                        <IconStar size={16} color="#f59e0b" />
                                        <span style={{ fontSize: "0.8rem", color: "#475569" }}>{normalizedCourse.rating.toFixed(1)} Rating</span>
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                        <span style={{ fontSize: "0.8rem", color: "#475569" }}>🎯 {normalizedCourse.level}</span>
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                        <span style={{ fontSize: "0.8rem", color: "#475569" }}>🎬 {normalizedCourse.classType}</span>
                                    </div>
                                </div>

                                <div style={{ marginTop: "1rem", padding: "1rem", background: "#f0f9ff", borderRadius: "12px", border: "2px solid #0084D1" }}>
                                    <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "#0084D1", marginBottom: "0.5rem", textTransform: "uppercase" }}>This Course Includes</p>
                                    <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                                        <li style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", color: "#475569" }}>
                                            <IconCheck size={14} color="#10b981" /> {normalizedCourse.liveQna}
                                        </li>
                                        <li style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", color: "#475569" }}>
                                            <IconDownload size={14} color="#10b981" /> {normalizedCourse.pdfNotes}
                                        </li>
                                        <li style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", color: "#475569" }}>
                                            <IconMail size={14} color="#10b981" /> {normalizedCourse.callSupport}
                                        </li>
                                        <li style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", color: "#475569" }}>
                                            <IconCheck size={14} color="#10b981" /> {normalizedCourse.lifetimeAccess ? "Lifetime Access" : "Limited Access"}
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </aside>

                    <main style={{ order: 2 }} className="course-main">
                        <div style={{ marginBottom: "2rem" }}>
                            <h1 style={{
                                fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
                                fontWeight: 800,
                                color: "#0f172a",
                                lineHeight: 1.2,
                                marginBottom: "0.75rem",
                            }}>
                                {normalizedCourse.title}
                            </h1>
                            <p style={{ fontSize: "1rem", color: "#475569", lineHeight: 1.6 }}>
                                {normalizedCourse.whatIs}
                            </p>
                        </div>

                        <div style={{
                            background: "linear-gradient(135deg, #f0f9ff, #f5f3ff)",
                            border: "3px solid #e2e8f0",
                            borderRadius: "20px",
                            padding: "1.5rem",
                            marginBottom: "2rem",
                        }}>
                            <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#0f172a", marginBottom: "1rem" }}>
                                What You'll Learn ✓
                            </h2>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "0.75rem" }}>
                                {topics.slice(0, 8).map((item, idx) => (
                                    <div key={idx} style={{
                                        display: "flex",
                                        alignItems: "flex-start",
                                        gap: "0.75rem",
                                        padding: "0.75rem",
                                        background: "#fff",
                                        borderRadius: "12px",
                                        border: "2px solid #e2e8f0",
                                    }}>
                                        <span style={{ color: "#10b981", fontWeight: 900, fontSize: "1.2rem", flexShrink: 0 }}>✓</span>
                                        <span style={{ color: "#475569", fontSize: "0.9rem" }}>{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div style={{
                            background: "#fff",
                            border: "4px solid #000",
                            borderRadius: "20px",
                            overflow: "hidden",
                            boxShadow: "6px 6px 0 #000",
                            marginBottom: "2rem",
                        }}>
                            <div style={{ background: "#0084D1", padding: "1rem 1.5rem", borderBottom: "3px solid #000" }}>
                                <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#fff", margin: 0 }}>👥 Who Can Join</h2>
                            </div>
                            <div style={{ padding: "1.5rem" }}>
                                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                                    {whoCanJoin.map((item, idx) => (
                                        <li key={idx} style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: "#475569" }}>
                                            <span style={{ width: "24px", height: "24px", background: "#f0f9ff", border: "2px solid #0084D1", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", fontWeight: 700, color: "#0084D1", flexShrink: 0 }}>{idx + 1}</span>
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div style={{
                            background: "#fff",
                            border: "4px solid #000",
                            borderRadius: "20px",
                            overflow: "hidden",
                            boxShadow: "6px 6px 0 #000",
                            marginBottom: "2rem",
                        }}>
                            <div style={{ background: "#10b981", padding: "1rem 1.5rem", borderBottom: "3px solid #000" }}>
                                <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#fff", margin: 0 }}>📚 How to Study</h2>
                            </div>
                            <div style={{ padding: "1.5rem" }}>
                                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                                    {studyPlan.map((item, idx) => (
                                        <li key={idx} style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: "#475569" }}>
                                            <span style={{ color: "#10b981", fontWeight: 900 }}>→</span>
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div style={{
                            background: "#fff",
                            border: "4px solid #000",
                            borderRadius: "20px",
                            overflow: "hidden",
                            boxShadow: "6px 6px 0 #000",
                        }}>
                            <div style={{ background: "#6f42c1", padding: "1rem 1.5rem", borderBottom: "3px solid #000" }}>
                                <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#fff", margin: 0 }}>💼 Jobs After Completion</h2>
                            </div>
                            <div style={{ padding: "1.5rem" }}>
                                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                                    {jobsAfter.map((item, idx) => (
                                        <li key={idx} style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: "#475569" }}>
                                            <span style={{ color: "#6f42c1", fontWeight: 900 }}>★</span>
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </main>
                </div>
            </div>

            <style>{`
                @media (min-width: 1024px) {
                    .course-detail-grid {
                        grid-template-columns: 380px 1fr !important;
                    }
                }
                @media (max-width: 768px) {
                    .course-sidebar {
                        order: 2 !important;
                    }
                    .course-main {
                        order: 1 !important;
                    }
                    .course-sidebar > div {
                        position: static !important;
                    }
                }
            `}</style>
        </div>
    );
}