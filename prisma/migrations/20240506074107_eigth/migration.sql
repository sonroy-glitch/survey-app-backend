/*
  Warnings:

  - The `username` column on the `Vote` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Vote" ADD COLUMN     "voteValue" INTEGER NOT NULL DEFAULT 0,
DROP COLUMN "username",
ADD COLUMN     "username" TEXT[];
