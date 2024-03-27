import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { Request, Response } from 'express';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { TokenDataDto } from '../token/dto/token-data.dto';
import { User } from '@prisma/client';
import { TokenService } from '../token/token.service';
import { excludeField } from '../helpers/common.helpers';

@Injectable()
export class AuthorizationService {
  constructor(
    private jwtService: JwtService,
    private readonly configService: ConfigService,
    private userService: UserService,
    private tokenService: TokenService,
  ) {}

  async login(userDto: CreateUserDto, response: Response) {
    try {
      const user = await this.validateUser(userDto);
      const { accessToken, refreshToken } = await this.saveRefreshToken(
        Number(user.id),
      );

      response.status(HttpStatus.OK).send({
        accessToken,
        refreshToken,
        user: excludeField(user, ['password']),
      });
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async registration(userDto: CreateUserDto, response: Response) {
    try {
      const candidate = await this.userService.user({
        email: userDto.email,
      });

      if (candidate) {
        throw new HttpException(
          'User with this email already exist',
          HttpStatus.BAD_REQUEST,
        );
      }

      const hashPassword = await bcrypt.hash(userDto.password, 5);
      const user = await this.userService.createUser({
        ...userDto,
        password: hashPassword,
        role: 'USER',
      });

      const { accessToken, refreshToken } = await this.saveRefreshToken(
        Number(user.id),
      );

      response.status(HttpStatus.OK).send({
        accessToken,
        refreshToken,
        user: excludeField(user, ['password']),
      });
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async logout(request: Request, response: Response) {
    try {
      const { id } = request.user as TokenDataDto;

      const tokenData = await this.tokenService.token({
        userId: Number(id),
      });

      if (!tokenData) {
        throw new UnauthorizedException({ message: 'User is unauthorized' });
      }

      await this.tokenService.deleteToken({
        userId: Number(id),
      });

      response.status(HttpStatus.OK).send({ message: 'Logout successfully' });
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async refresh(request: Request, response: Response) {
    try {
      const { id } = request.user as TokenDataDto;

      const tokenData = await this.tokenService.token({
        userId: Number(id),
      });

      if (!tokenData) {
        return new UnauthorizedException({ message: 'User is unauthorized' });
      }

      const { accessToken, refreshToken } = await this.saveRefreshToken(
        Number(id),
      );

      response.status(HttpStatus.OK).send({ accessToken, refreshToken });
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  private async generateTokens(user: User) {
    const payload: TokenDataDto = {
      email: user.email,
      id: user.id,
      role: user.role,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
        expiresIn: '30m',
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
        expiresIn: '7d',
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  private async validateUser(userDto: CreateUserDto) {
    const user = await this.userService.user({
      email: userDto.email,
    });

    if (!user) {
      throw new NotFoundException({
        message: "User with such email doesn't exist",
      });
    }

    const passwordEquals = await bcrypt.compare(
      userDto.password,
      user.password,
    );

    if (user && passwordEquals) {
      return user;
    }

    throw new UnauthorizedException({ message: 'Incorrect password or email' });
  }

  private async saveRefreshToken(userId: number) {
    const user = await this.userService.user({
      id: userId,
    });

    if (user) {
      const { accessToken, refreshToken } = await this.generateTokens(user);

      const savedRefreshToken = await this.tokenService.token({
        userId,
      });

      if (savedRefreshToken) {
        await this.tokenService.updateToken({
          data: { token: refreshToken },
          where: { userId },
        });
      } else {
        await this.tokenService.createToken({
          token: refreshToken,
          user: {
            connect: {
              id: userId,
            },
          },
        });
      }

      return { accessToken, refreshToken };
    }

    throw new HttpException('There is no such user', HttpStatus.NOT_FOUND);
  }
}
