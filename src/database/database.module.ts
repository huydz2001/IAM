import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        // const postgresDb = config.get('database');

        return {
          type: 'postgres',
          host: 'localhost',
          port: 5432,
          username: config.get<string>('POSTGRES_USER'),
          password: config.get<string>('POSTGRES_PASSWORD'),
          database: config.get<string>('POSTGRES_DB'),
          autoLoadEntities: true,
          entities: [__dirname + '/../**/*.entity.{js,ts}'],
          //   migrations: [__dirname + '/../../migrations/*.{js,ts}'],
          synchronize: true,
          poolSize: 5,
          logging: true,
        };
      },
    }),
  ],
})
export class DatabaseModule {}
