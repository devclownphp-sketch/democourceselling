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
            pdfs: {
                orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
            },
        },
    });

    if (!course || !course.isActive) {
        notFound();
    }
    const uploadedPdfFiles = course.pdfs.map((pdf) => ({
        id: pdf.id,
        name: pdf.name,
        url: pdf.url,
        viewUrl: pdf.url,
        downloadUrl: pdf.url,
        size: pdf.size || 0,
    }));

    const hasDriveFolders = course.driveFolders.length > 0;
    const hasUploadedPdfs = uploadedPdfFiles.length > 0;

    return (
        <div className="min-h-screen" style={{ background: "var(--bg)", color: "var(--text-dark)" }}>
            <section className="mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16" style={{ maxWidth: "1280px" }}>
                <div className="mb-8">
                    <Link
                        href={`/courses/${course.courseUrlId || slug}`}
                        className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:text-blue-700"
                        style={{ color: "var(--primary)" }}
                    >
                        ← Back to {course.title}
                    </Link>
                </div>

                <h1
                    style={{
                        fontSize: "var(--font-size-3xl)",
                        fontWeight: 700,
                        color: "var(--text-dark)",
                        marginBottom: "var(--spacing-sm)",
                    }}
                >
                    📄 PDF Notes
                </h1>
                <p style={{ color: "var(--text-body)", marginBottom: "var(--spacing-2xl)" }}>
                    {course.title}
                </p>

                {hasUploadedPdfs && (
                    <PDFList
                        folderId={null}
                        folderName="Course PDFs"
                        pdfFiles={uploadedPdfFiles}
                    />
                )}

                {hasDriveFolders && (
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

                {!hasDriveFolders && !hasUploadedPdfs && (
                    <p style={{ color: "var(--text-muted)" }}>No notes have been added for this course yet.</p>
                )}
            </section>
        </div>
    );
}
