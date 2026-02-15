import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateTaskDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        description: "title of the task",
        example:"task 1"
    })
    title: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        description: "description of the task",
        example:"task 1 description is about something"
    }) description:string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    @ApiProperty({
        description: "employeeId of the task required if you are the admin",
        example:"as912-akd9283-askdf948-9asdfjkahsdfkjh"
    })
    employeeId?:string;
    
}
