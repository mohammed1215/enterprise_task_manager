import { ClassSerializerInterceptor, Module } from '@nestjs/common';
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
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
interface database_type {
  type:"mysql" | "mariadb" | "postgres" | "cockroachdb" | "sqlite" | "mssql" | "sap" | "oracle" | "cordova" | "nativescript" | "react-native" | "sqljs" | "mongodb" | "aurora-mysql" | "aurora-postgres" | "expo" | "better-sqlite3" | "capacitor" | "spanner" | undefined
}

@Module({
  imports: [UserModule, TaskModule, ConfigModule.forRoot({
    isGlobal:true,
    
  }),JwtModule.registerAsync({
    inject: [ConfigService],
    global:true,
    useFactory: (config:ConfigService)=> {
      return ({
        secret:config.getOrThrow('JWT_SECRET') ,
        signOptions: {
          expiresIn: '1d'
        }
      })
    },
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
        ssl:{
          rejectUnauthorized:false
        }
      }
    }
  }),
   HashingPasswordModule,
   PassportModule,
   ThrottlerModule.forRoot({
    throttlers: [
      {
        ttl: 60000,
        limit: 10
      }
    ]
  }), AuthModule],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor
    }
  ],
})
export class AppModule {}
