-- AlterTable
ALTER TABLE "public"."Course" ADD COLUMN     "courseTypeId" TEXT,
ADD COLUMN     "discountPercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "rating" DOUBLE PRECISION NOT NULL DEFAULT 4.5;

-- CreateTable
CREATE TABLE "public"."CourseType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CourseType_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CourseType_name_key" ON "public"."CourseType"("name");

-- CreateIndex
CREATE INDEX "CourseType_sortOrder_idx" ON "public"."CourseType"("sortOrder");

-- CreateIndex
CREATE INDEX "CourseType_isActive_idx" ON "public"."CourseType"("isActive");

-- AddForeignKey
ALTER TABLE "public"."Course" ADD CONSTRAINT "Course_courseTypeId_fkey" FOREIGN KEY ("courseTypeId") REFERENCES "public"."CourseType"("id") ON DELETE SET NULL ON UPDATE CASCADE;
