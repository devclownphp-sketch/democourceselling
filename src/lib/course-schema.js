import { z } from "zod";

export const courseInputSchema = z.object({
    title: z.string().trim().min(3),
    shortDescription: z.string().trim().min(5),
    whatIs: z.string().trim().min(2),
    whoCanJoin: z.string().trim().min(2),
    syllabusTopics: z.string().trim().min(2),
    studyPlan: z.string().trim().min(2),
    jobsAfter: z.string().trim().min(2),
    startLearningText: z.string().trim().min(2),
    originalPrice: z.coerce.number().nonnegative(),
    offerPrice: z.coerce.number().nonnegative(),
    duration: z.string().trim().min(2),
    level: z.string().trim().min(2),
    classType: z.string().trim().min(2),
    liveQna: z.string().trim().min(2),
    pdfNotes: z.string().trim().min(2),
    callSupport: z.string().trim().min(2),
    lifetimeAccess: z.boolean(),
    socialPrompt: z.string().trim().min(2),
    whatsappNumber: z.string().trim().min(10),
    isActive: z.boolean().default(true),
});

export function parseCoursePayload(payload) {
    const normalized = {
        ...payload,
        lifetimeAccess: payload?.lifetimeAccess === true || payload?.lifetimeAccess === "true",
        isActive: payload?.isActive !== false && payload?.isActive !== "false",
    };

    return courseInputSchema.parse(normalized);
}
