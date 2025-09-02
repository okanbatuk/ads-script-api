/*
  Warnings:

  - The primary key for the `Keyword` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[keyword,date,adGroupId]` on the table `Keyword` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."Keyword_criterionId_date_key";

-- AlterTable
ALTER TABLE "public"."Keyword" DROP CONSTRAINT "Keyword_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Keyword_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "Keyword_keyword_date_adGroupId_key" ON "public"."Keyword"("keyword", "date", "adGroupId");
