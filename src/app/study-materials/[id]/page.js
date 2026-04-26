import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import PDFViewer from "@/components/notes/PDFViewer";
import DownloadButton from "./DownloadButton";

export const dynamic = "force-dynamic";

export default async function StudyMaterialViewPage({ params }) {
    const { id } = await params;
    const material = await prisma.studyMaterial.findUnique({
        where: { id },
        include: { course: { select: { title: true, slug: true } } },
    });

    if (!material) {
        notFound();
    }

    const viewerType = material.viewerType || "embed";

    return (
        <div style={{ minHeight: "100vh", background: "#F9FAFB" }}>
            <div style={{
                background: "linear-gradient(135deg, #ffd400 0%, #ffe066 50%, #ffd400 100%)",
                borderBottom: "4px solid #000",
                padding: "1.5rem",
                position: "relative",
                overflow: "hidden",
            }}>
                <div style={{
                    position: "absolute", top: 0, left: 0, right: 0, height: "4px",
                    background: "repeating-linear-gradient(90deg, #000 0, #000 8px, transparent 8px, transparent 16px)",
                }} />
                <div style={{ maxWidth: "1400px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    <a href="/study-materials" style={{
                        display: "inline-flex", alignItems: "center",
                        padding: "0.4rem 0.8rem", background: "#000", color: "#ffd400",
                        borderRadius: "10px", fontWeight: 700, textDecoration: "none",
                        border: "2px solid #000", width: "fit-content", fontSize: "0.8rem",
                    }}>
                        ← Back to Materials
                    </a>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                        <span style={{
                            display: "inline-block", padding: "0.2rem 0.6rem",
                            background: "#000", color: "#ffd400", borderRadius: "8px",
                            fontSize: "0.7rem", fontWeight: 800, textTransform: "uppercase",
                            width: "fit-content",
                        }}>
                            {material.category}
                        </span>
                        <h1 style={{
                            fontSize: "clamp(1.15rem, 2.5vw, 1.5rem)", fontWeight: 900,
                            margin: 0, color: "#000", textTransform: "uppercase",
                        }}>
                            {material.title}
                        </h1>
                        {material.course && (
                            <a href={`/courses/${material.course.slug}`} style={{
                                color: "rgba(0,0,0,0.55)", textDecoration: "none",
                                fontWeight: 700, fontSize: "0.85rem",
                            }}>
                                📚 {material.course.title}
                            </a>
                        )}
                    </div>
                </div>
            </div>

            <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "1.5rem" }}>
                <PDFViewer
                    fileUrl={material.pdfUrl}
                    viewerType={viewerType}
                    title={material.title}
                />
            </div>

            <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 1.5rem 1.5rem", display: "flex", justifyContent: "center" }}>
                <DownloadButton url={material.pdfUrl} filename={material.title + ".pdf"} />
            </div>
        </div>
    );
}