import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PDFList from "@/components/notes/PDFList";

export const dynamic = "force-dynamic";

export default async function CourseNotesPage({ params }) {
    const { slug } = await params;

    const course = await prisma.course.findUnique({
        where: { slug },
        include: {
            driveFolders: {
                orderBy: { createdAt: "asc" },
            },
        },
    });

    if (!course || !course.isActive) {
        notFound();
    }

    return (
        <div className="min-h-screen" style={{ background: "var(--bg)", color: "var(--text-primary)" }}>
            <section className="mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16" style={{ maxWidth: "1280px" }}>
                <div className="mb-8">
                    <Link
                        href={`/courses/${slug}`}
                        className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:text-blue-700"
                        style={{ color: "var(--brand-primary)" }}
                    >
                        ← Back to {course.title}
                    </Link>
                </div>

                <h1
                    style={{
                        fontSize: "var(--font-size-3xl)",
                        fontWeight: 700,
                        color: "var(--text-primary)",
                        marginBottom: "var(--spacing-sm)",
                    }}
                >
                    📄 PDF Notes
                </h1>
                <p style={{ color: "var(--text-secondary)", marginBottom: "var(--spacing-2xl)" }}>
                    {course.title}
                </p>

                {course.driveFolders.length === 0 ? (
                    <p style={{ color: "var(--text-tertiary)" }}>No notes have been added for this course yet.</p>
                ) : (
                    <div>
                        {course.driveFolders.map((folder) => (
                            <PDFList
                                key={folder.id}
                                folderId={folder.folderId}
                                folderName={folder.folderName}
                            />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
