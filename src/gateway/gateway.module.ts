import { Module } from '@nestjs/common';
import { RFMGatewayEvents } from 'src/gateway/gateway.event';
import { RFMGatewayService } from 'src/gateway/gateway.service';
import { AuthService } from 'src/auth/auth.service';
import { PasswordService } from 'src/auth/password.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [
    RFMGatewayEvents,
    RFMGatewayService,
    AuthService,
    PasswordService,
    JwtService,
  ],
})
export class RFMGatewayModule {}
