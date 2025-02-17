-- First, update NULL metadata values to empty JSON object
UPDATE "Solution" SET metadata = '{}' WHERE metadata IS NULL;

-- Move existing data to metadata
UPDATE "Solution"
SET metadata = jsonb_build_object(
  'category', category,
  'provider', provider,
  'launchUrl', "launchUrl",
  'tokenCost', "tokenCost",
  'rating', rating,
  'status', status,
  'resourceConfig', "resourceConfig"
)
WHERE metadata = '{}';

-- Now make the changes to the schema
-- DropIndex
DROP INDEX "Solution_category_idx";
DROP INDEX "Solution_status_idx";

-- AlterTable
ALTER TABLE "Solution" 
ALTER COLUMN "metadata" SET NOT NULL,
ALTER COLUMN "metadata" SET DEFAULT '{}',
DROP COLUMN "category",
DROP COLUMN "launchUrl",
DROP COLUMN "provider",
DROP COLUMN "rating",
DROP COLUMN "resourceConfig",
DROP COLUMN "status",
DROP COLUMN "tokenCost";

-- DropEnum
DROP TYPE "SolutionStatus";
