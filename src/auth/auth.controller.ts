import { Body, Controller, Post, Res } from '@nestjs/common';
import { LoginDto } from './dto/Login.dto';
import { AuthService } from './auth.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService){}

    @Post('login')
    login(@Body() loginDto:LoginDto){
       return this.authService.login(loginDto)
    }

}
