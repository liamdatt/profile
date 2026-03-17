-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ThemeKey" ADD VALUE 'AURORA';
ALTER TYPE "ThemeKey" ADD VALUE 'PARTICLES';
ALTER TYPE "ThemeKey" ADD VALUE 'SILK';
ALTER TYPE "ThemeKey" ADD VALUE 'WAVES';

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "layoutAlignment" TEXT NOT NULL DEFAULT 'left',
ADD COLUMN     "layoutOrder" JSONB DEFAULT '["header", "links", "contacts"]';
