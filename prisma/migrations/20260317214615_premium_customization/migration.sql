/*
  Warnings:

  - The values [PARTICLES,SILK,WAVES] on the enum `ThemeKey` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `layoutAlignment` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `layoutOrder` on the `Profile` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ProfileLayout" AS ENUM ('CENTERED', 'SPLIT', 'EDITORIAL');

-- CreateEnum
CREATE TYPE "FontStyle" AS ENUM ('SANS', 'SERIF', 'MONO');

-- CreateEnum
CREATE TYPE "TextAlign" AS ENUM ('LEFT', 'CENTER', 'RIGHT');

-- AlterEnum
BEGIN;
CREATE TYPE "ThemeKey_new" AS ENUM ('MIDNIGHT', 'OCEAN', 'SUNSET', 'PAPER', 'NOIR_GOLD', 'AURORA', 'ROSE_MARBLE', 'OBSIDIAN');
ALTER TABLE "public"."Profile" ALTER COLUMN "themeKey" DROP DEFAULT;
ALTER TABLE "Profile" ALTER COLUMN "themeKey" TYPE "ThemeKey_new" USING ("themeKey"::text::"ThemeKey_new");
ALTER TYPE "ThemeKey" RENAME TO "ThemeKey_old";
ALTER TYPE "ThemeKey_new" RENAME TO "ThemeKey";
DROP TYPE "public"."ThemeKey_old";
ALTER TABLE "Profile" ALTER COLUMN "themeKey" SET DEFAULT 'MIDNIGHT';
COMMIT;

-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "layoutAlignment",
DROP COLUMN "layoutOrder",
ADD COLUMN     "backgroundObjectKey" TEXT,
ADD COLUMN     "fontStyle" "FontStyle" NOT NULL DEFAULT 'SANS',
ADD COLUMN     "layout" "ProfileLayout" NOT NULL DEFAULT 'CENTERED',
ADD COLUMN     "textAlign" "TextAlign" NOT NULL DEFAULT 'LEFT';
