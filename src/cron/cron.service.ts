import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UserService } from '../user/user.service';
import { MailService } from '../mail/mail.service';
import { AddRequestService } from '../add-request/add-request.service';

@Injectable()
export class CronService {
  constructor(
    private userService: UserService,
    private mailService: MailService,
    private addRequestService: AddRequestService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_NOON)
  async sendEmailAboutNewNotifications() {
    const users = await this.userService.users({});
    const addRequests = await this.addRequestService.addRequests({});

    users.map((user) => {
      const userAddRequestsLength =
        addRequests.filter((addRequest) => addRequest.userId === user.id)
          ?.length || 0;

      if (userAddRequestsLength) {
        this.mailService.sendEmail({
          recipients: [{ name: user.email, address: user.email }],
          subject: 'Notifications to review',
          template: 'notifications',
          context: {
            name: user.email,
            notificationsLength: userAddRequestsLength,
          },
        });
      }
    });
  }
}
