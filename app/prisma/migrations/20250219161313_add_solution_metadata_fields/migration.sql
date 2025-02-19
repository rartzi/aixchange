/*
  Warnings:

  - Added the required column `category` to the `Solution` table without a default value. This is not possible if the table is not empty.
  - Added the required column `launchUrl` to the `Solution` table without a default value. This is not possible if the table is not empty.
  - Added the required column `provider` to the `Solution` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SolutionStatus" AS ENUM ('ACTIVE', 'PENDING', 'INACTIVE');

-- AlterTable
ALTER TABLE "Resource" ADD COLUMN     "metadata" JSONB;

-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "metadata" JSONB;

-- AlterTable
ALTER TABLE "Solution" ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "imageUrl" TEXT NOT NULL DEFAULT '/placeholder-image.jpg',
ADD COLUMN     "launchUrl" TEXT NOT NULL,
ADD COLUMN     "provider" TEXT NOT NULL,
ADD COLUMN     "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "sourceCodeUrl" TEXT,
ADD COLUMN     "status" "SolutionStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "tokenCost" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "Resource_type_idx" ON "Resource"("type");

-- CreateIndex
CREATE INDEX "Review_rating_idx" ON "Review"("rating");

-- CreateIndex
CREATE INDEX "Review_createdAt_idx" ON "Review"("createdAt");

-- CreateIndex
CREATE INDEX "Solution_category_idx" ON "Solution"("category");

-- CreateIndex
CREATE INDEX "Solution_provider_idx" ON "Solution"("provider");

-- CreateIndex
CREATE INDEX "Solution_status_idx" ON "Solution"("status");

-- CreateIndex
CREATE INDEX "Solution_tokenCost_idx" ON "Solution"("tokenCost");

-- CreateIndex
CREATE INDEX "Solution_rating_idx" ON "Solution"("rating");

-- CreateIndex
CREATE INDEX "Solution_createdAt_idx" ON "Solution"("createdAt");

-- CreateIndex
CREATE INDEX "Solution_isPublished_category_idx" ON "Solution"("isPublished", "category");

-- CreateIndex
CREATE INDEX "Solution_isPublished_provider_idx" ON "Solution"("isPublished", "provider");

-- CreateIndex
CREATE INDEX "Solution_isPublished_status_idx" ON "Solution"("isPublished", "status");
