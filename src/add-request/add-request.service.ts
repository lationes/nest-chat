import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ChatRoomAddRequest, Prisma } from '@prisma/client';
import { CreateAddRequestDto } from './dto/create-add-request.dto';
import { ChatroomService } from '../chatroom/chatroom.service';
import { UserService } from '../user/user.service';
import { TokenDataDto } from '../token/dto/token-data.dto';
import { Request } from 'express';

@Injectable()
export class AddRequestService {
  constructor(
    private prisma: PrismaService,
    private chatRoomService: ChatroomService,
    private userService: UserService,
  ) {}

  async addRequest(
    addRequestUniqueInput?: Prisma.ChatRoomAddRequestWhereUniqueInput,
  ): Promise<ChatRoomAddRequest | null> {
    return this.prisma.chatRoomAddRequest.findUnique({
      where: addRequestUniqueInput,
    });
  }

  async addRequests(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.ChatRoomAddRequestWhereUniqueInput;
    where?: Prisma.ChatRoomAddRequestWhereInput;
    orderBy?: Prisma.ChatRoomAddRequestOrderByWithRelationInput;
  }): Promise<ChatRoomAddRequest[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.chatRoomAddRequest.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createAddRequest(
    data: Prisma.ChatRoomAddRequestCreateInput,
  ): Promise<ChatRoomAddRequest> {
    return this.prisma.chatRoomAddRequest.create({
      data,
    });
  }

  async updateAddRequest(params: {
    where: Prisma.ChatRoomAddRequestWhereUniqueInput;
    data: Prisma.ChatRoomAddRequestUpdateInput;
  }): Promise<ChatRoomAddRequest> {
    const { data, where } = params;
    return this.prisma.chatRoomAddRequest.update({
      data,
      where,
    });
  }

  async deleteAddRequest(
    where: Prisma.ChatRoomAddRequestWhereUniqueInput,
  ): Promise<ChatRoomAddRequest> {
    return this.prisma.chatRoomAddRequest.delete({
      where,
    });
  }

  async findAddRequestByUserId(id: number) {
    try {
      return await this.addRequests({
        where: {
          userId: id,
        },
      });
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async createAddRequestWithDto(dto: CreateAddRequestDto, request: Request) {
    try {
      const { id } = request.user as TokenDataDto;

      const user = await this.userService.findUserById(dto.userId);
      const chatRoom = await this.chatRoomService.findChatRoomById(
        dto.chatRoomId,
      );

      if (!user) {
        throw new HttpException(
          "User which you want to add to chat room doesn't exist",
          HttpStatus.NOT_FOUND,
        );
      }

      if (!chatRoom) {
        throw new HttpException(
          "Chat room to which you want create add request doesn't exist",
          HttpStatus.NOT_FOUND,
        );
      }

      const isUserConnected = await this.checkUserConnectedToChatRoom(
        dto.userId,
        dto.chatRoomId,
      );

      if (isUserConnected) {
        throw new HttpException(
          'User is already connected to this chatroom',
          HttpStatus.FORBIDDEN,
        );
      }

      const existingAddRequestData = await this.addRequests({
        where: {
          ...dto,
        },
      });

      if (!!existingAddRequestData?.length) {
        throw new HttpException(
          'Such add request already exist',
          HttpStatus.FORBIDDEN,
        );
      }

      const addRequestData = await this.createAddRequest({
        authorId: Number(id),
        user: {
          connect: {
            id: dto.userId,
          },
        },
        chatRoom: {
          connect: {
            id: dto.chatRoomId,
          },
        },
      });

      return addRequestData;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async acceptAddRequest(id: number) {
    try {
      const addRequestData = await this.addRequest({
        id,
      });

      await this.chatRoomService.connectUserToChatRoomByDto({
        userId: addRequestData.userId,
        chatRoomId: addRequestData.chatRoomId,
      });

      return await this.deleteAddRequestById(id);
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async deleteAddRequestById(id: number) {
    try {
      const request = await this.deleteAddRequest({
        id,
      });

      return request;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async checkUserConnectedToChatRoom(userId: number, chatRoomId: number) {
    const userOnChatRoom = await this.prisma.chatRoomsOnUsers.findUnique({
      where: {
        userId_chatRoomId: {
          userId,
          chatRoomId,
        },
      },
    });

    return !!userOnChatRoom;
  }
}
