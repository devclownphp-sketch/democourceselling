import { z } from "zod";

export const blogInputSchema = z.object({
    title: z.string().trim().min(3, "Title must be at least 3 characters").max(150, "Title must be 150 characters or less"),
    excerpt: z.string().trim().min(10, "Excerpt must be at least 10 characters").max(300, "Excerpt must be 300 characters or less"),
    content: z.string().trim().min(20, "Content must be at least 20 characters"),
    featuredImage: z.string().trim().optional().default(""),
    isPublished: z.boolean().default(false),
});

export function parseBlogPayload(payload) {
    const normalized = {
        ...payload,
        isPublished: payload?.isPublished === true || payload?.isPublished === "true",
    };

    return blogInputSchema.parse(normalized);
}
