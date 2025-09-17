/*
  Warnings:

  - You are about to drop the column `date` on the `Keyword` table. All the data in the column will be lost.
  - You are about to drop the column `qs` on the `Keyword` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[criterionId,adGroupId]` on the table `Keyword` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."Keyword_criterionId_date_adGroupId_key";

-- AlterTable
ALTER TABLE "public"."Keyword" DROP COLUMN "date",
DROP COLUMN "qs";

-- CreateTable
CREATE TABLE "public"."KeywordScore" (
    "id" SERIAL NOT NULL,
    "keywordId" INTEGER NOT NULL,
    "date" DATE NOT NULL,
    "qs" INTEGER NOT NULL,

    CONSTRAINT "KeywordScore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AdGroupScore" (
    "id" SERIAL NOT NULL,
    "adGroupId" BIGINT NOT NULL,
    "date" DATE NOT NULL,
    "qs" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "AdGroupScore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CampaignScore" (
    "id" SERIAL NOT NULL,
    "campaignId" BIGINT NOT NULL,
    "date" DATE NOT NULL,
    "qs" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "CampaignScore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AccountScore" (
    "id" SERIAL NOT NULL,
    "accountId" BIGINT NOT NULL,
    "date" DATE NOT NULL,
    "qs" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "AccountScore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."GlobalDailyScore" (
    "id" SERIAL NOT NULL,
    "date" DATE NOT NULL,
    "qs" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "GlobalDailyScore_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "KeywordScore_date_idx" ON "public"."KeywordScore"("date");

-- CreateIndex
CREATE UNIQUE INDEX "KeywordScore_keywordId_date_key" ON "public"."KeywordScore"("keywordId", "date");

-- CreateIndex
CREATE INDEX "AdGroupScore_date_idx" ON "public"."AdGroupScore"("date");

-- CreateIndex
CREATE UNIQUE INDEX "AdGroupScore_adGroupId_date_key" ON "public"."AdGroupScore"("adGroupId", "date");

-- CreateIndex
CREATE INDEX "CampaignScore_date_idx" ON "public"."CampaignScore"("date");

-- CreateIndex
CREATE UNIQUE INDEX "CampaignScore_campaignId_date_key" ON "public"."CampaignScore"("campaignId", "date");

-- CreateIndex
CREATE INDEX "AccountScore_date_idx" ON "public"."AccountScore"("date");

-- CreateIndex
CREATE UNIQUE INDEX "AccountScore_accountId_date_key" ON "public"."AccountScore"("accountId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "GlobalDailyScore_date_key" ON "public"."GlobalDailyScore"("date");

-- CreateIndex
CREATE UNIQUE INDEX "Keyword_criterionId_adGroupId_key" ON "public"."Keyword"("criterionId", "adGroupId");

-- AddForeignKey
ALTER TABLE "public"."KeywordScore" ADD CONSTRAINT "KeywordScore_keywordId_fkey" FOREIGN KEY ("keywordId") REFERENCES "public"."Keyword"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AdGroupScore" ADD CONSTRAINT "AdGroupScore_adGroupId_fkey" FOREIGN KEY ("adGroupId") REFERENCES "public"."AdGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CampaignScore" ADD CONSTRAINT "CampaignScore_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "public"."Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AccountScore" ADD CONSTRAINT "AccountScore_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "public"."Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;
