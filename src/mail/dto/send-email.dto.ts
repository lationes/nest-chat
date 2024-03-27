import { Address } from '@nestjs-modules/mailer/dist/interfaces/send-mail-options.interface';

export class SendEmailDto {
  readonly sender?: Address;
  readonly recipients: Address[];
  subject: string;
  text?: string;
  html?: string;
  template?: string;
  context?: any;
}
