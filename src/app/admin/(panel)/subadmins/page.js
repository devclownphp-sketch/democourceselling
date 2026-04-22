import { prisma } from "@/lib/prisma";
import SubAdminManager from "@/components/admin/SubAdminManager";

export const dynamic = "force-dynamic";

export default async function AdminSubAdminsPage() {
    const subadmins = await prisma.subAdmin.findMany({
        orderBy: { createdAt: "desc" },
        include: { role: true, sessions: true },
    });

    const roles = await prisma.role.findMany({
        orderBy: { name: "asc" },
    });

    return <SubAdminManager initialSubAdmins={subadmins} initialRoles={roles} />;
}