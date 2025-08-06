import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { Controller, Get } from '@nestjs/common';

@Controller('test')
class TestController {
  @Get()
  test() {
    return { message: '¡Chat Service funcionando!' };
  }
}

@Module({
  controllers: [TestController],
})
class TestModule {}

async function bootstrap() {
  const app = await NestFactory.create(TestModule);
  
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  const port = process.env.PORT || 3003;
  await app.listen(port);
  
  console.log(`🚀 Chat Service TEST ejecutándose en puerto ${port}`);
}

bootstrap();
