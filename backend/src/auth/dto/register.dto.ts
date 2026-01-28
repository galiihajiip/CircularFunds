import { IsEmail, IsString, MinLength, IsEnum } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsEnum(['UMKM', 'KREDITOR'])
  role: 'UMKM' | 'KREDITOR';
}
