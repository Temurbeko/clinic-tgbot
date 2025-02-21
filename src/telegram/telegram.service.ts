import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Telegraf } from 'telegraf';
import { formatDateUzbekLocale } from 'utils/formatDate';
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
    // /start command: sends a welcome message with a "Share Contact" button.
    this.bot.start((ctx) => {
      ctx.reply(
        '👩‍⚕️Alfatim klinikasiga hush kelibsiz!\n\nIltimos, pastdagi knopka orqali raqaminigzni ulashing, yoki laborant bergan ID raqaminigzni kiriting!.',
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
      
      const patient = await this.patientsService.findByPhone(phone);
      if (patient) {
        if (patient.labResults && patient.labResults.length > 0) {
          let message = `${patient.firstName}, Sizning labaratoriya natijalarnigiz:\n\n`;
          patient.labResults.forEach((lr) => {
            message += `Nomi: ${lr.name}\n Holati: ${lr.status}\n Natijasi: ${lr.result}\n Topshirilgan vaqti: ${formatDateUzbekLocale(lr.createdDate)}\n O'zgargan vaqti: ${formatDateUzbekLocale(lr.updatedDate)}\n\n`;
          });
          ctx.reply(message);
        } else {
          ctx.reply('Siz hozircha labaratoriyaga test topshirmagansiz!.');
        }
      } else {
        ctx.reply(
          `Bunday raqamli bemor topilmadi ${ctx.message.contact.phone_number}. Agar test labaratoriyaga topshirgan bolsangiz ID raqamingizni kiriting yoki bizga murojat qiling!.`,
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
            message += `Name: ${lr.name}\nStatus: ${lr.status}\nResult: ${lr.result}\nCreated: ${formatDateUzbekLocale(lr.createdDate)}\nUpdated: ${formatDateUzbekLocale(lr.updatedDate)}\n\n`;
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
