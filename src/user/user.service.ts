import { BadRequestException, ConflictException, Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { HashingPasswordService } from 'src/hashing-password/hashing-password.service';
import { Roles } from 'src/enums/enum';
import { envConst } from 'src/enums/constants';
import { JwtPayload } from 'src/auth/interface/jwt.interface';

@Injectable()
export class UserService implements OnModuleInit {
  constructor(
    @InjectRepository(User) private readonly userRepo:Repository<User>,
    private readonly hashing:HashingPasswordService,
  ){}
 async  onModuleInit() {
  try{

    const adminUser = await this.userRepo.findOne({where:{username:envConst.adminUsername,role:Roles.ADMIN}})
    if (adminUser) {
      console.log('Admin user already exists');
      return;
    }
    
    // Validation
    if (!envConst.adminUsername || !envConst.adminPass) {
      console.log('Admin credentials not configured in environment variables');
      throw new BadRequestException('Missing admin credentials');
    }
    const hash = await this.hashing.hashPassword(envConst.adminPass)
    const user =   this.userRepo.create({username:envConst.adminUsername,password:hash,role:Roles.ADMIN})
    await this.userRepo.save(user)
    }catch (error) {
      console.log('Failed to initialize admin user', error.stack);
      throw error;
    }
  }

  async create(createUserDto: CreateUserDto) {
    const hash = await this.hashing.hashPassword(createUserDto.password)

      const existingUser = await this.usernameExists(createUserDto.username)
      if(existingUser) throw new ConflictException('username already exists')
      const user = this.userRepo.create({...createUserDto,password:hash});
      await this.userRepo.save(user)
      return user
  }

 async findAll(limit:number = 10,page:number = 1) {
  const take = Math.max(1,limit)
  const skip = (Math.max(1,page) -1) * limit
    const [users,count] = await this.userRepo.findAndCount({
      take,
      skip,
      relations:['taskList'],
    });
    return {
      users,
      totalUsers: count,
      totalPages: Math.ceil(count / limit)
    }
  }

  async findOne(employeeId: string) {
    const user = await this.userRepo.findOne({where:{id:employeeId},withDeleted:true,relations:{
     taskList: true 
    }});
    if(!user) throw new NotFoundException('employee not found')
    return user
  }

  async usernameExists(username: string): Promise<boolean> {
  const user = await this.userRepo.findOne({where:{username}})
  return !!user
}

  async findOneByUsername(username:string){
    const user = await this.userRepo.findOne({where:{username}})
    if(!user ) throw new NotFoundException('user not found')
    return user
  }

  async update(role:Roles, updateUserDto: UpdateUserDto,employeeId: string) {
    
    //find user
    const user = await this.findOne(employeeId)
    
    // protect the previlages of the Admin
    // if the role isn't admin don't allow editing the role of the employee
    if(role !== Roles.ADMIN){
      delete updateUserDto.role
    }


    // if wanting to edit password hash the password
    if(updateUserDto.password){
      updateUserDto.password =  await this.hashing.hashPassword(updateUserDto.password)
    }

    //assign values of update to user
    Object.assign(user,updateUserDto)

    //save the new updated user
    return await this.userRepo.save(user);
  }

 async remove(userId: string) {
    const result =await this.userRepo.softDelete({id:userId})
    if(result.affected === 0) throw new NotFoundException('user not found')
    return "user deleted successfully";
  }
}
