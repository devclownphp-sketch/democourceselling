import { z } from "zod";

export const MAX_REVIEW_WORDS = 24;

export function countWords(value) {
    return String(value || "").trim().split(/\s+/).filter(Boolean).length;
}

const reviewSchema = z.object({
    name: z.string().trim().min(2, "Name is required.").max(60, "Name is too long."),
    role: z.string().trim().min(1, "Role is required.").max(80, "Role is too long."),
    reviewText: z.string().trim().min(20, "Review must be at least 20 characters.").max(220, "Review is too long.").refine(
        (value) => countWords(value) <= MAX_REVIEW_WORDS,
        { message: `Review must be ${MAX_REVIEW_WORDS} words or fewer.` },
    ),
    rating: z.coerce.number().int().min(1, "Rating must be at least 1.").max(5, "Rating cannot be greater than 5."),
    sortOrder: z.coerce.number().int().min(0, "Sort order must be zero or greater.").default(0),
    isActive: z.coerce.boolean().default(true),
});

export function parseReviewPayload(payload) {
    return reviewSchema.parse(payload);
}