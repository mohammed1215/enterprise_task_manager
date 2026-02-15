import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ForbiddenException, ParseUUIDPipe, BadRequestException, ParseIntPipe, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from 'src/custom-decorators/user.decorator';
import { type JwtPayload } from 'src/auth/interface/jwt.interface';
import { Roles } from 'src/enums/enum';
import { ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guard/role.guard';

@Controller('user')
@UseGuards(AuthGuard('jwt'))
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseGuards(new RolesGuard([Roles.ADMIN]))
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
 @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  findAll(@Query('limit',new ParseIntPipe({optional:true})) limit:number,@Query('page',new ParseIntPipe({optional:true})) page:number) {
    return this.userService.findAll(limit,page);
  }

  @Get(':employeeId')
  findOne(@Param('employeeId') employeeId: string) {
    return this.userService.findOne(employeeId);
  }

  @Patch('')
  update(@Query('userId') userId: string,@User() user:JwtPayload, @Body() updateUserDto: UpdateUserDto) {
    const empId = user.role === Roles.ADMIN && userId ? userId : user.userId
    return this.userService.update(user.role, updateUserDto,empId);
  }

@Delete(':userId')
  async remove(
    @Param('userId', ParseUUIDPipe) userId: string, 
    @User() currentUser: JwtPayload
  ) {

    if (currentUser.role !== Roles.ADMIN) {
        throw new ForbiddenException('Only Admins can delete users');
    }

    if (userId === currentUser.userId) {
        throw new BadRequestException('You cannot delete your own account');
    }

    return { message: await this.userService.remove(userId) };
  }
}
