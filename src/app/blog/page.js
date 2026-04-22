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
        <div className="blog-page">
            {/* Header */}
            <div className="blog-header">
                <div className="blog-header-content">
                    <p className="blog-subtitle">Latest Updates</p>
                    <h1 className="blog-title">Our Blog</h1>
                    <p className="blog-desc">Insights, tips, and stories from our team</p>
                </div>
            </div>

            {/* Content */}
            <div className="blog-container">
                {blogs.length === 0 ? (
                    <div className="brutal-empty-state">
                        <div className="brutal-empty-icon">📝</div>
                        <h3>No Blog Posts Yet</h3>
                        <p>Check back soon for new content!</p>
                    </div>
                ) : (
                    <div className="blog-grid">
                        {blogs.map((blog) => (
                            <BlogCard key={blog.id} blog={blog} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
