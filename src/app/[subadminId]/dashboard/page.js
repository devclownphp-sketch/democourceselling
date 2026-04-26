import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getAccessibleSections, checkPermission, canViewSection } from "@/lib/admin-auth";
import UnauthorizedPage from "@/components/admin/UnauthorizedPage";

export const dynamic = "force-dynamic";

async function getSubadminAndValidate(cookieStore, urlId) {
    const sessionToken = cookieStore.get("subadmin_session")?.value;
    const storedUrlId = cookieStore.get("subadmin_urlid")?.value;

    if (!sessionToken || storedUrlId !== urlId) return null;

    const tokenHash = require("crypto").createHash("sha256").update(sessionToken).digest("hex");
    const session = await prisma.subAdminSession.findUnique({
        where: { tokenHash },
        include: { subAdmin: { include: { role: true } } },
    });

    if (!session) return null;

    const timeoutMin = session.subAdmin?.sessionTimeoutMin || 10;
    if (new Date() > new Date(session.createdAt.getTime() + timeoutMin * 60 * 1000)) return null;
    if (session.expiresAt < new Date()) return null;
    if (!session.subAdmin.isActive) return null;

    return session.subAdmin;
}

const statCards = [
    { key: "visits", emoji: "\ud83d\udc41\ufe0f", label: "Total Visits", color: "cyan" },
    { key: "enrolls", emoji: "\ud83c\udfaf", label: "Enroll Clicks", color: "emerald" },
    { key: "contacts", emoji: "\ud83d\udce8", label: "Contact Requests", color: "amber" },
    { key: "courses", emoji: "\ud83d\udcda", label: "Total Courses", color: "blue" },
    { key: "quizzes", emoji: "\ud83e\udde0", label: "Active Quizzes", color: "sky" },
    { key: "reviews", emoji: "\u2b50", label: "Active Reviews", color: "gold" },
    { key: "materials", emoji: "\ud83d\udcc4", label: "Study Materials", color: "purple" },
];

export default async function SubAdminDashboardPage({ params }) {
    const { subadminId } = await params;
    const cookieStore = await cookies();
    const subadmin = await getSubadminAndValidate(cookieStore, subadminId);

    if (!subadmin) {
        redirect("/admin/login/subadmin");
    }

    const rolePermissions = subadmin.role?.permissions || null;
    const canView = canViewSection(rolePermissions, "dashboard");

    if (!canView) {
        return <UnauthorizedPage sectionName="Dashboard" username={subadmin.username} />;
    }

    const canViewStats = checkPermission(subadmin, "dashboard.stats");

    let dashboardData = { visits: 0, enrolls: 0, contacts: 0, courses: 0, quizzes: 0, reviews: 0, materials: 0 };
    let topCourses = [];

    if (canViewStats) {
        try {
            const [visits, enrolls, contacts, courses, quizzes, reviews, materials, top] = await Promise.all([
                prisma.metricEvent.count({ where: { type: "VISIT" } }),
                prisma.metricEvent.count({ where: { type: "ENROLL" } }),
                prisma.contactSubmission.count(),
                prisma.course.count(),
                prisma.quiz.count({ where: { isActive: true } }),
                prisma.review.count({ where: { isActive: true } }),
                prisma.studyMaterial.count(),
                prisma.course.findMany({
                    take: 5,
                    orderBy: { enrollClicks: "desc" },
                    select: { id: true, title: true, enrollClicks: true },
                }),
            ]);
            dashboardData = { visits, enrolls, contacts, courses, quizzes, reviews, materials };
            topCourses = top;
        } catch {}
    }

    return (
        <div className="stack-lg">
            <section className="panel">
                <div className="dash-header">
                    <div>
                        <h1>{"\ud83d\udcca"} Dashboard</h1>
                        <p className="muted-text">Welcome back, @{subadmin.username}</p>
                    </div>
                </div>
                <div className="stats-grid">
                    {statCards.map((s) => (
                        <article key={s.key} className="stat-card">
                            <span className="stat-emoji">{s.emoji}</span>
                            <h3>{s.label}</h3>
                            <p className="stat-value">{dashboardData[s.key]}</p>
                        </article>
                    ))}
                </div>
            </section>

            {canViewStats && topCourses.length > 0 && (
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
                            </tbody>
                        </table>
                    </div>
                </section>
            )}
        </div>
    );
}