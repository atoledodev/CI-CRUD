import { IsDate, IsString } from 'class-validator';

export class StudentDto {
  @IsString()
  ci: string;

  @IsString()
  names: string;

  @IsString()
  lastNames: string;

  @IsString()
  email: string;

  @IsString()
  phone: string;

  @IsString()
  address: string;

  @IsDate()
  birthDate: Date;

  @IsString()
  career: string;

  @IsString()
  semester: string;

  @IsDate()
  registerDate: Date;
}
