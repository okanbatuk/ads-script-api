/*
  Warnings:

  - You are about to drop the `KeywordQuality` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."KeywordQuality" DROP CONSTRAINT "KeywordQuality_adGroupId_fkey";

-- DropTable
DROP TABLE "public"."KeywordQuality";

-- CreateTable
CREATE TABLE "public"."Keyword" (
    "criterionId" BIGINT NOT NULL,
    "keyword" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "qs" INTEGER NOT NULL,
    "adGroupId" BIGINT NOT NULL,

    CONSTRAINT "Keyword_pkey" PRIMARY KEY ("criterionId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Keyword_criterionId_date_key" ON "public"."Keyword"("criterionId", "date");

-- AddForeignKey
ALTER TABLE "public"."Keyword" ADD CONSTRAINT "Keyword_adGroupId_fkey" FOREIGN KEY ("adGroupId") REFERENCES "public"."AdGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
