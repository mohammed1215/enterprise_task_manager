import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import dotenv from 'dotenv'
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
dotenv.config()
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const options = new DocumentBuilder()
    .setTitle('NestJS Swagger Example API')
    .setDescription('API description for a NestJS application')
    .setVersion('1.0')
    .addBearerAuth() // If you use authentication
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api/docs', app, document,{
    jsonDocumentUrl:"api-json"
  });
  
  app.useGlobalPipes(new ValidationPipe({forbidNonWhitelisted:true,whitelist:true}))
  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
