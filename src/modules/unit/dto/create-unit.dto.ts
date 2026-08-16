import { IsNotEmpty, IsString, IsInt, IsOptional } from 'class-validator';

export class CreateUnitDto {
  @IsInt()
  @IsOptional()
  id?: number;

  @IsString()
  @IsNotEmpty()
  unit_name: string;

  @IsString()
  @IsOptional()
  unit_code?: string;

  @IsString()
  @IsOptional()
  unit_type?: string;

  @IsInt()
  @IsOptional()
  divisionId?: number;

  @IsInt()
  @IsOptional()
  officeId?: number;
}
