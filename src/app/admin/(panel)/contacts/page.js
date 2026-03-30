import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminContactsPage() {
    const contacts = await prisma.contactSubmission.findMany({
        orderBy: { createdAt: "desc" },
    });

    return (
        <section className="panel stack-md">
            <h1>Contact Submissions</h1>
            <div className="table-wrap">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Message</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {contacts.map((item) => (
                            <tr key={item.id}>
                                <td>{item.name}</td>
                                <td>{item.email}</td>
                                <td>{item.phone}</td>
                                <td>{item.message}</td>
                                <td>{new Date(item.createdAt).toLocaleString()}</td>
                            </tr>
                        ))}
                        {contacts.length === 0 ? (
                            <tr>
                                <td colSpan={5}>No contact entries yet.</td>
                            </tr>
                        ) : null}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
