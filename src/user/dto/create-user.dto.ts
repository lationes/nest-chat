import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'user@gmail.com', description: 'User email' })
  @IsString({ message: 'Should be string' })
  @IsEmail({}, { message: 'Incorrect email' })
  readonly email: string;
  @ApiProperty({ example: 'qwerty', description: 'User password' })
  @IsString({ message: 'Should be string' })
  @Length(6, 16, {
    message:
      'The password must be at least 6 characters and no more than 16 characters',
  })
  readonly password: string;
}
