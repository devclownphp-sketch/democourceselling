import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function CategoriesServerPage() {
    const dbConfigured = Boolean(process.env.DATABASE_URL);

    const courseTypes = dbConfigured
        ? await prisma.courseType.findMany({
            where: { isActive: true },
            orderBy: { sortOrder: "asc" },
        })
        : [];

    const courses = dbConfigured
        ? await prisma.course.findMany({
            where: { isActive: true },
            orderBy: { createdAt: "desc" },
            include: { courseType: true },
        })
        : [];

    const normalizedCourses = courses.map((course) => ({
        ...course,
        originalPrice: Number(course.originalPrice || 0),
        offerPrice: Number(course.offerPrice || 0),
        rating: Number(course.rating || 4.5),
    }));

    const props = {
        courseTypes,
        courses: normalizedCourses,
    };

    const CategoriesPageClient = await import("./CategoriesPageClient").then(m => m.default);
    return <CategoriesPageClient {...props} />;
}