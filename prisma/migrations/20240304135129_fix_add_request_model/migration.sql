-- DropForeignKey
ALTER TABLE "ChatRoomAddRequest" DROP CONSTRAINT "ChatRoomAddRequest_chatRoomId_fkey";

-- DropForeignKey
ALTER TABLE "ChatRoomAddRequest" DROP CONSTRAINT "ChatRoomAddRequest_userId_fkey";

-- AlterTable
ALTER TABLE "ChatRoomAddRequest" ALTER COLUMN "userId" DROP NOT NULL,
ALTER COLUMN "chatRoomId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "ChatRoomAddRequest" ADD CONSTRAINT "ChatRoomAddRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatRoomAddRequest" ADD CONSTRAINT "ChatRoomAddRequest_chatRoomId_fkey" FOREIGN KEY ("chatRoomId") REFERENCES "ChatRoom"("id") ON DELETE SET NULL ON UPDATE CASCADE;
