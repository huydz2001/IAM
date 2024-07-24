import { Global, Module } from '@nestjs/common';
import { JWTService } from '.';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('jwt.key'),
        signOptions: {
          expiresIn: configService.get('jwt.KeyExpired'),
        },
      }),
    }),
  ],
  providers: [JWTService],
  exports: [JWTService],
})
export class JWTModule {}
