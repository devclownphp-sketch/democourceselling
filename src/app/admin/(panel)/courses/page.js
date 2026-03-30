import CourseManager from "@/components/admin/CourseManager";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminCoursesPage() {
    const courses = await prisma.course.findMany({
        orderBy: { createdAt: "desc" },
    });

    return <CourseManager initialCourses={courses} />;
}
