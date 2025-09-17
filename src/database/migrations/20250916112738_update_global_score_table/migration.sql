/*
  Warnings:

  - You are about to drop the `GlobalDailyScore` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "public"."GlobalDailyScore";

-- CreateTable
CREATE TABLE "public"."GlobalScore" (
    "id" SERIAL NOT NULL,
    "date" DATE NOT NULL,
    "qs" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "GlobalScore_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GlobalScore_date_key" ON "public"."GlobalScore"("date");
