ALTER TABLE "Profile"
ADD COLUMN "contactCardEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "contactEmail" TEXT,
ADD COLUMN "contactPhone" TEXT,
ADD COLUMN "contactCompany" TEXT,
ADD COLUMN "contactTitle" TEXT;
