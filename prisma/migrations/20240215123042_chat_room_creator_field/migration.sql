/*
  Warnings:

  - A unique constraint covering the columns `[creatorId]` on the table `ChatRoom` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `creatorId` to the `ChatRoom` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ChatRoom" ADD COLUMN     "creatorId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ChatRoom_creatorId_key" ON "ChatRoom"("creatorId");
