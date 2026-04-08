import { prisma } from "@/lib/prisma";

export const defaultBusinessProfile = {
    businessName: "WEBCOM",
    supportEmail: "test@gmail.com",
    supportPhone: "+91 1234567890",
    addressLine: "123 Main Street, City, Country",
    contactHeadline: "Get in touch with us",
    contactSubtext: "For any queries about our courses, contact us using the details below.",
    mapEmbedUrl: "",
    twitterUrl: "",
    facebookUrl: "",
    instagramUrl: "",
    linkedinUrl: "",
    youtubeUrl: "",
};

export async function getBusinessProfile() {
    try {
        const profile = await prisma.businessProfile.upsert({
            where: { key: "primary" },
            update: {},
            create: {
                key: "primary",
                ...defaultBusinessProfile,
            },
        });

        return {
            ...defaultBusinessProfile,
            ...profile,
        };
    } catch {
        return defaultBusinessProfile;
    }
}
