import { IsNotEmpty, IsString, IsInt, IsOptional } from 'class-validator';

export class CreateOfficeDto {
  @IsInt()
  @IsOptional()
  id?: number;

  @IsString()
  @IsNotEmpty()
  office_name: string;

  @IsString()
  @IsOptional()
  office_code?: string;

  @IsInt()
  @IsNotEmpty()
  divisionId: number;
}
