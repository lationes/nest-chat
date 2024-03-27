import {
  Controller,
  Get,
  Param,
  Delete,
  UseGuards,
  UploadedFile,
  ParseFilePipe,
  FileTypeValidator,
  Query,
  Req,
  Body,
  Patch,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';
import { Role } from '../decorators/roles.decorator';
import { AccessTokenGuard } from '../guards/access-token.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Request } from 'express';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { BanUserDto } from './dto/ban-user.dto';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @UseGuards(AccessTokenGuard)
  @Get('')
  findAll(@Query('search') search: string) {
    return this.userService.findUsersByQuery(search);
  }

  @UseGuards(AccessTokenGuard)
  @Get('/:id')
  findOne(@Param('id') id: string) {
    return this.userService.findUserById(Number(id));
  }

  @Patch('/avatar/:id')
  @UseInterceptors(FileInterceptor('image'))
  @UseGuards(AccessTokenGuard)
  changeAvatar(
    @Param('id') id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|webp)$/ }),
        ],
      }),
    )
    avatar: Express.Multer.File,
    @Req() request: Request,
  ) {
    return this.userService.changeAvatar(Number(id), avatar, request);
  }

  @UseGuards(AccessTokenGuard)
  @Patch('/delete-avatar/:id')
  deleteAvatar(@Param('id') id: string, @Req() request: Request) {
    return this.userService.deleteAvatar(Number(id), request);
  }

  @UseGuards(AccessTokenGuard)
  @Patch('/:id')
  updateUser(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @Req() request: Request,
  ) {
    return this.userService.updateUserById(Number(id), dto, request);
  }

  @Role('ADMIN')
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Delete('/:id')
  remove(@Param('id') id: string) {
    return this.userService.deleteUserById(Number(id));
  }

  @Role('ADMIN')
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Patch('/ban/:id')
  ban(@Param('id') id: string, @Body() dto: BanUserDto) {
    return this.userService.bunUserById(Number(id), dto);
  }

  @Role('ADMIN')
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Patch('/unban/:id')
  unban(@Param('id') id: string) {
    return this.userService.unBunUserById(Number(id));
  }
}
