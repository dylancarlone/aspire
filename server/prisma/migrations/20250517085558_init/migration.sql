-- AlterTable
ALTER TABLE "Repository" ADD COLUMN     "latestReleaseDate" TIMESTAMP(3),
ADD COLUMN     "latestReleaseNotes" TEXT,
ADD COLUMN     "latestReleaseTag" TEXT;
