  import * as fs from 'fs';
  import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
  import { Telegraf } from 'telegraf';
  import { extractNumbers, formatDateUzbekLocale } from 'utils/formatDate';
  import { PatientsService } from '../patients/patients.service';
  import { generateLabResultsPDF } from 'src/utils/pdfGenerator';

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
      // /start command: sends a welcome message with a "Share Contact" button.
      this.bot.start((ctx) => {
        ctx.reply(
          '🩺👨‍⚕️Alfa-med klinikasiga hush kelibsiz!\n\nIltimos, pastdagi knopka orqali raqaminigzni ulashing, yoki laborant bergan ID raqaminigzni kiriting!.',
          {
            reply_markup: {
              keyboard: [[{ text: 'Raqamimni berish', request_contact: true }]],
              resize_keyboard: true,
              one_time_keyboard: true,
            },
          },
        );
      });

      // Handler for receiving contact details.
      this.bot.on('contact', async (ctx) => {
        const phone = ctx.message.contact.phone_number;
        const patient = await this.patientsService.findByPhone(extractNumbers(phone));

        if (patient) {
          if (patient.labResults && patient.labResults.length > 0) {
            ctx.reply(
              `${patient.firstName}, laborotoriya natijalaringiz PDF fayl sifatida tayyorlanmoqda...`,
            );

            // Generate PDF
            const pdfPath = await generateLabResultsPDF(patient);

            // Send PDF
            await ctx.replyWithDocument({
              source: pdfPath,
              filename: `lab_results_${patient.id}.pdf`,
            });

            // Clean up file after sending

            setTimeout(() => {
              fs.unlink(pdfPath, (err) => {
                if (err)
                  console.error(`Failed to delete PDF file: ${err.message}`);
              });
            }, 5000);
          } else {
            ctx.reply('Siz hozircha labaratoriyaga test topshirmagansiz!');
          }
        } else {
          ctx.reply(
            `Bunday raqamli bemor topilmadi ${ctx.message.contact.phone_number}.`,
          );
        }
      });

      // Handler for plain text messages assumed to be an OpenMRS ID.
      this.bot.on('text', async (ctx) => {
        // Ignore commands.
        if (ctx.message.text.startsWith('/')) {
          return;
        }
        const openmrsId = ctx.message.text.trim();
        console.log(openmrsId);

        const patient = await this.patientsService.findByOpenmrsId(openmrsId);

        if (patient) {
          if (patient.labResults && patient.labResults.length > 0) {
            let message = 'Your Lab Results:\n\n';
            patient.labResults.forEach((lr) => {
              message += `Name: ${lr.name}\nStatus: ${lr.status}\nResult: ${"🤔"}\nCreated: ${formatDateUzbekLocale(lr.createdDate)}\nUpdated: ${formatDateUzbekLocale(lr.updatedDate)}\n\n`;
            });
            ctx.reply(message);
          } else {
            ctx.reply('Siz hozircha labaratoriyaga test topshirmagansiz!');
          }
        } else {
          ctx.reply(
            'Agar test labaratoriyaga topshirgan bolsangiz ID raqamingizni qayta kiriting yoki bizga murojat qiling!.',
          );
        }
      });

      // Launch the Telegram bot.
      this.bot.launch();
      this.logger.log('Telegram bot started');
    }
  }
