import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { OpenAPIObject, SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { HttpExceptionFilter } from './helper/http-exception.filter';
import { Logger, ValidationPipe } from '@nestjs/common';
import config from './config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [config.rabbitmq.uri],
      queue: config.rabbitmq.queueName,
      noAck: false,
      queueOptions: { durable: true, persistent: true },
    },
  });
  app.startAllMicroservices();

  if (config.app.appEnv !== 'production') {
    const configSwagger: Omit<OpenAPIObject, 'paths'> = new DocumentBuilder()
      .addBearerAuth()
      .setTitle('IAM')
      .setDescription('IAM Swagger API Documentation')
      .setVersion('1.0')
      .addServer(`http://localhost:${config.app.port}`, 'Local')
      .build();
    const document: OpenAPIObject = SwaggerModule.createDocument(
      app,
      configSwagger,
      { deepScanRoutes: true },
    );

    SwaggerModule.setup('swagger', app, document, {
      swaggerOptions: { persistAuthorization: true },
    });
  }
  await app.listen(config.app.port);
  Logger.log(`🚀 ~ App running at ${await app.getUrl()}`, 'NestApplication');
}
bootstrap();
