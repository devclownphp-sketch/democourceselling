import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import PDFViewer from "@/components/notes/PDFViewer";

export const dynamic = "force-dynamic";

export default async function StudyMaterialViewPage({ params }) {
    const material = await prisma.studyMaterial.findUnique({
        where: { id: params.id },
        include: { course: { select: { title: true, slug: true } } },
    });

    if (!material) {
        notFound();
    }

    const viewerType = material.viewerType || "embed";

    return (
        <div className="smv-page">
            <div className="smv-header">
                <div className="smv-header-content">
                    <a href="/study-materials" className="smv-back-btn">
                        ← Back to Materials
                    </a>
                    <div className="smv-info">
                        <span className="smv-category">{material.category}</span>
                        <h1>{material.title}</h1>
                        {material.course && (
                            <a href={`/courses/${material.course.slug}`} className="smv-course-link">
                                📚 {material.course.title}
                            </a>
                        )}
                    </div>
                </div>
            </div>

            <div className="smv-content">
                <PDFViewer
                    url={material.pdfUrl}
                    viewerType={viewerType}
                    title={material.title}
                />
            </div>

            <div className="smv-actions">
                <a href={material.pdfUrl} download className="smv-download-btn">
                    ⬇ Download PDF
                </a>
            </div>

            <style jsx>{`
                .smv-page {
                    min-height: 100vh;
                    background: #f8f9fc;
                }

                .smv-header {
                    background: #ffd400;
                    border-bottom: 4px solid #000;
                    padding: 1.5rem;
                }

                .smv-header-content {
                    max-width: 1400px;
                    margin: 0 auto;
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .smv-back-btn {
                    display: inline-flex;
                    align-items: center;
                    padding: 0.5rem 1rem;
                    background: #000;
                    color: #fff;
                    border-radius: 10px;
                    font-weight: 700;
                    text-decoration: none;
                    border: 3px solid #000;
                    box-shadow: 3px 3px 0 #000;
                    width: fit-content;
                }

                .smv-back-btn:hover {
                    transform: translate(-2px, -2px);
                    box-shadow: 5px 5px 0 #000;
                }

                .smv-info {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .smv-category {
                    display: inline-block;
                    padding: 0.25rem 0.75rem;
                    background: #000;
                    color: #ffd400;
                    border-radius: 999px;
                    font-size: 0.75rem;
                    font-weight: 800;
                    text-transform: uppercase;
                    width: fit-content;
                }

                .smv-header h1 {
                    font-size: clamp(1.5rem, 4vw, 2rem);
                    font-weight: 900;
                    margin: 0;
                    text-transform: uppercase;
                }

                .smv-course-link {
                    color: #000;
                    text-decoration: none;
                    font-weight: 600;
                    font-size: 0.9rem;
                }

                .smv-course-link:hover {
                    text-decoration: underline;
                }

                .smv-content {
                    max-width: 1400px;
                    margin: 0 auto;
                    padding: 1.5rem;
                }

                .smv-actions {
                    max-width: 1400px;
                    margin: 0 auto;
                    padding: 0 1.5rem 1.5rem;
                    display: flex;
                    justify-content: center;
                }

                .smv-download-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.75rem 1.5rem;
                    background: #000;
                    color: #ffd400;
                    border-radius: 12px;
                    font-weight: 700;
                    text-decoration: none;
                    border: 4px solid #000;
                    box-shadow: 4px 4px 0 #000;
                }

                .smv-download-btn:hover {
                    transform: translate(-2px, -2px);
                    box-shadow: 6px 6px 0 #000;
                }

                [data-theme="dark"] .smv-page {
                    background: #0a0a0f;
                }

                [data-theme="dark"] .smv-header {
                    background: #1a1a2e;
                    border-bottom-color: #ffd400;
                }

                [data-theme="dark"] .smv-back-btn {
                    background: #ffd400;
                    color: #000;
                }

                [data-theme="dark"] .smv-header h1 {
                    color: #ffffff;
                }
            `}</style>
        </div>
    );
}