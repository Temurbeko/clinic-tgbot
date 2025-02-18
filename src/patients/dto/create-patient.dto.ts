import { IsNotEmpty, IsString, IsOptional, IsObject } from 'class-validator';

export class CreatePatientDto {
  @IsNotEmpty()
  @IsString()
  openmrsId: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsOptional()
  @IsObject()
  testResults?: Record<string, any>;

  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;
}
