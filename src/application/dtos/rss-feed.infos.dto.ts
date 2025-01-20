import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUrl } from 'class-validator';

export class RssFeedInfosDto {
  @ApiProperty({ description: 'URL of the RSS feed' })
  @IsUrl()
  @IsNotEmpty()
  url!: string;
}
