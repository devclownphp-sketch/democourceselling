import { prisma } from "@/lib/prisma";
import CertificateTemplateManager from "@/components/admin/CertificateTemplateManager";

export const dynamic = "force-dynamic";

export default async function AdminCertificatesPage() {
    const templates = await prisma.certificateTemplate.findMany({
        orderBy: { createdAt: "desc" },
    });

    const certificates = await prisma.certificate.findMany({
        orderBy: { issuedAt: "desc" },
        take: 100,
    });

    return <CertificateTemplateManager initialTemplates={templates} initialCertificates={certificates} />;
}