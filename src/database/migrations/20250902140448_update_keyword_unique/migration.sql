/*
  Warnings:

  - A unique constraint covering the columns `[criterionId,date,adGroupId]` on the table `Keyword` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."Keyword_keyword_date_adGroupId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Keyword_criterionId_date_adGroupId_key" ON "public"."Keyword"("criterionId", "date", "adGroupId");
