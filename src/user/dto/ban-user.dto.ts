import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class BanUserDto {
  @ApiProperty({
    example: 'Ban for obscene language',
    description: 'Ban reason',
  })
  @IsString({ message: 'Should be string' })
  readonly reason: string;
}
