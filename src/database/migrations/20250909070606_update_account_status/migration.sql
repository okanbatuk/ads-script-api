/*
  Warnings:

  - The values [ACTIVE] on the enum `AccountStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."AccountStatus_new" AS ENUM ('ENABLED', 'CANCELLED', 'SUSPENDED', 'UNKNOWN');
ALTER TABLE "public"."Account" ALTER COLUMN "status" TYPE "public"."AccountStatus_new" USING ("status"::text::"public"."AccountStatus_new");
ALTER TYPE "public"."AccountStatus" RENAME TO "AccountStatus_old";
ALTER TYPE "public"."AccountStatus_new" RENAME TO "AccountStatus";
DROP TYPE "public"."AccountStatus_old";
COMMIT;
