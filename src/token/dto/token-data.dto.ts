import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmptyObject, IsNumber, IsString } from 'class-validator';

export class TokenDataDto {
  @ApiProperty({ example: 'test@gmail.com', description: 'User email' })
  @IsString({ message: 'Should be string' })
  readonly email: string;
  @ApiProperty({ example: 1, description: 'User id' })
  @IsNumber({}, { message: 'Should be number' })
  readonly id: number;
  @ApiProperty({ example: [1], description: 'User roles names' })
  @IsNotEmptyObject({}, { message: 'Should not be empty' })
  readonly role: string;
}
