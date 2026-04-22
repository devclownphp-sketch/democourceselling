import { z } from "zod";

export const MAX_REVIEW_WORDS = 80;
export const MAX_QUOTE_CHARS = 100;
export const MAX_MARQUEE_CHARS = 50;

export function countWords(value) {
    return String(value || "").trim().split(/\s+/).filter(Boolean).length;
}

const reviewSchema = z.object({
    name: z.string().trim().min(2, "Name is required.").max(60, "Name is too long."),
    role: z.string().trim().min(1, "Role is required.").max(80, "Role is too long."),
    reviewText: z.string().trim().min(10, "Review must be at least 10 characters."),
    quote: z.string().trim().max(MAX_QUOTE_CHARS, "Quote is too long.").optional().default(""),
    marqueeText: z.string().trim().max(MAX_MARQUEE_CHARS, "Marquee text is too long.").optional().default(""),
    avatar: z.string().trim().url("Invalid avatar URL.").optional().nullable().default(null),
    rating: z.coerce.number().int().min(1).max(5).default(5),
    sortOrder: z.coerce.number().int().min(0).default(0),
    isFeatured: z.boolean().default(false),
    isActive: z.boolean().default(true),
});

export function parseReviewPayload(payload) {
    return reviewSchema.parse(payload);
}
