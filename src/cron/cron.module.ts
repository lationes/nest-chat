import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { MailModule } from '../mail/mail.module';
import { ScheduleModule } from '@nestjs/schedule';
import { UserModule } from '../user/user.module';
import { AddRequestModule } from '../add-request/add-request.module';

@Module({
  imports: [ScheduleModule.forRoot(), MailModule, UserModule, AddRequestModule],
  providers: [CronService],
})
export class CronModule {}
