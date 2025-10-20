/*
  Warnings:

  - A unique constraint covering the columns `[mccId,date]` on the table `GlobalScore` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `mccId` to the `GlobalScore` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GlobalScore" ADD COLUMN     "mccId" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "GlobalScore_date_idx" ON "GlobalScore"("date");

-- CreateIndex
CREATE UNIQUE INDEX "GlobalScore_mccId_date_key" ON "GlobalScore"("mccId", "date");

-- AddForeignKey
ALTER TABLE "GlobalScore" ADD CONSTRAINT "GlobalScore_mccId_fkey" FOREIGN KEY ("mccId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;
