import { prisma } from "@/lib/prisma";
import BrutalLandingPage from "@/components/brutalist/LandingPageClient";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const dbConfigured = Boolean(process.env.DATABASE_URL);

  const courses = dbConfigured
    ? await prisma.course.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
      include: { courseType: true },
    })
    : [];

  const reviews = dbConfigured
    ? await prisma.review.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: "desc" }, { createdAt: "desc" }],
    })
    : [];

  const siteSettings = dbConfigured
    ? await prisma.siteSettings.findUnique({ where: { id: "default" } })
    : null;

  const normalizedCourses = courses.map((course) => ({
    ...course,
    originalPrice: Number(course.originalPrice || 0),
    offerPrice: Number(course.offerPrice || 0),
  }));

  const normalizedReviews = reviews.map((review) => ({
    ...review,
    rating: Number(review.rating || 5),
    sortOrder: Number(review.sortOrder || 0),
  }));

  const normalizedSettings = siteSettings ? {
    heroTitle: siteSettings.heroTitle,
    heroSubtitle: siteSettings.heroSubtitle,
    heroCtaText: siteSettings.heroCtaText,
    statsStudentsCount: siteSettings.statsStudentsCount,
    statsRating: siteSettings.statsRating,
    statsMonthly: siteSettings.statsMonthly,
    themeMode: siteSettings.themeMode,
    pdfViewer: siteSettings.pdfViewer,
    footerCopyright: siteSettings.footerCopyright,
    googleReviewUrl: siteSettings.googleReviewUrl,
  } : {};

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

  return (
    <BrutalLandingPage
      courses={normalizedCourses}
      reviews={normalizedReviews}
      googleReviewUrl={process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL || siteSettings?.googleReviewUrl || "https://www.google.com"}
      siteSettings={normalizedSettings}
    />
  );
}