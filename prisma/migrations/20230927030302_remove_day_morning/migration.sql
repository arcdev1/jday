/*
  Warnings:

  - You are about to drop the column `dayNotes` on the `DailyReport` table. All the data in the column will be lost.
  - You are about to drop the column `dayRating` on the `DailyReport` table. All the data in the column will be lost.
  - You are about to drop the column `morningNotes` on the `DailyReport` table. All the data in the column will be lost.
  - You are about to drop the column `morningRating` on the `DailyReport` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "DailyReport" DROP COLUMN "dayNotes",
DROP COLUMN "dayRating",
DROP COLUMN "morningNotes",
DROP COLUMN "morningRating";
