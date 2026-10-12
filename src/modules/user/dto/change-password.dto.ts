import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @IsOptional()
  oldpassword?: string;

  @IsString()
  @IsNotEmpty()
  password1: string;

  @IsString()
  @IsNotEmpty()
  password2: string;
}
