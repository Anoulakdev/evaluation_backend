import { IsNotEmpty, IsString, IsInt, IsOptional } from 'class-validator';

export class CreateDivisionDto {
  @IsInt()
  @IsOptional()
  id?: number;

  @IsString()
  @IsNotEmpty()
  division_name: string;

  @IsString()
  @IsOptional()
  division_code?: string;

  @IsInt()
  @IsNotEmpty()
  departmentId: number;

  @IsInt()
  @IsOptional()
  branch_id?: number;

  @IsString()
  @IsOptional()
  short_name?: string;

  @IsString()
  @IsOptional()
  insur_code?: string;
}
