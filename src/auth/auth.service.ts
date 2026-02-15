import { BadRequestException, Injectable } from '@nestjs/common';
import { LoginDto } from './dto/Login.dto';
import { UserService } from 'src/user/user.service';
import { HashingPasswordService } from 'src/hashing-password/hashing-password.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {


    constructor(private readonly userService:UserService,private readonly hashService:HashingPasswordService,private readonly jwtService:JwtService){}

    async login(loginDto:LoginDto){
        const user = await this.userService.findOneByUsername(loginDto.username)
        const compRes = await this.hashService.comparePassword(user.password,loginDto.password)
        
        if(!compRes) throw new BadRequestException('password is incorrect')
        const token = await this.jwtService.signAsync({userId: user.id,username:user.username,role:user.role},{expiresIn:'1d',})

        return {token,user}
        }
}
