import CreateAdminForm from "@/components/admin/CreateAdminForm";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminsPage() {
    const admins = await prisma.admin.findMany({
        orderBy: { createdAt: "desc" },
        select: {
            id: true,
            username: true,
            createdByUsername: true,
            createdAt: true,
        },
    });

    return (
        <div className="stack-lg">
            <CreateAdminForm />
            <section className="panel">
                <h2>Existing Admins</h2>
                <div className="table-wrap">
                    <table>
                        <thead>
                            <tr>
                                <th>Username</th>
                                <th>Created By</th>
                                <th>Created At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {admins.map((admin) => (
                                <tr key={admin.id}>
                                    <td>{admin.username}</td>
                                    <td>{admin.createdByUsername || "-"}</td>
                                    <td>{new Date(admin.createdAt).toLocaleString()}</td>
                                </tr>
                            ))}
                            {admins.length === 0 ? (
                                <tr>
                                    <td colSpan={3}>No admins available.</td>
                                </tr>
                            ) : null}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}
