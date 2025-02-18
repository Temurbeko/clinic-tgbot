import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { Patient } from '@prisma/client';

@Injectable()
export class PatientsService {
  constructor(private readonly prisma: PrismaService) {}

  async createPatient(data: CreatePatientDto): Promise<Patient> {
    return this.prisma.patient.create({
      data: data as any,
    });
  }

  async updatePatient(id: number, data: UpdatePatientDto): Promise<Patient> {
    try {
      return await this.prisma.patient.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw new NotFoundException(`Patient with id ${id} not found`);
    }
  }

  async findByOpenmrsId(openmrsId: string): Promise<Patient | null> {
    return this.prisma.patient.findUnique({
      where: { openmrsId },
    });
  }

  async findByPhone(phone: string): Promise<Patient | null> {
    return this.prisma.patient.findUnique({
      where: { phone },
    });
  }
}
