import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminContactsPage() {
    const contacts = await prisma.contactSubmission.findMany({
        orderBy: { createdAt: "desc" },
    });

    return (
        <section className="panel stack-md">
            <h1>{"\ud83d\udce9"} Contact Submissions ({contacts.length})</h1>
            <div className="table-wrap">
                <table>
                    <thead>
                        <tr>
                            <th>{"\ud83d\udc64"} Name</th>
                            <th>{"\ud83d\udce7"} Email</th>
                            <th>{"\ud83d\udcf1"} Phone</th>
                            <th>{"\ud83d\udcac"} Message</th>
                            <th>{"\ud83d\udcc5"} Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {contacts.map((item) => (
                            <tr key={item.id}>
                                <td>{item.name}</td>
                                <td>{item.email}</td>
                                <td>{item.phone}</td>
                                <td className="msg-cell" title={item.message}>{item.message}</td>
                                <td>{new Date(item.createdAt).toLocaleString()}</td>
                            </tr>
                        ))}
                        {contacts.length === 0 && (
                            <tr><td colSpan={5} className="empty-row">{"\ud83d\udce6"} No contact entries yet.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
