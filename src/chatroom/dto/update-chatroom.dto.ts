import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateChatroomDto } from './create-chatroom.dto';
import { IsString } from 'class-validator';

export class UpdateChatroomDto extends PartialType(CreateChatroomDto) {
  @ApiProperty({ example: 'Lorem ipsum', description: 'Content of the post' })
  @IsString({ message: 'Should be string' })
  readonly title: string;
}
