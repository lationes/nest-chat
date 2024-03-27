import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { SendEmailDto } from './dto/send-email.dto';
import { Address } from '@nestjs-modules/mailer/dist/interfaces/send-mail-options.interface';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async sendEmail(dto: SendEmailDto) {
    try {
      const {
        subject,
        context,
        sender,
        recipients: to,
        template,
        text,
        html,
      } = dto;

      const from: Address = sender ?? {
        name: this.configService.get<string>('MAIL_SENDER_NAME'),
        address: this.configService.get<string>('MAIL_SENDER'),
      };

      return await this.mailerService.sendMail({
        from,
        to,
        text,
        html,
        template,
        context,
        subject,
      });
    } catch (e) {
      console.log(e);
    }
  }
}
