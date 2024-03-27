import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateChatroomDto {
  @ApiProperty({ example: 'Lorem ipsum', description: 'Content of the post' })
  @IsString({ message: 'Should be string' })
  readonly title: string;
}
