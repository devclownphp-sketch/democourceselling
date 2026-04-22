"use client";

export function SkeletonCard({ className = "" }) {
    return (
        <div
            className={`rounded-xl overflow-hidden ${className}`}
            style={{
                background: "var(--paper)",
                border: "1px solid var(--border-light)",
            }}
        >
            {/* Image skeleton */}
            <div
                className="aspect-video w-full"
                style={{ background: "linear-gradient(90deg, var(--bg) 25%, var(--bg-secondary) 50%, var(--bg) 75%)" }}
            />

            {/* Content skeleton */}
            <div className="p-5 space-y-3">
                {/* Badge */}
                <div
                    className="h-6 w-20 rounded-full"
                    style={{ background: "linear-gradient(90deg, var(--bg) 25%, var(--bg-secondary) 50%, var(--bg) 75%)" }}
                />

                {/* Title */}
                <div
                    className="h-5 w-3/4 rounded"
                    style={{ background: "linear-gradient(90deg, var(--bg) 25%, var(--bg-secondary) 50%, var(--bg) 75%)" }}
                />

                {/* Rating */}
                <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div
                            key={i}
                            className="h-4 w-4 rounded-full"
                            style={{ background: "linear-gradient(90deg, var(--bg) 25%, var(--bg-secondary) 50%, var(--bg) 75%)" }}
                        />
                    ))}
                </div>

                {/* Price */}
                <div className="pt-2" style={{ borderTop: "1px solid var(--border-light)" }}>
                    <div
                        className="h-6 w-16 rounded"
                        style={{ background: "linear-gradient(90deg, var(--bg) 25%, var(--bg-secondary) 50%, var(--bg) 75%)" }}
                    />
                </div>
            </div>
        </div>
    );
}

export function SkeletonCardList({ count = 6, className = "" }) {
    return (
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
            {Array.from({ length: count }).map((_, i) => (
                <SkeletonCard key={i} />
            ))}
        </div>
    );
}

export function SkeletonBlogCard({ className = "" }) {
    return (
        <div
            className={`rounded-xl overflow-hidden ${className}`}
            style={{
                background: "var(--paper)",
                border: "1px solid var(--border-light)",
            }}
        >
            {/* Image skeleton */}
            <div
                className="h-48 w-full"
                style={{ background: "linear-gradient(90deg, var(--bg) 25%, var(--bg-secondary) 50%, var(--bg) 75%)" }}
            />

            {/* Content skeleton */}
            <div className="p-5 space-y-3">
                {/* Date */}
                <div
                    className="h-4 w-24 rounded"
                    style={{ background: "linear-gradient(90deg, var(--bg) 25%, var(--bg-secondary) 50%, var(--bg) 75%)" }}
                />

                {/* Title */}
                <div
                    className="h-6 w-full rounded"
                    style={{ background: "linear-gradient(90deg, var(--bg) 25%, var(--bg-secondary) 50%, var(--bg) 75%)" }}
                />

                {/* Excerpt */}
                <div className="space-y-2">
                    <div
                        className="h-4 w-full rounded"
                        style={{ background: "linear-gradient(90deg, var(--bg) 25%, var(--bg-secondary) 50%, var(--bg) 75%)" }}
                    />
                    <div
                        className="h-4 w-2/3 rounded"
                        style={{ background: "linear-gradient(90deg, var(--bg) 25%, var(--bg-secondary) 50%, var(--bg) 75%)" }}
                    />
                </div>
            </div>
        </div>
    );
}

export function SkeletonBlogList({ count = 6, className = "" }) {
    return (
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
            {Array.from({ length: count }).map((_, i) => (
                <SkeletonBlogCard key={i} />
            ))}
        </div>
    );
}

export function SkeletonQuizCard({ className = "" }) {
    return (
        <div
            className={`rounded-xl p-6 ${className}`}
            style={{
                background: "var(--paper)",
                border: "1px solid var(--border-light)",
            }}
        >
            <div className="flex items-start gap-4">
                {/* Icon placeholder */}
                <div
                    className="h-12 w-12 rounded-xl"
                    style={{ background: "linear-gradient(90deg, var(--bg) 25%, var(--bg-secondary) 50%, var(--bg) 75%)" }}
                />

                <div className="flex-1 space-y-3">
                    {/* Title */}
                    <div
                        className="h-5 w-3/4 rounded"
                        style={{ background: "linear-gradient(90deg, var(--bg) 25%, var(--bg-secondary) 50%, var(--bg) 75%)" }}
                    />

                    {/* Meta info */}
                    <div className="flex gap-4">
                        <div
                            className="h-4 w-16 rounded"
                            style={{ background: "linear-gradient(90deg, var(--bg) 25%, var(--bg-secondary) 50%, var(--bg) 75%)" }}
                        />
                        <div
                            className="h-4 w-20 rounded"
                            style={{ background: "linear-gradient(90deg, var(--bg) 25%, var(--bg-secondary) 50%, var(--bg) 75%)" }}
                        />
                    </div>
                </div>

                {/* Button */}
                <div
                    className="h-10 w-24 rounded-full"
                    style={{ background: "linear-gradient(90deg, var(--bg) 25%, var(--bg-secondary) 50%, var(--bg) 75%)" }}
                />
            </div>
        </div>
    );
}

export function SkeletonQuizList({ count = 5, className = "" }) {
    return (
        <div className={`space-y-4 ${className}`}>
            {Array.from({ length: count }).map((_, i) => (
                <SkeletonQuizCard key={i} />
            ))}
        </div>
    );
}

export function PageSkeleton({ type = "courses", count = 6 }) {
    return (
        <div className="min-h-screen" style={{ background: "var(--bg)" }}>
            <div className="mx-auto px-4 sm:px-6 lg:px-8 py-16" style={{ maxWidth: "1300px" }}>
                {/* Header skeleton */}
                <div className="mb-12 space-y-3">
                    <div
                        className="h-4 w-32 rounded"
                        style={{ background: "linear-gradient(90deg, var(--bg) 25%, var(--bg-secondary) 50%, var(--bg) 75%)" }}
                    />
                    <div
                        className="h-10 w-80 rounded"
                        style={{ background: "linear-gradient(90deg, var(--bg) 25%, var(--bg-secondary) 50%, var(--bg) 75%)" }}
                    />
                </div>

                {/* Content skeleton */}
                {type === "courses" && <SkeletonCardList count={count} />}
                {type === "blog" && <SkeletonBlogList count={count} />}
                {type === "quiz" && <SkeletonQuizList count={count} />}
            </div>
        </div>
    );
}