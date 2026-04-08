import ReviewManager from "@/components/admin/ReviewManager";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminReviewsPage() {
    const reviews = await prisma.review.findMany({
        orderBy: [{ sortOrder: "desc" }, { createdAt: "desc" }],
    });

    return <ReviewManager initialReviews={reviews} googleReviewUrl={process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL || "https://www.google.com"} />;
}