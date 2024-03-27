import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateAddRequestDto {
  @ApiProperty({ example: 1, description: 'Id of the target of the request' })
  @IsNumber({}, { message: 'Should be number' })
  readonly userId: number;
  @ApiProperty({
    example: 1,
    description: 'Id of the chat room to which add request is',
  })
  @IsNumber({}, { message: 'Should be number' })
  readonly chatRoomId: number;
}
