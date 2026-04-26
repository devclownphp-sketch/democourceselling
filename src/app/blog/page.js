import { prisma } from "@/lib/prisma";
import BlogCard from "./BlogCard";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
    title: "Blog - STP Computer Education",
    description: "Read our latest blog posts and articles.",
};

export default async function BlogPage() {
    const blogs = await prisma.blog.findMany({
        where: { isPublished: true },
        orderBy: { createdAt: "desc" },
        include: { admin: { select: { username: true } } },
    });

    return (
        <div style={{ minHeight: "100vh", background: "#F9FAFB" }}>
            <div style={{
                background: "linear-gradient(135deg, #ffd400 0%, #ffe066 50%, #ffd400 100%)",
                borderBottom: "4px solid #000",
                padding: "2rem 1rem 1.75rem",
                textAlign: "center",
                position: "relative",
                overflow: "hidden",
            }}>
                <div style={{
                    position: "absolute", top: 0, left: 0, right: 0, height: "4px",
                    background: "repeating-linear-gradient(90deg, #000 0, #000 8px, transparent 8px, transparent 16px)",
                }} />
                <span style={{
                    display: "inline-block", fontSize: "0.7rem", fontWeight: 800,
                    textTransform: "uppercase", letterSpacing: "0.2em",
                    color: "#000", opacity: 0.5, marginBottom: "0.25rem",
                }}>
                    Latest Updates
                </span>
                <h1 style={{
                    fontSize: "clamp(1.5rem, 3.5vw, 2.25rem)", fontWeight: 900,
                    margin: "0.25rem 0", color: "#000", textTransform: "uppercase",
                    letterSpacing: "-0.02em",
                }}>
                    Our Blog
                </h1>
                <p style={{ color: "rgba(0,0,0,0.55)", fontSize: "0.95rem", margin: 0, fontWeight: 600 }}>
                    Insights, tips, and stories from our team
                </p>
            </div>

            <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "2.5rem 1rem" }}>
                {blogs.length === 0 ? (
                    <div style={{
                        textAlign: "center", padding: "4rem 2rem",
                        background: "#fff", borderRadius: "20px",
                        border: "4px solid #000", boxShadow: "6px 6px 0 #000",
                    }}>
                        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📝</div>
                        <h3 style={{ fontWeight: 700, fontSize: "1.25rem", marginBottom: "0.5rem", color: "#000" }}>No Blog Posts Yet</h3>
                        <p style={{ color: "#666" }}>Check back soon for new content!</p>
                    </div>
                ) : (
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                        gap: "1.5rem",
                    }}>
                        {blogs.map((blog) => (
                            <BlogCard key={blog.id} blog={blog} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
