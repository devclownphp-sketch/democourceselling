import { z } from "zod";

export const courseInputSchema = z.object({
    title: z.string().trim().min(3, "Title must be at least 3 characters"),
    shortDescription: z.string().trim().min(5, "Short description must be at least 5 characters"),
    whatIs: z.string().trim().min(2, "What Is section is required"),
    whoCanJoin: z.string().trim().min(2, "Who Can Join section is required"),
    syllabusTopics: z.string().trim().min(2, "Syllabus Topics is required"),
    studyPlan: z.string().trim().min(2, "Study Plan is required"),
    jobsAfter: z.string().trim().min(2, "Jobs After section is required"),
    startLearningText: z.string().trim().min(2, "Start Learning text is required"),
    originalPrice: z.coerce.number().nonnegative("Price must be 0 or more"),
    offerPrice: z.coerce.number().nonnegative("Offer price must be 0 or more"),
    duration: z.string().trim().min(2, "Duration is required"),
    level: z.string().trim().min(2, "Level is required"),
    classType: z.string().trim().min(2, "Class type is required"),
    liveQna: z.string().trim().min(2, "Live QnA info is required"),
    pdfNotes: z.string().trim().min(2, "PDF Notes info is required"),
    callSupport: z.string().trim().min(2, "Call Support info is required"),
    lifetimeAccess: z.boolean(),
    socialPrompt: z.string().trim().min(2, "Social prompt is required"),
    whatsappNumber: z.string().trim().min(10, "WhatsApp number must be at least 10 digits"),
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
