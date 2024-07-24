import { Global, Module } from '@nestjs/common';
import { LoggersService } from '.';

@Global()
@Module({
  providers: [LoggersService],
  exports: [LoggersService],
})
export class LoggerModule {}
