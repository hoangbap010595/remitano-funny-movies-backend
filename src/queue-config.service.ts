import {
  BullModuleOptions,
  SharedBullConfigurationFactory,
} from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BullConfigService implements SharedBullConfigurationFactory {
  constructor(private configService: ConfigService) {}
  createSharedConfiguration(): BullModuleOptions {
    return {
      redis: {
        host: this.configService.get<string>('REDIS_HOST'),
        port: this.configService.get<number>('REDIS_PORT'),
      },
    };
  }
}
