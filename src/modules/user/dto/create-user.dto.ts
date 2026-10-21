import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsInt()
  @IsNotEmpty()
  roleId: number;

  @IsInt()
  @IsOptional()
  departmentId?: number;

  @IsInt()
  @IsOptional()
  divisionId?: number;

  @IsInt()
  @IsOptional()
  officeId?: number;

  @IsInt()
  @IsOptional()
  unitId?: number;

  @IsInt()
  @IsOptional()
  posId?: number;

  @IsInt()
  @IsOptional()
  rank?: number;
}
