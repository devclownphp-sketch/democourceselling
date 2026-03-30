-- CreateEnum
CREATE TYPE "public"."MetricType" AS ENUM ('VISIT', 'ENROLL', 'CONTACT');

-- CreateTable
CREATE TABLE "public"."Admin" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdByUsername" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AdminSession" (
    "id" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "adminId" TEXT NOT NULL,

    CONSTRAINT "AdminSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Course" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "shortDescription" TEXT NOT NULL,
    "whatIs" TEXT NOT NULL,
    "whoCanJoin" TEXT NOT NULL,
    "syllabusTopics" TEXT NOT NULL,
    "studyPlan" TEXT NOT NULL,
    "jobsAfter" TEXT NOT NULL,
    "startLearningText" TEXT NOT NULL,
    "originalPrice" DECIMAL(10,2) NOT NULL,
    "offerPrice" DECIMAL(10,2) NOT NULL,
    "duration" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "classType" TEXT NOT NULL,
    "liveQna" TEXT NOT NULL,
    "pdfNotes" TEXT NOT NULL,
    "callSupport" TEXT NOT NULL,
    "lifetimeAccess" BOOLEAN NOT NULL DEFAULT true,
    "socialPrompt" TEXT NOT NULL,
    "whatsappNumber" TEXT NOT NULL,
    "enrollClicks" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "adminId" TEXT,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ContactSubmission" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContactSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MetricEvent" (
    "id" TEXT NOT NULL,
    "type" "public"."MetricType" NOT NULL,
    "path" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "courseId" TEXT,

    CONSTRAINT "MetricEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_username_key" ON "public"."Admin"("username");

-- CreateIndex
CREATE UNIQUE INDEX "AdminSession_tokenHash_key" ON "public"."AdminSession"("tokenHash");

-- CreateIndex
CREATE INDEX "AdminSession_adminId_idx" ON "public"."AdminSession"("adminId");

-- CreateIndex
CREATE INDEX "AdminSession_expiresAt_idx" ON "public"."AdminSession"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "Course_slug_key" ON "public"."Course"("slug");

-- CreateIndex
CREATE INDEX "Course_isActive_idx" ON "public"."Course"("isActive");

-- CreateIndex
CREATE INDEX "Course_createdAt_idx" ON "public"."Course"("createdAt");

-- CreateIndex
CREATE INDEX "ContactSubmission_createdAt_idx" ON "public"."ContactSubmission"("createdAt");

-- CreateIndex
CREATE INDEX "MetricEvent_type_createdAt_idx" ON "public"."MetricEvent"("type", "createdAt");

-- CreateIndex
CREATE INDEX "MetricEvent_courseId_idx" ON "public"."MetricEvent"("courseId");

-- AddForeignKey
ALTER TABLE "public"."AdminSession" ADD CONSTRAINT "AdminSession_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "public"."Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Course" ADD CONSTRAINT "Course_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "public"."Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MetricEvent" ADD CONSTRAINT "MetricEvent_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "public"."Course"("id") ON DELETE SET NULL ON UPDATE CASCADE;
