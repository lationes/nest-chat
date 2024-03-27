import {
  Controller,
  Delete,
  Param,
  Post,
  Body,
  Req,
  UseGuards,
  Get,
  Patch,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { AccessTokenGuard } from '../guards/access-token.guard';
@ApiTags('Message')
@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}
  @UseGuards(AccessTokenGuard)
  @Get('/chatroom/:id')
  getByChatRoomId(@Param('id') id: string) {
    return this.messageService.findMessagesByChatRoomId(Number(id));
  }

  @UseGuards(AccessTokenGuard)
  @Post()
  create(@Body() data: CreateMessageDto, @Req() request: Request) {
    return this.messageService.addMessage(data, request);
  }
  @UseGuards(AccessTokenGuard)
  @Patch(':id')
  async updateMessage(
    @Param('id') id: string,
    @Body() dto: UpdateMessageDto,
    @Req() request: Request,
  ) {
    return this.messageService.editMessage(Number(id), dto, request);
  }
  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() request: Request) {
    return this.messageService.deleteMessageById(Number(id), request);
  }
}
