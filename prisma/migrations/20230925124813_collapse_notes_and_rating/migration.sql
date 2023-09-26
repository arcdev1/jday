/*
  Warnings:

  - Added the required column `rating` to the `DailyReport` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DailyReport" ADD COLUMN     "notes" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "rating" "Rating" NOT NULL;
