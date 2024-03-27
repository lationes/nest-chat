import { Module } from '@nestjs/common';
import { AddRequestService } from './add-request.service';
import { UserModule } from '../user/user.module';
import { ChatroomModule } from '../chatroom/chatroom.module';
import { AddRequestController } from './add-request.controller';

@Module({
  imports: [UserModule, ChatroomModule],
  providers: [AddRequestService],
  controllers: [AddRequestController],
  exports: [AddRequestService],
})
export class AddRequestModule {}
