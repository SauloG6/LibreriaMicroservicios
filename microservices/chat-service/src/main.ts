import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // CORS para permitir conexiones del frontend
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  const port = process.env.PORT || 3004;
  await app.listen(port);
  
  console.log(`🚀 Chat Service ejecutándose en puerto ${port}`);
  console.log(`📡 WebSocket disponible en ws://localhost:${port}`);
}

bootstrap();