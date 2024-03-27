import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateMessageDto {
  @ApiProperty({ example: 'Lorem ipsum', description: 'Content of the post' })
  @IsString({ message: 'Should be string' })
  readonly content: string;
}
