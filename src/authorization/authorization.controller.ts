import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthorizationService } from './authorization.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { Request, Response } from 'express';
import { RefreshTokenGuard } from '../guards/refresh-token.guard';
import { AccessTokenGuard } from '../guards/access-token.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Authorization')
@Controller('authorization')
export class AuthorizationController {
  constructor(private readonly authorizationService: AuthorizationService) {}

  @Post('/login')
  login(@Body() userDto: CreateUserDto, @Res() response: Response) {
    return this.authorizationService.login(userDto, response);
  }

  @Post('/registration')
  registration(@Body() userDto: CreateUserDto, @Res() response: Response) {
    return this.authorizationService.registration(userDto, response);
  }

  @UseGuards(AccessTokenGuard)
  @Post('/logout')
  logout(@Req() request: Request, @Res() response: Response) {
    return this.authorizationService.logout(request, response);
  }

  @UseGuards(RefreshTokenGuard)
  @Post('/refresh')
  refresh(@Req() request: Request, @Res() response: Response) {
    return this.authorizationService.refresh(request, response);
  }
}
