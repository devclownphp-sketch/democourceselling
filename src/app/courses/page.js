import { prisma } from "@/lib/prisma";
import VisitTracker from "@/components/VisitTracker";
import CoursesClient from "./CoursesClient";

export const dynamic = "force-dynamic";

export default async function CoursesPage() {
    const courses = await prisma.course.findMany({
        where: { isActive: true },
        orderBy: { createdAt: "desc" },
        include: { courseType: true },
    });

    const courseTypes = await prisma.courseType.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
    });

    const normalizedCourses = courses.map((course) => ({
        ...course,
        rating: Number(course.rating || 4.5),
        discountPercent: Number(course.discountPercent || 0),
        originalPrice: Number(course.originalPrice || 0),
        offerPrice: Number(course.offerPrice || 0),
    }));

    return (
        <div className="courses-page">
            <VisitTracker />
            <CoursesClient courses={normalizedCourses} courseTypes={courseTypes} />
        </div>
    );
}