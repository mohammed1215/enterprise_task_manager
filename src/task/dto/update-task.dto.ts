import { PartialType } from '@nestjs/swagger';
import { CreateTaskDto } from './create-task.dto';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TaskStatus } from '../../enums/enum';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
    @IsString()
    @IsNotEmpty()
    @IsEnum(TaskStatus)
    @ApiProperty({
        description: 'Update task status (Review "Notes" for permissions)',
        enum: TaskStatus,  
        example: TaskStatus.IN_PROGRESS,
        required: false
    })
    @IsOptional()
    status?:TaskStatus;

    @ApiProperty({
        description: 'Reassign task to another employee (ADMIN ONLY)',
        required: false,
        example: 'uuid-string-here'
    })
    @IsOptional()
    employeeId?: string;
}
