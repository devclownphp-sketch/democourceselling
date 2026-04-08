import { z } from "zod";

export const courseTypeInputSchema = z.object({
    name: z.string().trim().min(2, "Course type name must be at least 2 characters").max(80, "Course type name is too long"),
    isActive: z.boolean().default(true),
});

export function parseCourseTypePayload(payload) {
    return courseTypeInputSchema.parse({
        ...payload,
        isActive: payload?.isActive !== false && payload?.isActive !== "false",
    });
}
