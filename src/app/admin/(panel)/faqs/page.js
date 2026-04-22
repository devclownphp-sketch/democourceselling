import { prisma } from "@/lib/prisma";
import AdminFAQsClient from "./AdminFAQsClient";

export const dynamic = "force-dynamic";

export default async function AdminFAQsPage() {
    const faqs = await prisma.fAQ.findMany({
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });

    return <AdminFAQsClient initialFaqs={faqs} />;
}
