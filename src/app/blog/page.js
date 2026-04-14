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
                            <BlogCard key={blog.id} blog={blog} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
