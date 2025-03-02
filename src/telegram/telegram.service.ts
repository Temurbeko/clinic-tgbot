import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs';
import { generateLabResultsPDF } from 'src/utils/pdfGenerator';
import { Telegraf } from 'telegraf';
import { extractNumbers } from 'utils/formatDate';
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
    // /start command: Check if patient exists by telegramId.
    this.bot.start(async (ctx) => {
      const telegramId = String(ctx.from.id);
      const patient = await this.patientsService.findByTelegramId(telegramId);
      if (patient) {
        // Patient already registered – show "Get Result" button.
        ctx.reply(`Xush kelibsiz, ${patient.firstName}!`, {
          reply_markup: {
            keyboard: [[{ text: 'Natijalarni olish' }]],
            resize_keyboard: true,
            one_time_keyboard: true,
          },
        });
      } else {
        // New user – request contact.
        ctx.reply(
          '🩺👨‍⚕️Alfa-med klinikasiga hush kelibsiz!\n\nIltimos, pastdagi knopka orqali raqamingizni ulashing, yoki laborant bergan ID raqamingizni kiriting!',
          {
            reply_markup: {
              keyboard: [[{ text: 'Raqamimni berish', request_contact: true }]],
              resize_keyboard: true,
              one_time_keyboard: true,
            },
          },
        );
      }
    });

    // Handler for receiving contact details.
    this.bot.on('contact', async (ctx) => {
      const phone = ctx.message.contact.phone_number;
      const extractedPhone = extractNumbers(phone);
      let patient = await this.patientsService.findByPhone(extractedPhone);

      if (patient) {
        // Update patient with telegramId if not already set.
        if (!patient.telegramId) {
          await this.patientsService.updateTelegramId(
            patient.id,
            String(ctx.from.id),
          );
          patient.telegramId = String(ctx.from.id);
        }
        await this.handleLabResults(ctx, patient);
      } else {
        ctx.reply(
          `Bunday raqamli bemor topilmadi ${ctx.message.contact.phone_number}.`,
        );
      }
    });

    // Handler for "Natijalarni olish" button.
    this.bot.hears('Natijalarni olish', async (ctx) => {
      const telegramId = String(ctx.from.id);
      const patient = await this.patientsService.findByTelegramId(telegramId);
      if (patient) {
        await this.handleLabResults(ctx, patient);
      } else {
        ctx.reply('Bemor topilmadi, iltimos avval raqamingizni yuboring.', {
          reply_markup: {
            keyboard: [[{ text: 'Raqamimni berish', request_contact: true }]],
            resize_keyboard: true,
            one_time_keyboard: true,
          },
        });
      }
    });

    this.bot.launch();
    this.logger.log('Telegram bot started');
  }

  /**
   * Handles lab results: generates PDF and sends it to the user.
   * If generateLabResultsPDF returns a file path (string), it schedules file deletion;
   * otherwise, if it returns a Buffer, it sends it directly.
   */
  private async handleLabResults(ctx: any, patient: any) {
    if (patient.labResults && patient.labResults.length > 0) {
      ctx.reply(
        `${patient.firstName}, laborotoriya natijalaringiz PDF fayl sifatida tayyorlanmoqda...`,
      );
      const pdfResult = await generateLabResultsPDF(patient);

      await ctx.replyWithDocument({
        source: pdfResult,
        filename: `lab_results_${patient.id}.pdf`,
      });

      // If the PDF generator returns a file path (string), clean up the file.
      if (typeof pdfResult === 'string') {
        setTimeout(() => {
          fs.unlink(pdfResult, (err) => {
            if (err) console.error(`Failed to delete PDF file: ${err.message}`);
          });
        }, 5000);
      }
    } else {
      ctx.reply('Siz hozircha labaratoriyaga test topshirmagansiz!');
    }
  }
}
