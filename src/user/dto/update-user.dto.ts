import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { Roles } from 'src/enums/enum';
import { IsOptional } from 'class-validator';


export class UpdateUserDto extends PartialType(CreateUserDto) {
    @IsOptional()
    role?: Roles
}
