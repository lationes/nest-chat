/*
  Warnings:

  - Made the column `userId` on table `ChatRoomAddRequest` required. This step will fail if there are existing NULL values in that column.
  - Made the column `chatRoomId` on table `ChatRoomAddRequest` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "ChatRoomAddRequest" DROP CONSTRAINT "ChatRoomAddRequest_chatRoomId_fkey";

-- DropForeignKey
ALTER TABLE "ChatRoomAddRequest" DROP CONSTRAINT "ChatRoomAddRequest_userId_fkey";

-- AlterTable
ALTER TABLE "ChatRoomAddRequest" ALTER COLUMN "userId" SET NOT NULL,
ALTER COLUMN "chatRoomId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "ChatRoomAddRequest" ADD CONSTRAINT "ChatRoomAddRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatRoomAddRequest" ADD CONSTRAINT "ChatRoomAddRequest_chatRoomId_fkey" FOREIGN KEY ("chatRoomId") REFERENCES "ChatRoom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
