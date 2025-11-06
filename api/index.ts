import 'reflect-metadata';
import { register } from 'tsconfig-paths';
import { resolve, join } from 'path';
import { existsSync } from 'fs';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import express from 'express';

// In Vercel, __dirname points to /var/task/api
// We need to find where dist/ is located
const possibleBaseUrls = [
  resolve(__dirname, '..'),  // /var/task
  process.cwd(),              // Current working directory
];

let baseUrl = possibleBaseUrls[0];
let distPath = '';

// Find where dist/app.module.js actually is
for (const url of possibleBaseUrls) {
  const testPath = join(url, 'dist', 'app.module.js');
  if (existsSync(testPath)) {
    baseUrl = url;
    distPath = join(url, 'dist');
    break;
  }
}

// Register path mappings for runtime - resolve src/* to dist/*
register({
  baseUrl,
  paths: {
    'src/*': [join(baseUrl, 'dist/*')]
  }
});

// Import AppModule from dist (compiled code)
let AppModule: any;
if (distPath) {
  AppModule = require(join(distPath, 'app.module')).AppModule;
} else {
  // Fallback: try relative path
  try {
    AppModule = require('../dist/app.module').AppModule;
  } catch (e) {
    throw new Error(`Could not find AppModule. Base: ${baseUrl}, Dist: ${distPath}, __dirname: ${__dirname}, cwd: ${process.cwd()}`);
  }
}

let cachedApp: express.Express;

async function createApp(): Promise<express.Express> {
  if (cachedApp) {
    return cachedApp;
  }

  const expressApp = express();
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
  );

  app.setGlobalPrefix('api/v1');

  // CORS configuration
  app.enableCors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Loans example')
    .setDescription('The Loans API description')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.init();
  cachedApp = expressApp;

  return expressApp;
}

export default async function handler(req: express.Request, res: express.Response) {
  const app = await createApp();
  return app(req, res);
}
