import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, Prisma } from '@prisma/client';
import { FilesService } from '../files/files.service';
import { excludeField } from '../helpers/common.helpers';
import { UpdateUserDto } from './dto/update-user.dto';
import { Request } from 'express';
import { TokenDataDto } from '../token/dto/token-data.dto';
import { BanUserDto } from './dto/ban-user.dto';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private fileService: FilesService,
  ) {}

  async user(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    });
  }

  async users(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }

  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    const { where, data } = params;
    return this.prisma.user.update({
      data,
      where,
    });
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.delete({
      where,
    });
  }

  async findUsersByQuery(search: string) {
    try {
      let whereCondition = {};

      if (search) {
        whereCondition = { email: { contains: search, mode: 'insensitive' } };
      }

      const users = await this.users({
        where: whereCondition,
        orderBy: {
          id: 'asc',
        },
      });

      return users.map((user) => {
        return excludeField(user, ['password']);
      });
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async findUserById(id: number) {
    try {
      const user = await this.user({
        id,
      });

      if (!user) {
        throw new HttpException("User doesn't exist", HttpStatus.NOT_FOUND);
      }

      return excludeField(user, ['password']);
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async changeAvatar(id: number, image: Express.Multer.File, request: Request) {
    try {
      const user = await this.user({
        id,
      });

      if (!user) {
        throw new HttpException("User doesn't exist", HttpStatus.NOT_FOUND);
      }

      const isValid = await this.validateAccessToEditUser(id, request);

      if (!isValid) {
        throw new HttpException(
          'User has no access to this operation',
          HttpStatus.FORBIDDEN,
        );
      }

      if (user.avatar) {
        await this.fileService.deleteFile(user.avatar);
      }
      const fileName = await this.fileService.createFile(image);

      return await this.updateUser({
        where: { id },
        data: { ...user, avatar: fileName },
      });
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async deleteAvatar(id: number, request: Request) {
    try {
      const user = await this.user({
        id,
      });

      if (!user) {
        throw new HttpException("User doesn't exist", HttpStatus.NOT_FOUND);
      }

      const isValid = await this.validateAccessToEditUser(id, request);

      if (!isValid) {
        throw new HttpException(
          'User has no access to this operation',
          HttpStatus.FORBIDDEN,
        );
      }

      await this.fileService.deleteFile(user.avatar);

      return await this.updateUser({
        where: { id },
        data: { ...user, avatar: null },
      });
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async updateUserById(id: number, dto: UpdateUserDto, request: Request) {
    try {
      const user = await this.user({
        id,
      });

      if (!user) {
        throw new HttpException("User doesn't exist", HttpStatus.NOT_FOUND);
      }

      const isValid = await this.validateAccessToEditUser(id, request);

      if (!isValid) {
        throw new HttpException(
          'User has no access to this operation',
          HttpStatus.FORBIDDEN,
        );
      }

      const userByNewEmail = await this.user({
        ...dto,
      });

      if (userByNewEmail && user.id !== userByNewEmail.id) {
        throw new HttpException(
          'User with such email already exist',
          HttpStatus.FORBIDDEN,
        );
      }

      return await this.updateUser({
        where: { id },
        data: { ...user, ...dto },
      });
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async deleteUserById(id: number) {
    try {
      return await this.deleteUser({
        id,
      });
    } catch (e) {
      console.log(e);
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async bunUserById(id: number, dto: BanUserDto) {
    try {
      const userToBan = await this.user({
        id,
      });

      if (userToBan.role === 'ADMIN') {
        throw new HttpException(
          "You can't ban user with admin role",
          HttpStatus.FORBIDDEN,
        );
      }

      return await this.updateUser({
        where: {
          id,
        },
        data: {
          banned: true,
          banReason: dto.reason,
        },
      });
    } catch (e) {
      console.log(e);
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async unBunUserById(id: number) {
    try {
      const userToBan = await this.user({
        id,
      });

      if (userToBan.role === 'ADMIN') {
        throw new HttpException(
          "You can't ban user with admin role",
          HttpStatus.FORBIDDEN,
        );
      }

      return await this.updateUser({
        where: {
          id,
        },
        data: {
          banned: false,
          banReason: null,
        },
      });
    } catch (e) {
      console.log(e);
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async validateAccessToEditUser(userId: number, request: Request) {
    const user = await this.user({
      id: userId,
    });
    const { id, role } = request.user as TokenDataDto;

    return user.id === id || role === 'ADMIN';
  }
}
