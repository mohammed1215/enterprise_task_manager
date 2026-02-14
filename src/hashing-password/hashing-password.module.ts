import { Module } from '@nestjs/common';
import { HashingPasswordService } from './hashing-password.service';

@Module({
  providers: [HashingPasswordService],
  exports: [HashingPasswordService]
})
export class HashingPasswordModule {}
