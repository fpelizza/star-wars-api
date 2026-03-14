/*
  Warnings:

  - A unique constraint covering the columns `[swapiId]` on the table `Film` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Film" ADD COLUMN     "description" TEXT,
ADD COLUMN     "swapiId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Film_swapiId_key" ON "Film"("swapiId");
