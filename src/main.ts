import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import dotenv from 'dotenv'
import { ValidationPipe } from '@nestjs/common';
dotenv.config()
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({forbidNonWhitelisted:true,whitelist:true}))
  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
