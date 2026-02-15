import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MinLength } from "class-validator";

export  class LoginDto{

    @ApiProperty({
        description:"username of account",
        example:"user-test"
    })
    @IsString()
    @IsNotEmpty()
    username: string;
    
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    @ApiProperty({
        description:"password of account",
        example:"123123"
    })
    password:string;
}