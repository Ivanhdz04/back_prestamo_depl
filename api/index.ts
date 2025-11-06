import 'reflect-metadata';
import { register } from 'tsconfig-paths';
import { resolve, join } from 'path';
import { existsSync } from 'fs';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import express from 'express';

// Determine base URL - in Vercel it might be different
const possibleBaseUrls = [
  resolve(__dirname, '..'),  // Standard: api/ -> root
  resolve(__dirname, '../..'), // If api is nested
  process.cwd(),              // Current working directory
];

let baseUrl = possibleBaseUrls[0];
for (const url of possibleBaseUrls) {
  if (existsSync(join(url, 'dist', 'app.module.js')) || existsSync(join(url, 'dist', 'app.module.ts'))) {
    baseUrl = url;
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

// Import AppModule - try multiple possible paths
let AppModule: any;
const possiblePaths = [
  join(baseUrl, 'dist', 'app.module'),
  join(baseUrl, 'src', 'app.module'),
  '../dist/app.module',
  '../src/app.module',
];

for (const modulePath of possiblePaths) {
  try {
    const module = require.resolve(modulePath);
    AppModule = require(module).AppModule;
    break;
  } catch (e) {
    // Continue to next path
  }
}

if (!AppModule) {
  throw new Error('Could not find AppModule. Tried paths: ' + possiblePaths.join(', '));
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
