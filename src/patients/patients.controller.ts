import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { Patient } from '@prisma/client';

@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Post()
  async create(@Body() createPatientDto: CreatePatientDto): Promise<Patient> {
    return this.patientsService.createPatient(createPatientDto);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePatientDto: UpdatePatientDto,
  ): Promise<Patient> {
    return this.patientsService.updatePatient(+id, updatePatientDto);
  }

  @Get('by-openmrs/:openmrsId')
  async getByOpenmrsId(@Param('openmrsId') openmrsId: string): Promise<Patient | null> {
    return this.patientsService.findByOpenmrsId(openmrsId);
  }

  @Get('by-phone/:phone')
  async getByPhone(@Param('phone') phone: string): Promise<Patient | null> {
    return this.patientsService.findByPhone(phone);
  }
}
