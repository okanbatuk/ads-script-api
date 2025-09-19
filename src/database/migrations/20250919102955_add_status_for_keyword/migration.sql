/*
  Warnings:

  - Added the required column `status` to the `Keyword` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Keyword" ADD COLUMN     "status" "public"."Status" NOT NULL;
