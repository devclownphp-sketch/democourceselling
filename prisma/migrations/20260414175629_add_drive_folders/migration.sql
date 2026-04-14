-- CreateTable
CREATE TABLE "public"."BusinessProfile" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL DEFAULT 'primary',
    "businessName" TEXT NOT NULL DEFAULT 'STP Computer Education',
    "supportEmail" TEXT NOT NULL DEFAULT 'stpcomputereducation@gmail.com',
    "supportPhone" TEXT NOT NULL DEFAULT '+91 9460824001',
    "addressLine" TEXT NOT NULL DEFAULT 'Mahipal Nagar, New Delhi - 110037',
    "contactHeadline" TEXT NOT NULL DEFAULT 'Get in touch with us',
    "contactSubtext" TEXT NOT NULL DEFAULT 'For any queries about our courses, contact us using the details below.',
    "mapEmbedUrl" TEXT NOT NULL DEFAULT '',
    "twitterUrl" TEXT NOT NULL DEFAULT '',
    "facebookUrl" TEXT NOT NULL DEFAULT '',
    "instagramUrl" TEXT NOT NULL DEFAULT '',
    "linkedinUrl" TEXT NOT NULL DEFAULT '',
    "youtubeUrl" TEXT NOT NULL DEFAULT '',
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BusinessProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BusinessProfile_key_key" ON "public"."BusinessProfile"("key");
