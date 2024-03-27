import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { ChatroomService } from './chatroom.service';
import { CreateChatroomDto } from './dto/create-chatroom.dto';
import { UpdateChatroomDto } from './dto/update-chatroom.dto';
import { ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from '../guards/access-token.guard';
import { Request } from 'express';

@ApiTags('Chatroom')
@Controller('chatroom')
export class ChatroomController {
  constructor(private readonly chatroomService: ChatroomService) {}
  @UseGuards(AccessTokenGuard)
  @Post()
  create(
    @Body() createChatroomDto: CreateChatroomDto,
    @Req() request: Request,
  ) {
    return this.chatroomService.createChatRoomWithDto(
      createChatroomDto,
      request,
    );
  }
  @UseGuards(AccessTokenGuard)
  @Get('')
  findAll(@Query('search') search: string) {
    return this.chatroomService.findChatRoomsByQuery(search);
  }
  @UseGuards(AccessTokenGuard)
  @Get('/user/:userId')
  findAllByUserId(
    @Param('userId') userId: string,
    @Query('search') search: string,
  ) {
    return this.chatroomService.findChatRoomsByUserIdAndQuery(userId, search);
  }

  @UseGuards(AccessTokenGuard)
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.chatroomService.findChatRoomById(Number(id));
  }
  @UseGuards(AccessTokenGuard)
  @Get('/unique/:uniqId')
  findByUniqId(@Param('id') id: string) {
    return this.chatroomService.findChatRoomByUniqId(id);
  }
  @UseGuards(AccessTokenGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateChatroomDto: UpdateChatroomDto,
    @Req() request: Request,
  ) {
    return this.chatroomService.updateChatRoomData(
      Number(id),
      updateChatroomDto,
      request,
    );
  }
  @UseGuards(AccessTokenGuard)
  @Patch('/connect/:id')
  connect(@Param('id') id: string, @Req() request: Request) {
    return this.chatroomService.connectUserToChatRoom(Number(id), request);
  }
  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() request: Request) {
    return this.chatroomService.deleteChatRoomById(Number(id), request);
  }
}
