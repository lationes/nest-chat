import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const configService = app.get(ConfigService);
  const PORT = configService.get<number>('PORT') || 5000;
  const config = new DocumentBuilder()
    .setTitle('Api for chat with authorization')
    .setDescription('Endpoints for chat')
    .setVersion('1.0.0')
    .addTag('lationes')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/docs', app, document);

  await app.listen(PORT, () => console.log(`Server started on PORT = ${PORT}`));
}

bootstrap();
