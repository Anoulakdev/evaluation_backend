import { IsNotEmpty, IsInt, IsString } from 'class-validator';

export class CreateSubtitleDto {
  @IsInt()
  @IsNotEmpty()
  titleId: number;

  @IsString()
  @IsNotEmpty()
  name: string;
}
