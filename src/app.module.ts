import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

// Feature modules
import { AuthModule } from './auth/auth.module';
import { CitiesModule } from './cities/cities.module';
import { ClientsModule } from './clients/clients.module';
import { ContractsModule } from './contracts/contracts.module';
import { DirectionsModule } from './directions/directions.module';
import { LoansModule } from './loans/loans.module';
import { LocalitiesModule } from './localities/localities.module';
import { MunicipalityModule } from './municipality/municipality.module';
import { PaymentMethodsModule } from './payment_methods/payment_methods.module';
import { PaymentsModule } from './payments/payments.module';
import { SeedModule } from './seed/seed.module';
import { StatesModule } from './states/states.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        // Database configuration
        const host = configService.get<string>('DB_HOST', 'localhost');
        const port = configService.get<number>('DB_PORT', 5432);
        const username = configService.get<string>('DB_USER', 'postgres');
        const password = configService.get<string>('DB_PASSWORD', '');
        const database = configService.get<string>('DB_NAME', '');
        const stage = configService.get<string>('STAGE', 'dev');
        
        // SSL configuration - Azure PostgreSQL and remote hosts require SSL
        const dbSsl = configService.get<string>('DB_SSL', 'false');
        const isAzure = host.includes('database.azure.com');
        const isRemote = !['localhost', '127.0.0.1'].includes(host);
        const sslEnabled = dbSsl === 'true' || stage === 'prod' || isAzure || isRemote;

        return {
          type: 'postgres' as const,
          host,
          port,
          username,
          password,
          database,
          synchronize: stage !== 'prod', // Desactivar en producción por seguridad
          autoLoadEntities: true,
          ssl: sslEnabled,
          extra: sslEnabled ? { 
            ssl: { rejectUnauthorized: false } 
          } : undefined,
        };
      },
    }),
    UsersModule,
    AuthModule,
    StatesModule,
    MunicipalityModule,
    CitiesModule,
    LocalitiesModule,
    DirectionsModule,
    ClientsModule,
    LoansModule,
    PaymentsModule,
    PaymentMethodsModule,
    ContractsModule,
    SeedModule,
  ]
})

export class AppModule {}