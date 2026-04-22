import CourseManager from "@/components/admin/CourseManager";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function serializeCourse(course) {
    return {
        ...course,
        originalPrice: course.originalPrice?.toString() || "0",
        offerPrice: course.offerPrice?.toString() || "0",
    };
}

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

    const serializedCourses = courses.map(serializeCourse);

    return <CourseManager initialCourses={serializedCourses} courseTypes={courseTypes} />;
}
