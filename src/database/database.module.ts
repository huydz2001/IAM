import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const postgresDb = config.get('database');
        console.log(postgresDb);

        return {
          type: 'postgres',
          // replication: {
          //   master: {
          //     host: postgresDb.hostWrite,
          //     port: Number(postgresDb.port),
          //     username: postgresDb.user,
          //     password: postgresDb.password,
          //     database: postgresDb.db,
          //   },
          //   slaves: [
          //     {
          //       host: postgresDb.hostRead,
          //       port: Number(postgresDb.port),
          //       username: postgresDb.user,
          //       password: postgresDb.password,
          //       database: postgresDb.db,
          //     },
          //   ],
          // },
          host: '192.168.0.3',
          port: 5432,
          username: process.env.POSTGRES_USER,
          password: process.env.POSTGRES_PASSWORD,
          database: process.env.POSTGRES_DB,
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
