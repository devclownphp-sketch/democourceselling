"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function BlogCard({ blog }) {
    const [hovered, setHovered] = useState(false);

    return (
        <article
            className="brutal-blog-card"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {blog.featuredImage && (
                <div className="brutal-blog-image">
                    <Image
                        src={blog.featuredImage}
                        alt={blog.title}
                        width={1200}
                        height={800}
                        unoptimized
                        className="brutal-blog-img"
                    />
                </div>
            )}
            <div className="brutal-blog-content">
                <h3 className="brutal-blog-title">{blog.title}</h3>
                <p className="brutal-blog-excerpt">{blog.excerpt}</p>
                <div className="brutal-blog-meta">
                    <span>by {blog.admin?.username || "Unknown"}</span>
                    <span suppressHydrationWarning>{blog.createdAt ? new Date(blog.createdAt).toLocaleDateString('en-GB') : ""}</span>
                </div>
                <Link href={`/blog/${blog.slug}`} className="brutal-blog-link">
                    Read More →
                </Link>
            </div>
        </article>
    );
}
