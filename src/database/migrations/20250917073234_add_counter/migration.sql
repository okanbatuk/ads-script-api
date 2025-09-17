/*
  Warnings:

  - Added the required column `campaignCount` to the `AccountScore` table without a default value. This is not possible if the table is not empty.
  - Added the required column `keywordCount` to the `AdGroupScore` table without a default value. This is not possible if the table is not empty.
  - Added the required column `adGroupCount` to the `CampaignScore` table without a default value. This is not possible if the table is not empty.
  - Added the required column `accountCount` to the `GlobalScore` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."AccountScore" ADD COLUMN     "campaignCount" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."AdGroupScore" ADD COLUMN     "keywordCount" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."CampaignScore" ADD COLUMN     "adGroupCount" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."GlobalScore" ADD COLUMN     "accountCount" INTEGER NOT NULL;
