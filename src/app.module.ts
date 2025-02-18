// src/app.module.ts
import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { TelegramModule } from './telegram/telegram.module';
import { PatientsModule } from './patients/patients.module';

@Module({
  imports: [PrismaModule, TelegramModule, PatientsModule],
})
export class AppModule {}
