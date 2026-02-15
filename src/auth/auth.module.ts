import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { HashingPasswordModule } from '../hashing-password/hashing-password.module';
import { jwtStrategy } from './jwt.strategy';

@Module({
  providers: [AuthService,jwtStrategy],
  controllers: [AuthController],
  imports: [UserModule,HashingPasswordModule,]
})
export class AuthModule {}
