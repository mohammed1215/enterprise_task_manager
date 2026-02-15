import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { JwtPayload } from '../auth/interface/jwt.interface';
import { Roles } from '../enums/enum';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';

@Injectable()
export class TaskService {

  constructor(
    @InjectRepository(Task) private readonly taskRepo:Repository<Task>,
    private readonly userService:UserService
  ){}

  // create task based on if you are admin or employee if admin then create task and assign it to the employee id you provided
  // if employee then create the task and give it to the same employee 
  async create(createTaskDto: CreateTaskDto, user:JwtPayload) {
    const targetUserId = (user.role === Roles.ADMIN && createTaskDto.employeeId) 
      ? createTaskDto.employeeId 
      : user.userId;

    //create task 
    const newTask = this.taskRepo.create({
      ...createTaskDto,
      employee: { id: targetUserId } as User 
    });

    //  save it to the database
      return await this.taskRepo.save(newTask);
  }

 async findAll(user:JwtPayload,limit:number=10,page:number=1) {
  // don't allow negative values
  const take = Math.max(1,limit)
  const skip = (Math.max(1,page) - 1) * limit

  // get the filter based on the role
  const filter:FindOptionsWhere<Task> = (user.role === Roles.ADMIN) 
      ? {}
      : {employee:{id:user.userId}};
  //get the tasks and there count
      const [tasks,count] =await this.taskRepo.findAndCount({where:filter,relations: ['employee'],take,skip})
  
  //return the tasks and counts and pages
    return {
      tasks,
      taskCount:count,
      pageCount: Math.ceil(count/limit)
    };
  }

  // employee provide its data and then find its values 
  // admin provide employeeId  
  async findOne(taskId:string, user:JwtPayload) {
    //Determine based on role whether it should filter with employeeId or not
    const filter:FindOptionsWhere<Task> = (user.role === Roles.ADMIN) 
    ? {id:taskId}
    : {id:taskId,employee:{id:user.userId}};

    const task = await this.taskRepo.findOne({where:filter,relations: ['employee']});
    if (!task) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }
    return task 
  }

 async update(taskId: string,user:JwtPayload, updateTaskDto: UpdateTaskDto) {
    const task = await this.findOne(taskId,user)

    if(user.role !== Roles.ADMIN){
      delete updateTaskDto.employeeId
    }else {
      delete updateTaskDto.status
    }

    const result = await this.taskRepo.update(task.id,updateTaskDto)
    if(result.affected === 0) throw new NotFoundException('Task Not Found')
    return "task updated successfully";
  }

  async remove(taskId: string,user:JwtPayload) {
    const filter :FindOptionsWhere<Task> = user.role === Roles.ADMIN ?{id:taskId}: {id:taskId , employee: {id: user.userId}}
    const result =await this.taskRepo.softDelete(filter);
    if(result.affected === 0) throw new NotFoundException('Task Not Found')
    return "task deleted successfully"
  }
}
