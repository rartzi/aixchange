-- CreateEnum
CREATE TYPE "SolutionStatus" AS ENUM ('ACTIVE', 'PENDING', 'INACTIVE');

-- AlterTable
ALTER TABLE "Solution" ADD COLUMN     "category" TEXT NOT NULL DEFAULT 'Other',
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "launchUrl" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "provider" TEXT NOT NULL DEFAULT 'Unknown',
ADD COLUMN     "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "resourceConfig" JSONB NOT NULL DEFAULT '{"cpu":"1 core","memory":"1GB","storage":"1GB","gpu":""}',
ADD COLUMN     "status" "SolutionStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "tokenCost" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "Solution_category_idx" ON "Solution"("category");

-- CreateIndex
CREATE INDEX "Solution_status_idx" ON "Solution"("status");
