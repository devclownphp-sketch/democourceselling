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
        <div style={{ minHeight: "100vh", background: "#F9FAFB" }}>
            <div style={{
                background: "linear-gradient(135deg, #ffd400 0%, #ffe066 50%, #ffd400 100%)",
                borderBottom: "4px solid #000",
                padding: "2rem 1rem 1.75rem",
                position: "relative",
                overflow: "hidden",
            }}>
                <div style={{
                    position: "absolute", top: 0, left: 0, right: 0, height: "4px",
                    background: "repeating-linear-gradient(90deg, #000 0, #000 8px, transparent 8px, transparent 16px)",
                }} />
                <div style={{ maxWidth: "800px", margin: "0 auto" }}>
                    <Link
                        href="/blog"
                        style={{
                            display: "inline-flex", alignItems: "center", gap: "0.5rem",
                            marginBottom: "1rem", color: "#000", textDecoration: "none",
                            fontSize: "0.8rem", fontWeight: 700,
                            padding: "0.4rem 0.8rem", borderRadius: "10px",
                            background: "#000", color: "#ffd400", border: "2px solid #000",
                        }}
                    >
                        ← Back to Blog
                    </Link>

                    <h1 style={{
                        fontSize: "clamp(1.5rem, 4vw, 2.25rem)", fontWeight: 900,
                        lineHeight: 1.15, marginBottom: "0.75rem", color: "#000",
                    }}>
                        {blog.title}
                    </h1>

                    <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", fontSize: "0.85rem" }}>
                        <span style={{
                            display: "inline-flex", alignItems: "center", gap: "0.4rem",
                            color: "rgba(0,0,0,0.6)",
                        }}>
                            <span style={{
                                width: "28px", height: "28px", borderRadius: "50%",
                                background: "#000", display: "flex",
                                alignItems: "center", justifyContent: "center",
                                fontWeight: 800, fontSize: "0.75rem", color: "#ffd400",
                            }}>
                                {(blog.admin?.username || "U").charAt(0).toUpperCase()}
                            </span>
                            {blog.admin?.username || "Unknown"}
                        </span>
                        <span style={{ color: "rgba(0,0,0,0.4)" }}>
                            {new Date(blog.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}
                        </span>
                    </div>
                </div>
            </div>

            <article style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem 1rem 4rem" }}>
                {blog.featuredImage && (
                    <div style={{
                        borderRadius: "20px", overflow: "hidden", marginBottom: "2.5rem",
                        border: "4px solid #000", boxShadow: "6px 6px 0 #000",
                    }}>
                        <Image
                            src={blog.featuredImage}
                            alt={blog.title}
                            width={1400}
                            height={900}
                            unoptimized
                            style={{ width: "100%", height: "400px", objectFit: "cover", display: "block" }}
                        />
                    </div>
                )}

                {blog.excerpt && (
                    <div style={{
                        background: "#fffbeb", padding: "1.5rem", borderRadius: "16px",
                        marginBottom: "2rem", borderLeft: "4px solid #ffd400",
                        border: "3px solid #000", borderLeftWidth: "6px", borderLeftColor: "#ffd400",
                    }}>
                        <p style={{
                            color: "#333", fontSize: "1.1rem", fontStyle: "italic",
                            margin: 0, lineHeight: 1.7,
                        }}>
                            {blog.excerpt}
                        </p>
                    </div>
                )}

                <div style={{ fontSize: "1.05rem", lineHeight: 1.85, color: "#333" }}>
                    {contentParagraphs.map((paragraph, index) => (
                        <p key={index} style={{ marginBottom: "1.25rem" }}>
                            {paragraph}
                        </p>
                    ))}
                </div>

                {Array.isArray(blog.contentBlocks) && blog.contentBlocks.length > 0 && (
                    <div style={{ marginTop: "2rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                        {blog.contentBlocks.map((block, idx) => {
                            if (block.type === "heading") {
                                return (
                                    <h2 key={idx} style={{
                                        fontSize: "1.5rem", fontWeight: 900, color: "#000",
                                        margin: 0, paddingBottom: "0.5rem",
                                        borderBottom: "4px solid #ffd400",
                                    }}>
                                        {block.value}
                                    </h2>
                                );
                            }
                            if (block.type === "text") {
                                return (
                                    <div key={idx} style={{ fontSize: "1.05rem", lineHeight: 1.85, color: "#333" }}>
                                        {block.value.split("\n\n").map((p, pi) => (
                                            <p key={pi} style={{ marginBottom: "1rem" }}>{p}</p>
                                        ))}
                                    </div>
                                );
                            }
                            if (block.type === "image" && block.value) {
                                return (
                                    <figure key={idx} style={{ margin: 0 }}>
                                        <div style={{
                                            borderRadius: "16px", overflow: "hidden",
                                            border: "4px solid #000", boxShadow: "5px 5px 0 #000",
                                        }}>
                                            <Image
                                                src={block.value}
                                                alt={block.caption || "Blog image"}
                                                width={1200}
                                                height={600}
                                                unoptimized
                                                style={{ width: "100%", height: "auto", display: "block", objectFit: "cover" }}
                                            />
                                        </div>
                                        {block.caption && (
                                            <figcaption style={{
                                                fontSize: "0.85rem", color: "#666", fontStyle: "italic",
                                                marginTop: "0.5rem", textAlign: "center",
                                            }}>
                                                {block.caption}
                                            </figcaption>
                                        )}
                                    </figure>
                                );
                            }
                            return null;
                        })}
                    </div>
                )}

                <div style={{ marginTop: "3rem", paddingTop: "2rem", borderTop: "4px solid #000" }}>
                    <Link
                        href="/blog"
                        style={{
                            display: "inline-flex", alignItems: "center", gap: "0.5rem",
                            padding: "0.75rem 1.75rem", background: "#000", color: "#ffd400",
                            borderRadius: "14px", fontWeight: 800, textDecoration: "none",
                            border: "3px solid #000", boxShadow: "4px 4px 0 #000",
                            textTransform: "uppercase", fontSize: "0.85rem",
                        }}
                    >
                        ← Back to Blog
                    </Link>
                </div>
            </article>
        </div>
    );
}
