import { prisma } from "@/lib/prisma";

export async function POST(request) {
    try {
        const body = await request.json();
        const { name, role, reviewText, rating } = body;

        if (!name || !reviewText) {
            return Response.json({ error: "Name and review text are required" }, { status: 400 });
        }

        const newReview = await prisma.review.create({
            data: {
                name: name.trim(),
                role: role?.trim() || "Student",
                reviewText: reviewText.trim(),
                quote: reviewText.trim().substring(0, 100),
                rating: Math.min(5, Math.max(1, parseInt(rating) || 5)),
                isActive: false,
                isFeatured: false,
            },
        });

        return Response.json({ success: true, review: newReview });
    } catch (error) {
        console.error("Error creating review:", error);
        return Response.json({ error: "Failed to submit review" }, { status: 500 });
    }
}