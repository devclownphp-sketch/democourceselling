import CourseTypeManager from "@/components/admin/CourseTypeManager";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminCourseTypesPage() {
    const courseTypes = await prisma.courseType.findMany({
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });

    return <CourseTypeManager initialCourseTypes={courseTypes} />;
}
