/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Duel` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Duel` table. All the data in the column will be lost.
  - You are about to drop the column `winnerId` on the `Duel` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Duel" DROP CONSTRAINT "Duel_memeAId_fkey";

-- DropForeignKey
ALTER TABLE "Duel" DROP CONSTRAINT "Duel_memeBId_fkey";

-- DropIndex
DROP INDEX "Duel_memeAId_idx";

-- DropIndex
DROP INDEX "Duel_memeBId_idx";

-- AlterTable
ALTER TABLE "Duel" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
DROP COLUMN "winnerId",
ALTER COLUMN "startTime" DROP NOT NULL,
ALTER COLUMN "startTime" DROP DEFAULT,
ALTER COLUMN "endTime" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Duel" ADD CONSTRAINT "Duel_memeAId_fkey" FOREIGN KEY ("memeAId") REFERENCES "Meme"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Duel" ADD CONSTRAINT "Duel_memeBId_fkey" FOREIGN KEY ("memeBId") REFERENCES "Meme"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
