/*
  Warnings:

  - You are about to drop the column `userId` on the `DailyReport` table. All the data in the column will be lost.
  - Added the required column `reportedById` to the `DailyReport` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "DailyReport" DROP CONSTRAINT "DailyReport_userId_fkey";

-- AlterTable
ALTER TABLE "DailyReport" DROP COLUMN "userId",
ADD COLUMN     "reportedById" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "DailyReport" ADD CONSTRAINT "DailyReport_reportedById_fkey" FOREIGN KEY ("reportedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
