// src/patients/patients.controller.ts
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PatientsService } from './patients.service';

@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  // Endpoint for patient creation or updating lab results
  @Post()
  async createOrUpdatePatient(
    @Body()
    body: {
      openmrsId: string;
      phone?: string;
      firstName: string;
      lastName: string;
      labResult?: { status: string; name: string; result: string };
    },
  ) {
    return this.patientsService.createOrUpdatePatient(body);
  }

  // Retrieve patient by OpenMRS ID including lab results
  @Get('by-openmrs/:openmrsId')
  async getPatientByOpenmrsId(@Param('openmrsId') openmrsId: string) {
    return this.patientsService.findByOpenmrsId(openmrsId);
  }

  // Retrieve patient by phone including lab results
  @Get('by-phone/:phone')
  async getPatientByPhone(@Param('phone') phone: string) {
    return this.patientsService.findByPhone(phone);
  }

  @Get()
  async getAllPatients() {
    return await this.patientsService.findAll();
  }
}
