import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const statCards = [
    { key: "visits", emoji: "\ud83d\udc41\ufe0f", label: "Total Visits", color: "cyan" },
    { key: "enrolls", emoji: "\ud83c\udfaf", label: "Enroll Clicks", color: "emerald" },
    { key: "contacts", emoji: "\ud83d\udce8", label: "Contact Requests", color: "amber" },
    { key: "courses", emoji: "\ud83d\udcda", label: "Total Courses", color: "blue" },
    { key: "admins", emoji: "\ud83d\udc65", label: "Total Admins", color: "purple" },
];

export default async function AdminDashboardPage() {
    const [visits, enrolls, contacts, coursesCount, adminsCount, topCourses] = await Promise.all([
        prisma.metricEvent.count({ where: { type: "VISIT" } }),
        prisma.metricEvent.count({ where: { type: "ENROLL" } }),
        prisma.contactSubmission.count(),
        prisma.course.count(),
        prisma.admin.count(),
        prisma.course.findMany({
            take: 5,
            orderBy: { enrollClicks: "desc" },
            select: { id: true, title: true, enrollClicks: true },
        }),
    ]);

    const values = { visits, enrolls, contacts, courses: coursesCount, admins: adminsCount };

    return (
        <div className="stack-lg">
            <section className="panel">
                <div className="dash-header">
                    <div>
                        <h1>{"\ud83d\udcca"} Dashboard</h1>
                        <p className="muted-text">Overview of traffic, enrollments, and management data.</p>
                    </div>
                </div>
                <div className="stats-grid">
                    {statCards.map((s) => (
                        <article key={s.key} className="stat-card">
                            <span className="stat-emoji">{s.emoji}</span>
                            <h3>{s.label}</h3>
                            <p className="stat-value">{values[s.key]}</p>
                        </article>
                    ))}
                </div>
            </section>

            <section className="panel">
                <h2>{"\ud83c\udfc6"} Top Courses by Enroll Clicks</h2>
                <div className="table-wrap">
                    <table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Course</th>
                                <th>Enroll Clicks</th>
                            </tr>
                        </thead>
                        <tbody>
                            {topCourses.map((course, i) => (
                                <tr key={course.id}>
                                    <td>
                                        <span className="rank-badge">
                                            {i === 0 ? "\ud83e\udd47" : i === 1 ? "\ud83e\udd48" : i === 2 ? "\ud83e\udd49" : `#${i + 1}`}
                                        </span>
                                    </td>
                                    <td>{course.title}</td>
                                    <td>
                                        <span className="click-badge">{course.enrollClicks}</span>
                                    </td>
                                </tr>
                            ))}
                            {topCourses.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="empty-row">{"\ud83d\udce6"} No courses available yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}
