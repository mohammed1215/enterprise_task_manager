import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TaskService {

  constructor(
    @InjectRepository(Task) private readonly taskRepo:Repository<Task>,
    
  ){}

  create(createTaskDto: CreateTaskDto) {
    const task = this.taskRepo.create({...createTaskDto,employee:{id:createTaskDto.employeeId}})
    return this.taskRepo.save(task) ;
  }

  findAll() {
    return `This action returns all task`;
  }

  findOne(id: number) {
    return `This action returns a #${id} task`;
  }

  update(id: number, updateTaskDto: UpdateTaskDto) {
    return `This action updates a #${id} task`;
  }

  async remove(taskId: string) {
    const result =await this.taskRepo.softDelete({id:taskId});
    if(result.affected === 0) throw new NotFoundException('Task Not Found')
    return "task deleted successfully"
  }
}
