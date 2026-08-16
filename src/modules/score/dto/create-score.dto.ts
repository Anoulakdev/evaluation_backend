import { IsNotEmpty, IsInt } from 'class-validator';

export class CreateScoreDto {
  @IsInt()
  @IsNotEmpty()
  sc_num: number;
}
