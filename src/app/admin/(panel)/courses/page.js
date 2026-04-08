import CourseManager from "@/components/admin/CourseManager";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminCoursesPage() {
    const [courses, courseTypes] = await Promise.all([
        prisma.course.findMany({
            orderBy: { createdAt: "desc" },
            include: { courseType: true },
        }),
        prisma.courseType.findMany({
            where: { isActive: true },
            orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
        }),
    ]);

    return <CourseManager initialCourses={courses} courseTypes={courseTypes} />;
}
