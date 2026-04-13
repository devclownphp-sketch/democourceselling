import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const blog = await prisma.blog.findUnique({
        where: { slug },
    });

    if (!blog || !blog.isPublished) {
        return {
            title: "Blog Post Not Found",
        };
    }

    return {
        title: blog.title + " - STP Computer Education",
        description: blog.excerpt,
    };
}

export default async function BlogPostPage({ params }) {
    const { slug } = await params;

    const blog = await prisma.blog.findUnique({
        where: { slug },
        include: { admin: { select: { username: true } } },
    });

    if (!blog || !blog.isPublished) {
        notFound();
    }

    const contentParagraphs = blog.content.split("\n\n");

    return (
        <div className="public-page">
            <article style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem 1rem" }}>
                {/* Back Link */}
                <Link
                    href="/blog"
                    style={{
                        display: "inline-block",
                        marginBottom: "1.5rem",
                        color: "#6366f1",
                        textDecoration: "none",
                        fontSize: "0.875rem",
                        fontWeight: 500,
                    }}
                >
                    ← Back to Blog
                </Link>

                {/* Featured Image */}
                {blog.featuredImage && (
                    <Image
                        src={blog.featuredImage}
                        alt={blog.title}
                        width={1400}
                        height={900}
                        unoptimized
                        style={{
                            width: "100%",
                            height: "400px",
                            objectFit: "cover",
                            borderRadius: "0.75rem",
                            marginBottom: "2rem",
                        }}
                    />
                )}

                {/* Title */}
                <h1 style={{ fontSize: "2.5rem", fontWeight: 700, marginBottom: "1rem", lineHeight: 1.2 }}>
                    {blog.title}
                </h1>

                {/* Meta Info */}
                <div style={{ display: "flex", gap: "2rem", color: "#6b7280", marginBottom: "2rem", paddingBottom: "2rem", borderBottom: "1px solid #e5e7eb" }}>
                    <span>
                        <strong style={{ color: "#1f2937" }}>By:</strong> {blog.admin?.username || "Unknown"}
                    </span>
                    <span>
                        <strong style={{ color: "#1f2937" }}>Published:</strong> {new Date(blog.createdAt).toLocaleDateString()}
                    </span>
                </div>

                {/* Excerpt */}
                <div style={{ backgroundColor: "#f3f4f6", padding: "1.5rem", borderRadius: "0.75rem", marginBottom: "2rem", borderLeft: "4px solid #6366f1" }}>
                    <p style={{ color: "#1f2937", fontSize: "1.125rem", fontStyle: "italic", margin: 0 }}>
                        {blog.excerpt}
                    </p>
                </div>

                {/* Content */}
                <div
                    style={{
                        fontSize: "1rem",
                        lineHeight: 1.8,
                        color: "#374151",
                    }}
                >
                    {contentParagraphs.map((paragraph, index) => (
                        <p key={index} style={{ marginBottom: "1rem" }}>
                            {paragraph}
                        </p>
                    ))}
                </div>

                {/* Back Link */}
                <div style={{ marginTop: "3rem", paddingTop: "2rem", borderTop: "1px solid #e5e7eb" }}>
                    <Link
                        href="/blog"
                        style={{
                            display: "inline-block",
                            marginBottom: "1.5rem",
                            color: "#6366f1",
                            textDecoration: "none",
                            fontSize: "0.875rem",
                            fontWeight: 500,
                        }}
                    >
                        ← Back to Blog
                    </Link>
                </div>
            </article>
        </div>
    );
}
