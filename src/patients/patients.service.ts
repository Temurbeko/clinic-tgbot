// src/patients/patients.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

interface LabResultInput {
  status: string;
  name: string;
  result: string;
  createdDate: Date;
  updatedDate: Date;
}

interface CreateOrUpdatePatientInput {
  openmrsId: string;
  phone?: string;
  firstName: string;
  lastName: string;
  labResults?: LabResultInput[];
}

@Injectable()
export class PatientsService {
  constructor(private prisma: PrismaService) {}

  // Create a new patient or add a lab result if patient exists
  async createOrUpdatePatient(data: CreateOrUpdatePatientInput) {
    // Try finding an existing patient by OpenMRS ID
    let patient = await this.prisma.patient.findUnique({
      where: { openmrsId: data.openmrsId },
      include: { labResults: true }, // Include lab results in the query
    });

    // If not found, try by first name & last name
    if (!patient) {
      patient = await this.prisma.patient.findFirst({
        where: { firstName: data.firstName, lastName: data.lastName },
        include: { labResults: true },
      });
    }

    // If patient exists, update phone & add new lab results
    if (patient) {
      if (data.phone && patient.phone !== data.phone) {
        await this.prisma.patient.update({
          where: { id: patient.id },
          data: { phone: data.phone },
        });
      }

      if (data.labResults && data.labResults.length > 0) {
        const createdLabResults = await this.prisma.labResult.createMany({
          data: data.labResults.map((lab) => ({
            name: lab.name,
            status: lab.status,
            result: lab.result,
            createdDate: lab.createdDate
              ? new Date(lab.createdDate)
              : new Date(),
            updatedDate: lab.updatedDate
              ? new Date(lab.updatedDate)
              : new Date(),
            patientId: patient.id,
          })),
          skipDuplicates: true, // Avoids duplicate lab results
        });
        console.log("patient: ", patient);
        console.log("createdLabResults: ", createdLabResults);
        
        return { patient, createdLabResults };
      }

      console.log("Patient doenst exist, creating new patient... ", patient);
      

      return patient;
    }

    // If patient doesn't exist, create them along with their lab results
    return this.prisma.patient.create({
      data: {
        openmrsId: data.openmrsId,
        phone: data.phone,
        firstName: data.firstName,
        lastName: data.lastName,
        labResults: data.labResults
          ? {
              create: data.labResults.map((lab) => ({
                name: lab.name,
                status: lab.status,
                result: lab.result,
                createdDate: lab.createdDate
                  ? new Date(lab.createdDate)
                  : new Date(),
                updatedDate: lab.updatedDate
                  ? new Date(lab.updatedDate)
                  : new Date(),
              })),
            }
          : undefined,
      },
      include: { labResults: true }, // Return the lab results with the patient
    });
  }

  async findByOpenmrsId(openmrsId: string) {
    return this.prisma.patient.findUnique({
      where: { openmrsId },
      include: { labResults: true },
    });
  }

  async findByPhone(phone: string) {
    return this.prisma.patient.findUnique({
      where: { phone },
      include: { labResults: true },
    });
  }

  async findAll() {
    return this.prisma.patient.findMany({
      include: {
        labResults: true, // Include lab results if you want to return them with patients
      },
      
    });
  }
}
