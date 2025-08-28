/*
  Warnings:

  - The primary key for the `AdGroup` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Campaign` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `KeywordQuality` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `KeywordQuality` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[criterionId,date]` on the table `KeywordQuality` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `criterionId` to the `KeywordQuality` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."AdGroup" DROP CONSTRAINT "AdGroup_campaignId_fkey";

-- DropForeignKey
ALTER TABLE "public"."KeywordQuality" DROP CONSTRAINT "KeywordQuality_adGroupId_fkey";

-- DropIndex
DROP INDEX "public"."KeywordQuality_adGroupId_keyword_date_key";

-- AlterTable
ALTER TABLE "public"."AdGroup" DROP CONSTRAINT "AdGroup_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE BIGINT,
ALTER COLUMN "campaignId" SET DATA TYPE BIGINT,
ADD CONSTRAINT "AdGroup_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "AdGroup_id_seq";

-- AlterTable
ALTER TABLE "public"."Campaign" DROP CONSTRAINT "Campaign_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE BIGINT,
ADD CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Campaign_id_seq";

-- AlterTable
ALTER TABLE "public"."KeywordQuality" DROP CONSTRAINT "KeywordQuality_pkey",
DROP COLUMN "id",
ADD COLUMN     "criterionId" BIGINT NOT NULL,
ALTER COLUMN "adGroupId" SET DATA TYPE BIGINT,
ADD CONSTRAINT "KeywordQuality_pkey" PRIMARY KEY ("criterionId");

-- CreateIndex
CREATE UNIQUE INDEX "KeywordQuality_criterionId_date_key" ON "public"."KeywordQuality"("criterionId", "date");

-- AddForeignKey
ALTER TABLE "public"."AdGroup" ADD CONSTRAINT "AdGroup_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "public"."Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."KeywordQuality" ADD CONSTRAINT "KeywordQuality_adGroupId_fkey" FOREIGN KEY ("adGroupId") REFERENCES "public"."AdGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
