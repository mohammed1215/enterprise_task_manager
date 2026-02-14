import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TaskModule } from './task/task.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from './user/entities/user.entity';
import { Task } from './task/entities/task.entity';
import { HashingPasswordModule } from './hashing-password/hashing-password.module';
import {ThrottlerGuard, ThrottlerModule} from "@nestjs/throttler"
import { APP_GUARD } from '@nestjs/core';
interface database_type {
  type:"mysql" | "mariadb" | "postgres" | "cockroachdb" | "sqlite" | "mssql" | "sap" | "oracle" | "cordova" | "nativescript" | "react-native" | "sqljs" | "mongodb" | "aurora-mysql" | "aurora-postgres" | "expo" | "better-sqlite3" | "capacitor" | "spanner" | undefined
}

@Module({
  imports: [UserModule, TaskModule, ConfigModule.forRoot({
    isGlobal:true,
    
  }), TypeOrmModule.forRootAsync({
    inject: [ConfigService],
    useFactory: (config: ConfigService)=>{
      
      return {
        type:'postgres',
        database: config.get<string>('DATABASE_NAME'),
        host: config.get<string>('DATABASE_HOST'),
        port: config.get<number>('DATABASE_PORT'),
        username: config.get<string>('DATABASE_USER'),
        password: config.get<string>('DATABASE_PASS'),
        entities: [User,Task],
        synchronize:true,
      }
    }
  }), HashingPasswordModule, ThrottlerModule.forRoot({
    throttlers: [
      {
        ttl: 60000,
        limit: 10
      }
    ]
  })],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }
  ],
})
export class AppModule {}
