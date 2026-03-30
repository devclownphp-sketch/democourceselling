import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

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
            select: {
                id: true,
                title: true,
                enrollClicks: true,
            },
        }),
    ]);

    return (
        <div className="stack-lg">
            <section className="panel">
                <h1>Admin Dashboard</h1>
                <p className="muted-text">Overview of traffic, enrollments, and management data.</p>
                <div className="stats-grid">
                    <article>
                        <h3>Total Visits</h3>
                        <p>{visits}</p>
                    </article>
                    <article>
                        <h3>Enroll Clicks</h3>
                        <p>{enrolls}</p>
                    </article>
                    <article>
                        <h3>Contact Requests</h3>
                        <p>{contacts}</p>
                    </article>
                    <article>
                        <h3>Total Courses</h3>
                        <p>{coursesCount}</p>
                    </article>
                    <article>
                        <h3>Total Admins</h3>
                        <p>{adminsCount}</p>
                    </article>
                </div>
            </section>

            <section className="panel">
                <h2>Top Courses by Enroll Clicks</h2>
                <div className="table-wrap">
                    <table>
                        <thead>
                            <tr>
                                <th>Course</th>
                                <th>Enroll Clicks</th>
                            </tr>
                        </thead>
                        <tbody>
                            {topCourses.map((course) => (
                                <tr key={course.id}>
                                    <td>{course.title}</td>
                                    <td>{course.enrollClicks}</td>
                                </tr>
                            ))}
                            {topCourses.length === 0 ? (
                                <tr>
                                    <td colSpan={2}>No courses available yet.</td>
                                </tr>
                            ) : null}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}
