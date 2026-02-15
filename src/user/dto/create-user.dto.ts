import { ApiProperty } from '@nestjs/swagger';
import {IsString,IsNotEmpty, MinLength} from 'class-validator'
export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        description:"username of the account",
        example:'user-test'
    })
    username:string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6, { message: 'Password must be at least 6 characters' }) 
    @ApiProperty({
        description:'password of the account',
        example:'123123'
    })
    password:string;
}
