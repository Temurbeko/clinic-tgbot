import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GroupResult } from '@prisma/client';

interface GroupMember {
  concept: { uuid: string };
  value: string;
  status: 'FINAL' | string;
  display: string;
  order: { uuid: string };
  units?: string;
  hiAbsolute?: number;
  hiNormal?: number;
  lowAbsolute?: number;
  lowNormal?: number;
}
interface CommonInputs {
  concept: { uuid: string };
  status: 'FINAL' | string;
  display: string;
  order: { uuid: string };
  // For a single input, use value.
  value?: string;
  // For a group input, use groupMembers instead of value.
  groupMembers?: GroupMember[];
  units?: string;
  hiAbsolute?: number;
  hiNormal?: number;
  lowAbsolute?: number;
  lowNormal?: number;
}

interface LabResultInput {
  status: string;
  name: string;
  createdDate: Date;
  updatedDate: Date;
  // Each CommonInputs entry will be converted into one or more GroupResult records.
  result: CommonInputs[];
}

interface CreateOrUpdatePatientInput {
  openmrsId: string;
  phone?: string;
  firstName: string;
  lastName: string;
  labResults?: LabResultInput[];
}
interface GroupResultsDataInput {
  conceptUuid: string;
  status: string;
  orderUuid: string;
  display: string;
  value: string;
  units?: string;
  hiAbsolute?: number;
  hiNormal?: number;
  lowAbsolute?: number;
  lowNormal?: number;
}

@Injectable()
export class PatientsService {
  constructor(private prisma: PrismaService) {}

  async createOrUpdatePatient(data: CreateOrUpdatePatientInput) {
    // Try finding an existing patient by OpenMRS ID
    let patient = await this.prisma.patient.findUnique({
      where: { openmrsId: data.openmrsId },
      include: { labResults: { include: { groupResults: true } } },
    });

    // If not found, try by first name & last name
    if (!patient) {
      patient = await this.prisma.patient.findFirst({
        where: { firstName: data.firstName, lastName: data.lastName },
        include: { labResults: { include: { groupResults: true } } },
      });
    }

    if (patient) {
      // Update phone if needed
      if (data.phone && patient.phone !== data.phone) {
        await this.prisma.patient.update({
          where: { id: patient.id },
          data: { phone: data.phone },
        });
      }

      // Add new lab results (with groupResults)
      if (data.labResults && data.labResults.length > 0) {
        for (const lab of data.labResults) {
          // Explicitly type the temporary array.
          const groupResultsData: GroupResultsDataInput[] = [];

          for (const r of lab.result) {
            if (r.groupMembers && r.groupMembers.length > 0) {
              // For group inputs, create one GroupResult per group member.
              for (const gm of r.groupMembers) {
                groupResultsData.push({
                  units: gm.units,
                  hiAbsolute: gm.hiAbsolute,
                  hiNormal: gm.hiNormal,
                  lowAbsolute: gm.lowAbsolute,
                  lowNormal: gm.lowNormal,
                  conceptUuid: gm.concept.uuid,
                  status: gm.status,
                  orderUuid: gm.order.uuid,
                  display: gm.display,
                  value: String(gm.value),
                });
              }
            } else if (r.value !== undefined) {
              // For single input, attempt to parse value as number.
              const parsed = String(r.value);
              groupResultsData.push({
                conceptUuid: r.concept.uuid,
                status: r.status,
                orderUuid: r.order.uuid,
                display: r.display,
                value: parsed,
                units: r.units,
                hiAbsolute: r.hiAbsolute,
                hiNormal: r.hiNormal,
                lowAbsolute: r.lowAbsolute,
                lowNormal: r.lowNormal,
              });
            }
          }

          await this.prisma.labResult.create({
            data: {
              name: lab.name,
              status: lab.status,
              createdDate: lab.createdDate
                ? new Date(lab.createdDate)
                : new Date(),
              updatedDate: lab.updatedDate
                ? new Date(lab.updatedDate)
                : new Date(),
              patientId: patient.id,
              groupResults: {
                create: groupResultsData.map((item) => ({
                  ...item,
                  value: String(item.value),
                })),
              },
            },
          });
        }
      }
      return patient;
    }

    // If patient doesn't exist, create them along with their lab results and groupResults.
    return this.prisma.patient.create({
      data: {
        openmrsId: data.openmrsId,
        phone: data.phone,
        firstName: data.firstName,
        lastName: data.lastName,
        labResults: data.labResults
          ? {
              create: data.labResults.map((lab) => {
                const groupResultsData: GroupResultsDataInput[] = [];
                for (const r of lab.result) {
                  if (r.groupMembers && r.groupMembers.length > 0) {
                    for (const gm of r.groupMembers) {
                      groupResultsData.push({
                        units: gm.units,
                        hiAbsolute: gm.hiAbsolute,
                        hiNormal: gm.hiNormal,
                        lowAbsolute: gm.lowAbsolute,
                        lowNormal: gm.lowNormal,
                        conceptUuid: gm.concept.uuid,
                        status: gm.status,
                        orderUuid: gm.order.uuid,
                        display: gm.display,
                        value: gm.value,
                      });
                    }
                  } else if (r.value !== undefined) {
                    const parsed = String(r.value);
                    groupResultsData.push({
                      units: r.units,
                      hiAbsolute: r.hiAbsolute,
                      hiNormal: r.hiNormal,
                      lowAbsolute: r.lowAbsolute,
                      lowNormal: r.lowNormal,
                      conceptUuid: r.concept.uuid,
                      status: r.status,
                      orderUuid: r.order.uuid,
                      display: r.display,
                      value: parsed,
                    });
                  }
                }
                return {
                  name: lab.name,
                  status: lab.status,
                  createdDate: lab.createdDate
                    ? new Date(lab.createdDate)
                    : new Date(),
                  updatedDate: lab.updatedDate
                    ? new Date(lab.updatedDate)
                    : new Date(),
                  groupResults: { create: groupResultsData },
                };
              }),
            }
          : undefined,
      },
      include: { labResults: { include: { groupResults: true } } },
    });
  }

  async findByOpenmrsId(openmrsId: string) {
    return this.prisma.patient.findUnique({
      where: { openmrsId },
      include: { labResults: { include: { groupResults: true } } },
    });
  }

  async findByPhone(phone: string) {
    return this.prisma.patient.findUnique({
      where: { phone },
      include: { labResults: { include: { groupResults: true } } },
    });
  }

  async findAll() {
    return this.prisma.patient.findMany({
      include: { labResults: { include: { groupResults: true } } },
    });
  }

  async findByTelegramId(telegramId: string) {
    return this.prisma.patient.findUnique({
      where: { telegramId },
      include: { labResults: { include: { groupResults: true } } },
    });
  }

  async updateTelegramId(patientId: number, telegramId: string) {
    return this.prisma.patient.update({
      where: { id: patientId },
      data: { telegramId },
    });
  }
}
