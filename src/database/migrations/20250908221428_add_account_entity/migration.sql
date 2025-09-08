/*
  Warnings:

  - Added the required column `accountId` to the `Campaign` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."AccountStatus" AS ENUM ('ACTIVE', 'CANCELLED', 'SUSPENDED', 'UNKNOWN');

-- AlterTable
ALTER TABLE "public"."Campaign" ADD COLUMN     "accountId" BIGINT NOT NULL;

-- CreateTable
CREATE TABLE "public"."Account" (
    "id" BIGINT NOT NULL,
    "name" TEXT NOT NULL,
    "status" "public"."AccountStatus" NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Campaign" ADD CONSTRAINT "Campaign_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "public"."Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
