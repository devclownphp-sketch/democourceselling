import { prisma } from "@/lib/prisma";
import LandingPageClient from "@/components/LandingPageClient";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const dbConfigured = Boolean(process.env.DATABASE_URL);
  const courses = dbConfigured
    ? await prisma.course.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    })
    : [];

  const normalizedCourses = courses.map((course) => ({
    ...course,
    originalPrice: Number(course.originalPrice || 0),
    offerPrice: Number(course.offerPrice || 0),
  }));

  if (!dbConfigured) {
    return (
      <div className="mx-auto mt-10 w-[min(900px,92vw)] rounded-2xl border border-orange-300/30 bg-orange-100 p-8 text-orange-950">
        <h2 className="text-2xl font-bold">Database is not configured.</h2>
        <p className="mt-2 text-sm">
          Please set DATABASE_URL in your environment file and run Prisma migration before using
          course features.
        </p>
      </div>
    );
  }

  return <LandingPageClient courses={normalizedCourses} />;
}