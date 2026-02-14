import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { HashingPasswordService } from 'src/hashing-password/hashing-password.service';
import { Roles } from 'src/enums/enum';
import { ConfigService } from '@nestjs/config';
import { envConst } from 'src/enums/constants';

@Injectable()
export class UserService implements OnModuleInit {

  constructor(
    @InjectRepository(User) private readonly userRepo:Repository<User>,
    private readonly hashing:HashingPasswordService,
  ){}
 async  onModuleInit() {
  const adminUser = await this.userRepo.findOne({where:{username:envConst.adminUsername,role:Roles.ADMIN}})
  if(adminUser) return console.log("admin exists")  
    
    const hash = await this.hashing.hashPassword(envConst.adminPass as string)
    const user =   this.userRepo.create({username:envConst.adminUsername,password:hash,role:Roles.ADMIN})

    await this.userRepo.save(user)

  }

  async create(createUserDto: CreateUserDto) {
    const hash = await this.hashing.hashPassword(createUserDto.password)
    
    const user = this.userRepo.create({...createUserDto,password:hash});
  
    return this.userRepo.save(user)
  }

  findAll() {
    return this.userRepo.find();
  }

  async findOne(employeeId: string) {
    const user = await this.userRepo.findOne({where:{id:employeeId},withDeleted:true,relations:{
     taskList: true 
    }});
    if(!user) throw new NotFoundException('employee not found')
    return user
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
