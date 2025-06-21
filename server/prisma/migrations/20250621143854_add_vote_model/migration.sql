-- CreateTable
CREATE TABLE "Vote" (
    "id" SERIAL NOT NULL,
    "value" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "memeId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Vote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Vote_userId_memeId_key" ON "Vote"("userId", "memeId");

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_memeId_fkey" FOREIGN KEY ("memeId") REFERENCES "Meme"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
