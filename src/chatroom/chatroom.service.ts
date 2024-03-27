import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ChatRoom, Prisma } from '@prisma/client';
import { CreateChatroomDto } from './dto/create-chatroom.dto';
import { Request } from 'express';
import { UpdateChatroomDto } from './dto/update-chatroom.dto';
import { TokenDataDto } from '../token/dto/token-data.dto';
import { md5, now } from '../helpers/common.helpers';
import { CreateAddRequestDto } from '../add-request/dto/create-add-request.dto';

@Injectable()
export class ChatroomService {
  constructor(private prisma: PrismaService) {}

  async chatRoom(
    chatRoomWhereUniqueInput?: Prisma.ChatRoomWhereUniqueInput,
  ): Promise<ChatRoom | null> {
    return this.prisma.chatRoom.findUnique({
      where: chatRoomWhereUniqueInput,
      include: {
        users: true,
      },
    });
  }

  async chatRooms(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.ChatRoomWhereUniqueInput;
    where?: Prisma.ChatRoomWhereInput;
    orderBy?: Prisma.ChatRoomOrderByWithRelationInput;
  }): Promise<ChatRoom[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.chatRoom.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include: {
        users: true,
      },
    });
  }

  async createChatRoom(data: Prisma.ChatRoomCreateInput): Promise<ChatRoom> {
    return this.prisma.chatRoom.create({
      data,
    });
  }

  async updateChatRoom(params: {
    where: Prisma.ChatRoomWhereUniqueInput;
    data: Prisma.ChatRoomUpdateInput;
  }): Promise<ChatRoom> {
    const { data, where } = params;
    return this.prisma.chatRoom.update({
      data,
      where,
    });
  }

  async deleteChatRoom(
    where: Prisma.ChatRoomWhereUniqueInput,
  ): Promise<ChatRoom> {
    return this.prisma.chatRoom.delete({
      where,
    });
  }

  async findChatRoomsByQuery(search: string) {
    try {
      let whereCondition = {};

      if (search) {
        whereCondition = { title: { contains: search, mode: 'insensitive' } };
      }

      return await this.chatRooms({
        where: whereCondition,
        orderBy: {
          id: 'asc',
        },
      });
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async findChatRoomsByUserIdAndQuery(userId: string, search: string) {
    try {
      let whereCondition = {};

      if (search) {
        whereCondition = { title: { contains: search, mode: 'insensitive' } };
      }

      return await this.chatRooms({
        where: {
          ...whereCondition,
          users: {
            some: {
              userId: Number(userId),
            },
          },
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

  async findChatRoomById(id: number) {
    try {
      const chatRoom = await this.chatRoom({
        id,
      });

      if (!chatRoom) {
        throw new HttpException(
          "Chat room doesn't exist",
          HttpStatus.NOT_FOUND,
        );
      }

      return chatRoom;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async findChatRoomByUniqId(uniqId: string) {
    try {
      const chatRoom = await this.chatRoom({
        uniqId,
      });

      if (!chatRoom) {
        throw new HttpException(
          "Chat room doesn't exist",
          HttpStatus.NOT_FOUND,
        );
      }

      return chatRoom;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async createChatRoomWithDto(dto: CreateChatroomDto, request: Request) {
    try {
      const uniqId = md5(dto.title + now('micro'));

      const { id } = request.user as TokenDataDto;

      if (!id) {
        throw new UnauthorizedException({ message: 'User is unauthorized' });
      }

      const chatRoom = await this.createChatRoom({
        ...dto,
        uniqId,
        creatorId: id,
      });

      return await this.connectUserToChatRoom(chatRoom.id, request);
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async updateChatRoomData(
    chatRoomId: number,
    updateChatroomDto: UpdateChatroomDto,
    request: Request,
  ) {
    try {
      const isValid = await this.validateAccessToChatRoom(chatRoomId, request);

      if (!isValid) {
        throw new HttpException(
          'User has no access to this operation',
          HttpStatus.FORBIDDEN,
        );
      }

      return await this.updateChatRoom({
        where: { id: Number(chatRoomId) },
        data: { ...updateChatroomDto },
      });
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async connectUserToChatRoom(chatRoomId: number, request: Request) {
    try {
      const { id } = request.user as TokenDataDto;

      return await this.updateChatRoom({
        where: { id: Number(chatRoomId) },
        data: {
          users: {
            connectOrCreate: {
              where: {
                userId_chatRoomId: {
                  userId: Number(id),
                  chatRoomId: chatRoomId,
                },
              },
              create: {
                userId: Number(id),
              },
            },
          },
        },
      });
    } catch (e) {
      console.log(e);
      return new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async connectUserToChatRoomByDto(dto: CreateAddRequestDto) {
    try {
      return await this.updateChatRoom({
        where: { id: Number(dto.chatRoomId) },
        data: {
          users: {
            connectOrCreate: {
              where: {
                userId_chatRoomId: {
                  userId: Number(dto.userId),
                  chatRoomId: dto.chatRoomId,
                },
              },
              create: {
                userId: Number(dto.userId),
              },
            },
          },
        },
      });
    } catch (e) {
      console.log(e);
      return new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteChatRoomById(chatRoomId: number, request: Request) {
    try {
      const isValid = await this.validateAccessToChatRoom(chatRoomId, request);

      if (!isValid) {
        throw new HttpException(
          'User has no access to this operation',
          HttpStatus.FORBIDDEN,
        );
      }

      return await this.deleteChatRoom({
        id: +chatRoomId,
      });
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async validateAccessToChatRoom(chatRoomId: number, request: Request) {
    const chatRoom = await this.chatRoom({
      id: chatRoomId,
    });
    const { id, role } = request.user as TokenDataDto;

    return chatRoom.creatorId === id || role === 'ADMIN';
  }
}
