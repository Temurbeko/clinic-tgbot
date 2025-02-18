// src/telegram/telegram.service.ts
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Telegraf } from 'telegraf';
import { PatientsService } from '../patients/patients.service';

@Injectable()
export class TelegramService implements OnModuleInit {
  private bot: Telegraf<any>;
  private readonly logger = new Logger(TelegramService.name);

  constructor(private patientsService: PatientsService) {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (!token) {
      throw new Error('TELEGRAM_BOT_TOKEN is not defined in .env');
    }
    this.bot = new Telegraf(token);
  }

  async onModuleInit() {
    // /start command
    this.bot.start((ctx) => {
      ctx.reply(
        'Welcome to the Clinic Bot!\n\nUse /getbyid <OpenMRS_ID> or /getbyphone <phone> to get your test results.'
      );
    });

    // Command: /getbyid <OpenMRS_ID>
    this.bot.command('getbyid', async (ctx) => {
      const parts = ctx.message.text.split(' ');
      if (parts.length < 2) {
        return ctx.reply('Please provide your OpenMRS ID. Usage: /getbyid <OpenMRS_ID>');
      }
      const openmrsId = parts[1];
      const patient = await this.patientsService.findByOpenmrsId(openmrsId);
      if (patient) {
        ctx.reply(`Test Results: ${patient.testResults || 'No results available.'}`);
      } else {
        ctx.reply('Patient not found.');
      }
    });

    // Command: /getbyphone <phone>
    this.bot.command('getbyphone', async (ctx) => {
      const parts = ctx.message.text.split(' ');
      if (parts.length < 2) {
        return ctx.reply('Please provide your phone number. Usage: /getbyphone <phone>');
      }
      const phone = parts[1];
      const patient = await this.patientsService.findByPhone(phone);
      if (patient) {
        ctx.reply(`Test Results: ${patient.testResults || 'No results available.'}`);
      } else {
        ctx.reply('Patient not found.');
      }
    });

    // Launch the bot
    this.bot.launch();
    this.logger.log('Telegram bot started');
  }
}
