-- AlterTable
ALTER TABLE "DailyReport" ALTER COLUMN "morningRating" DROP NOT NULL,
ALTER COLUMN "dayRating" DROP NOT NULL,
ALTER COLUMN "dayNotes" DROP NOT NULL,
ALTER COLUMN "morningNotes" DROP NOT NULL;
