import { IsNotEmpty, IsString, IsInt, IsOptional } from 'class-validator';

export class CreateDepartmentDto {
  @IsInt()
  @IsOptional()
  id?: number;

  @IsString()
  @IsNotEmpty()
  department_name: string;

  @IsString()
  @IsOptional()
  department_code?: string;

  @IsString()
  @IsOptional()
  department_status?: string;
}
