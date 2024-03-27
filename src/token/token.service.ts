import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Token, Prisma } from '@prisma/client';

@Injectable()
export class TokenService {
  constructor(private prisma: PrismaService) {}

  async token(
    tokenWhereUniqueInput: Prisma.TokenWhereUniqueInput,
  ): Promise<Token | null> {
    return this.prisma.token.findUnique({
      where: tokenWhereUniqueInput,
    });
  }

  async tokens(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.TokenWhereUniqueInput;
    where?: Prisma.TokenWhereInput;
    orderBy?: Prisma.TokenOrderByWithRelationInput;
  }): Promise<Token[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.token.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createToken(data: Prisma.TokenCreateInput): Promise<Token> {
    return this.prisma.token.create({
      data,
    });
  }

  async updateToken(params: {
    where: Prisma.TokenWhereUniqueInput;
    data: Prisma.TokenUpdateInput;
  }): Promise<Token> {
    const { where, data } = params;
    return this.prisma.token.update({
      data,
      where,
    });
  }

  async deleteToken(where: Prisma.TokenWhereUniqueInput): Promise<Token> {
    return this.prisma.token.delete({
      where,
    });
  }
}
