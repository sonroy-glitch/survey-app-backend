/*
  Warnings:

  - Added the required column `survey_id` to the `Vote` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Vote" ADD COLUMN     "survey_id" INTEGER NOT NULL;
