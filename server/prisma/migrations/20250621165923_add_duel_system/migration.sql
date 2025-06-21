-- AlterTable
ALTER TABLE "Meme" ALTER COLUMN "caption" DROP NOT NULL,
ALTER COLUMN "price" SET DEFAULT 0.0;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "ethBalance" DOUBLE PRECISION NOT NULL DEFAULT 500.0,
ADD COLUMN     "points" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "Duel" (
    "id" SERIAL NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endTime" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "memeAId" INTEGER NOT NULL,
    "memeBId" INTEGER NOT NULL,
    "winnerId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Duel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bid" (
    "id" SERIAL NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "userId" INTEGER NOT NULL,
    "duelId" INTEGER NOT NULL,
    "memeId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Bid_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Duel_memeAId_idx" ON "Duel"("memeAId");

-- CreateIndex
CREATE INDEX "Duel_memeBId_idx" ON "Duel"("memeBId");

-- CreateIndex
CREATE INDEX "Bid_userId_idx" ON "Bid"("userId");

-- CreateIndex
CREATE INDEX "Bid_duelId_idx" ON "Bid"("duelId");

-- CreateIndex
CREATE INDEX "Bid_memeId_idx" ON "Bid"("memeId");

-- AddForeignKey
ALTER TABLE "Duel" ADD CONSTRAINT "Duel_memeAId_fkey" FOREIGN KEY ("memeAId") REFERENCES "Meme"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Duel" ADD CONSTRAINT "Duel_memeBId_fkey" FOREIGN KEY ("memeBId") REFERENCES "Meme"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bid" ADD CONSTRAINT "Bid_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bid" ADD CONSTRAINT "Bid_duelId_fkey" FOREIGN KEY ("duelId") REFERENCES "Duel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bid" ADD CONSTRAINT "Bid_memeId_fkey" FOREIGN KEY ("memeId") REFERENCES "Meme"("id") ON DELETE CASCADE ON UPDATE CASCADE;
