import CreateAdminForm from "@/components/admin/CreateAdminForm";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminsPage() {
    const admins = await prisma.admin.findMany({
        orderBy: { createdAt: "desc" },
        select: { id: true, username: true, createdByUsername: true, createdAt: true },
    });

    return (
        <div className="stack-lg">
            <CreateAdminForm />
            <section className="panel">
                <h2>{"\ud83d\udc65"} Existing Admins ({admins.length})</h2>
                <div className="table-wrap">
                    <table>
                        <thead>
                            <tr>
                                <th>{"\ud83d\udc64"} Username</th>
                                <th>{"\ud83d\udd17"} Created By</th>
                                <th>{"\ud83d\udcc5"} Created At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {admins.map((admin) => (
                                <tr key={admin.id}>
                                    <td><span className="admin-badge">{"\ud83d\udc64"} {admin.username}</span></td>
                                    <td>{admin.createdByUsername || "\u2014"}</td>
                                    <td>{new Date(admin.createdAt).toLocaleString()}</td>
                                </tr>
                            ))}
                            {admins.length === 0 && (
                                <tr><td colSpan={3} className="empty-row">{"\ud83d\udce6"} No admins available.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}
