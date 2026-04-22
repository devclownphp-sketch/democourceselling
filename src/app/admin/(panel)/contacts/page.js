import { prisma } from "@/lib/prisma";
import AdminContactsClient from "./AdminContactsClient";

export const dynamic = "force-dynamic";

export default async function AdminContactsPage() {
    const contacts = await prisma.contactSubmission.findMany({
        orderBy: { createdAt: "desc" },
    });

    return <AdminContactsClient initialContacts={contacts} />;
}