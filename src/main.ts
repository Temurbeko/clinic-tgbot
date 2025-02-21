// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3000;
  app.enableCors({
    origin: '*', // Allow all origins
    methods: '*', // Allow all methods
    allowedHeaders: '*', // Allow all headers
  });
  await app.listen(port);
  console.log(`Server is running on http://localhost:${port}`);
}
bootstrap();
