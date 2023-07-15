import { Module } from '@nestjs/common';
import { RFMGatewayEvents } from 'src/gateway/gateway.event';
import { RFMGatewayService } from 'src/gateway/gateway.service';
import { AuthService } from 'src/auth/auth.service';
import { PasswordService } from 'src/auth/password.service';
import { JwtService } from '@nestjs/jwt';
import { ShareMovieConsumer } from 'src/queues/share-movie.consumer';
import { ShareMovieProducerService } from 'src/queues/share-movie.producer.service';
import { BullModule } from '@nestjs/bull';
@Module({
  imports: [
    BullModule.registerQueue({
      name: 'share-movie',
    }),
  ],
  providers: [
    RFMGatewayEvents,
    RFMGatewayService,
    AuthService,
    PasswordService,
    JwtService,
    ShareMovieProducerService,
    ShareMovieConsumer,
  ],
})
export class RFMGatewayModule {}
