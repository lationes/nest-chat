/*
  Warnings:

  - A unique constraint covering the columns `[uniqId]` on the table `ChatRoom` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ChatRoom_uniqId_key" ON "ChatRoom"("uniqId");
