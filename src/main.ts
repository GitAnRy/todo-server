import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from './pipes/validation.pipe';

async function bootstrap() {

  //Задаем порт сервера
  const PORT = process.env.PORT || 5000;
  //Инициализируем приложение
  const app = await NestFactory.create(AppModule);

  //задаем конфигурацию для файла документации REST API
  const config = new DocumentBuilder()
    .setTitle('BACKEND взаимодействие с  TODO SERVER')
    .setDescription('')
    .setVersion('1.0.0')
    .addTag('DrAR')
    .build();

  //настраиваем модуль swaggger для создания документации
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/docs', app, document);

  app.useGlobalPipes(new ValidationPipe());

  //Запускаем сервер
  await app.listen(PORT, () => console.log(`Server started on port = ${PORT}`));
}
bootstrap();
