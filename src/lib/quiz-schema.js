import { z } from "zod";

const quizQuestionSchema = z.object({
    questionText: z.string().trim().min(5, "Question text must be at least 5 characters"),
    options: z.array(z.string().trim().min(1, "Each option is required")).length(4, "Each question must have exactly 4 options"),
    correctIndex: z.coerce.number().int().min(0).max(3),
    sortOrder: z.coerce.number().int().min(0).default(0),
});

export const quizInputSchema = z.object({
    title: z.string().trim().min(3, "Quiz title must be at least 3 characters"),
    heading: z.string().trim().min(3, "Quiz heading is required"),
    category: z.string().trim().min(2, "Category is required"),
    minutes: z.coerce.number().int().min(1, "Minutes must be at least 1").max(180, "Minutes must be 180 or less"),
    rating: z.coerce.number().min(1, "Rating must be at least 1").max(5, "Rating must be 5 or less"),
    sortOrder: z.coerce.number().int().min(0).default(0),
    isActive: z.boolean().default(true),
    questions: z.array(quizQuestionSchema).min(1, "Add at least one question"),
});

export function parseQuizPayload(payload) {
    const normalized = {
        ...payload,
        isActive: payload?.isActive !== false && payload?.isActive !== "false",
    };

    return quizInputSchema.parse(normalized);
}
