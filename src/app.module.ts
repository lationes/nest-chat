import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { MessageModule } from './message/message.module';
import { TokenModule } from './token/token.module';
import { ChatroomModule } from './chatroom/chatroom.module';
import { AuthorizationModule } from './authorization/authorization.module';
import { JwtModule } from '@nestjs/jwt';
import { RefreshTokenStrategy } from './strategies/refreshToken.strategy';
import { AccessTokenStrategy } from './strategies/accessToken.strategy';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from './prisma/prisma.module';
import { AddRequestModule } from './add-request/add-request.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { MailModule } from './mail/mail.module';
import { CronModule } from './cron/cron.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, 'static'),
    }),
    JwtModule.register({ global: true }),
    PassportModule,
    UserModule,
    MessageModule,
    TokenModule,
    ChatroomModule,
    AuthorizationModule,
    PrismaModule,
    AddRequestModule,
    MailModule,
    CronModule,
  ],
  controllers: [],
  providers: [RefreshTokenStrategy, AccessTokenStrategy],
})
export class AppModule {}
