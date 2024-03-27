import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Message, Prisma } from '@prisma/client';
import { CreateMessageDto } from './dto/create-message.dto';
import { Request } from 'express';
import { UpdateMessageDto } from './dto/update-message.dto';
import { TokenDataDto } from '../token/dto/token-data.dto';

@Injectable()
export class MessageService {
  constructor(private prisma: PrismaService) {}

  async message(
    messageWhereUniqueInput: Prisma.MessageWhereUniqueInput,
  ): Promise<Message | null> {
    return this.prisma.message.findUnique({
      where: messageWhereUniqueInput,
    });
  }

  async messages(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.MessageWhereUniqueInput;
    where?: Prisma.MessageWhereInput;
    orderBy?: Prisma.MessageOrderByWithRelationInput;
  }): Promise<Message[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.message.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createMessage(data: Prisma.MessageCreateInput): Promise<Message> {
    return this.prisma.message.create({
      data,
    });
  }

  async updateMessage(params: {
    where: Prisma.MessageWhereUniqueInput;
    data: Prisma.MessageUpdateInput;
  }): Promise<Message> {
    const { data, where } = params;
    return this.prisma.message.update({
      data,
      where,
    });
  }

  async deleteMessage(where: Prisma.MessageWhereUniqueInput): Promise<Message> {
    return this.prisma.message.delete({
      where,
    });
  }

  async findMessagesByChatRoomId(chatRoomId: number) {
    try {
      return await this.messages({
        where: {
          chatRoomId,
        },
        orderBy: {
          id: 'asc',
        },
      });
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async addMessage(data: CreateMessageDto, request: Request) {
    try {
      const { id } = request.user as TokenDataDto;

      return this.createMessage({
        content: data.content,
        author: {
          connect: {
            id: Number(id),
          },
        },
        chatRoom: {
          connect: {
            id: data.chatRoomId,
          },
        },
      });
    } catch (e) {
      console.log(e);
      return new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async editMessage(
    messageId: number,
    updateMessageDto: UpdateMessageDto,
    request: Request,
  ) {
    try {
      const isValid = await this.validateAccessToMessage(messageId, request);

      if (!isValid) {
        throw new HttpException(
          'User has no access to this operation',
          HttpStatus.FORBIDDEN,
        );
      }

      return await this.updateMessage({
        where: { id: Number(messageId) },
        data: { ...updateMessageDto },
      });
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async deleteMessageById(messageId: number, request: Request) {
    try {
      const isValid = await this.validateAccessToMessage(messageId, request);

      if (!isValid) {
        throw new HttpException(
          'User has no access to this operation',
          HttpStatus.FORBIDDEN,
        );
      }

      return await this.deleteMessage({
        id: +messageId,
      });
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async validateAccessToMessage(messageId: number, request: Request) {
    const currentMessage = await this.message({
      id: messageId,
    });
    const { id, role } = request.user as TokenDataDto;

    return currentMessage.authorId === id || role === 'ADMIN';
  }
}
