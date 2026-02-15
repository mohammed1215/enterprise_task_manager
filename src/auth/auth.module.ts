import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { HashingPasswordModule } from 'src/hashing-password/hashing-password.module';
import { jwtStrategy } from './jwt.strategy';

@Module({
  providers: [AuthService,jwtStrategy],
  controllers: [AuthController],
  imports: [UserModule,HashingPasswordModule,]
})
export class AuthModule {}
