import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";

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
        <div className="public-page">
            <div className="page-hero" style={{ backgroundColor: "#f3f4f6", padding: "3rem 2rem", textAlign: "center" }}>
                <h1>Our Blog</h1>
                <p style={{ color: "#6b7280", marginTop: "0.5rem" }}>
                    Insights, tips, and stories from our team
                </p>
            </div>

            <div className="container" style={{ padding: "2rem 1rem" }}>
                {blogs.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "2rem" }}>
                        <p style={{ color: "#6b7280" }}>No blog posts yet. Check back soon!</p>
                    </div>
                ) : (
                    <div className="blog-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "2rem" }}>
                        {blogs.map((blog) => (
                            <article
                                key={blog.id}
                                className="blog-card"
                                style={{
                                    backgroundColor: "#fff",
                                    borderRadius: "0.75rem",
                                    overflow: "hidden",
                                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                                    transition: "transform 0.3s, box-shadow 0.3s",
                                    cursor: "pointer",
                                    display: "flex",
                                    flexDirection: "column",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = "translateY(-4px)";
                                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = "translateY(0)";
                                    e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
                                }}
                            >
                                {blog.featuredImage && (
                                    <Image
                                        src={blog.featuredImage}
                                        alt={blog.title}
                                        width={1200}
                                        height={800}
                                        unoptimized
                                        style={{
                                            width: "100%",
                                            height: "200px",
                                            objectFit: "cover",
                                        }}
                                    />
                                )}
                                <div style={{ padding: "1.5rem", flex: 1, display: "flex", flexDirection: "column" }}>
                                    <h3 style={{ marginBottom: "0.5rem", fontSize: "1.25rem", fontWeight: 600 }}>
                                        {blog.title}
                                    </h3>
                                    <p style={{ color: "#6b7280", marginBottom: "1rem", flex: 1 }}>
                                        {blog.excerpt}
                                    </p>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "1rem", borderTop: "1px solid #e5e7eb", fontSize: "0.875rem", color: "#9ca3af" }}>
                                        <span>by {blog.admin?.username || "Unknown"}</span>
                                        <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <Link
                                        href={`/blog/${blog.slug}`}
                                        style={{
                                            display: "inline-block",
                                            marginTop: "1rem",
                                            color: "#6366f1",
                                            textDecoration: "none",
                                            fontWeight: 500,
                                            transition: "color 0.3s",
                                        }}
                                        onMouseEnter={(e) => (e.currentTarget.style.color = "#4f46e5")}
                                        onMouseLeave={(e) => (e.currentTarget.style.color = "#6366f1")}
                                    >
                                        Read More →
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
