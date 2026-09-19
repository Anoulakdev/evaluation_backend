import {
  IsNotEmpty,
  IsString,
  IsInt,
  IsOptional,
  IsNumber,
} from 'class-validator';

export class CreateTotalDto {
  @IsInt()
  @IsNotEmpty()
  receiverId: number;

  @IsInt()
  @IsNotEmpty()
  s1_1: number;

  @IsInt()
  @IsNotEmpty()
  s1_2: number;

  @IsInt()
  @IsNotEmpty()
  s1_3: number;

  @IsInt()
  @IsNotEmpty()
  s1_4: number;

  @IsInt()
  @IsNotEmpty()
  s1_5: number;

  @IsInt()
  @IsNotEmpty()
  s1_6: number;

  @IsInt()
  @IsOptional()
  s1_score?: number;

  @IsInt()
  @IsNotEmpty()
  s2_1: number;

  @IsInt()
  @IsNotEmpty()
  s2_2: number;

  @IsInt()
  @IsNotEmpty()
  s2_3: number;

  @IsInt()
  @IsNotEmpty()
  s2_4: number;

  @IsInt()
  @IsNotEmpty()
  s2_5: number;

  @IsInt()
  @IsOptional()
  s2_score?: number;

  @IsInt()
  @IsNotEmpty()
  s3_1: number;

  @IsInt()
  @IsNotEmpty()
  s3_2: number;

  @IsInt()
  @IsNotEmpty()
  s3_3: number;

  @IsInt()
  @IsOptional()
  s3_score?: number;

  @IsInt()
  @IsNotEmpty()
  s4_1: number;

  @IsInt()
  @IsNotEmpty()
  s4_2: number;

  @IsInt()
  @IsOptional()
  s4_score?: number;

  @IsInt()
  @IsOptional()
  total_score?: number;

  @IsNumber()
  @IsOptional()
  percent_score?: number;
}
