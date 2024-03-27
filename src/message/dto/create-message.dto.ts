import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateMessageDto {
  @ApiProperty({ example: 'Lorem ipsum', description: 'Content of the post' })
  @IsString({ message: 'Should be string' })
  readonly content: string;
  @ApiProperty({ example: 1, description: 'Сhat room id' })
  @IsNumber({}, { message: 'Should be number' })
  readonly chatRoomId: number;
}
