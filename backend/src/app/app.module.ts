import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CacheModule.register(), //in-memory by default, see https://docs.nestjs.com/techniques/caching#different-stores
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
