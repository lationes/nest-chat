import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AccessTokenGuard } from '../guards/access-token.guard';
import { AddRequestService } from './add-request.service';
import { CreateAddRequestDto } from './dto/create-add-request.dto';
import { Request } from 'express';

@Controller('add-request')
export class AddRequestController {
  constructor(private readonly addRequestService: AddRequestService) {}

  @UseGuards(AccessTokenGuard)
  @Post()
  create(@Body() dto: CreateAddRequestDto, @Req() request: Request) {
    return this.addRequestService.createAddRequestWithDto(dto, request);
  }

  @UseGuards(AccessTokenGuard)
  @Post('/accept/:id')
  accept(@Param('id') id: string) {
    return this.addRequestService.acceptAddRequest(Number(id));
  }

  @UseGuards(AccessTokenGuard)
  @Get(':id')
  findAddRequestsByUserId(@Param('id') id: string) {
    return this.addRequestService.findAddRequestByUserId(Number(id));
  }

  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.addRequestService.deleteAddRequestById(Number(id));
  }
}
