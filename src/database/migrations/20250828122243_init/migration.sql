-- CreateEnum
CREATE TYPE "public"."Status" AS ENUM ('ENABLED', 'PAUSED', 'REMOVED');

-- CreateTable
CREATE TABLE "public"."Campaign" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "status" "public"."Status" NOT NULL,

    CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AdGroup" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "campaignId" INTEGER NOT NULL,
    "status" "public"."Status" NOT NULL,

    CONSTRAINT "AdGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."KeywordQuality" (
    "id" SERIAL NOT NULL,
    "keyword" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "qs" INTEGER NOT NULL,
    "adGroupId" INTEGER NOT NULL,

    CONSTRAINT "KeywordQuality_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Campaign_name_key" ON "public"."Campaign"("name");

-- CreateIndex
CREATE UNIQUE INDEX "KeywordQuality_adGroupId_keyword_date_key" ON "public"."KeywordQuality"("adGroupId", "keyword", "date");

-- AddForeignKey
ALTER TABLE "public"."AdGroup" ADD CONSTRAINT "AdGroup_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "public"."Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."KeywordQuality" ADD CONSTRAINT "KeywordQuality_adGroupId_fkey" FOREIGN KEY ("adGroupId") REFERENCES "public"."AdGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
