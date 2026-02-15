import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseGuards, 
  Query,
  ParseIntPipe,
  DefaultValuePipe
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth, 
  ApiParam, 
  ApiBody 
} from '@nestjs/swagger';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/custom-decorators/user.decorator';
import { type JwtPayload } from 'src/auth/interface/jwt.interface';

@ApiTags('Tasks')
@ApiBearerAuth()
@Controller('task')
@UseGuards(AuthGuard('jwt'))
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Create a new task',
    description: 'Creates a new task. Only accessible by authenticated users.'
  })
  @ApiBody({ type: CreateTaskDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Task created successfully' 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad request - Invalid data' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized - Invalid or missing token' 
  })
  create(@Body() createTaskDto: CreateTaskDto, @User() user: JwtPayload) {
    return this.taskService.create(createTaskDto, user);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Get all tasks',
    description: 'Retrieves all tasks for the authenticated user based on their role.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Tasks retrieved successfully' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized - Invalid or missing token' 
  })
  findAll(@User() user: JwtPayload,@Query('limit',new DefaultValuePipe(10),new ParseIntPipe({optional:true})) limit:number,@Query('page',new DefaultValuePipe(1),new ParseIntPipe({optional:true})) page:number) {
    return this.taskService.findAll(user,limit,page);
  }

  @Get(':taskId')
  @ApiOperation({ 
    summary: 'Get a specific task',
    description: 'Retrieves a single task by ID for the authenticated user.'
  })
  @ApiParam({ 
    name: 'taskId', 
    type: String, 
    description: 'The unique identifier of the task' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Task retrieved successfully' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Task not found' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized - Invalid or missing token' 
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Forbidden - User does not have access to this task' 
  })
  findOne(@Param('taskId') taskId: string, @User() user: JwtPayload) {
    return this.taskService.findOne(taskId, user);
  }

  @ApiOperation({ 
    summary: 'Update a task',
    description: `
      This endpoint behaves differently based on your role:
      - **ADMIN**: Can update the 'employeeId' (Reassign task). Cannot update 'status'.
      - **EMPLOYEE**: Can update 'status' (Open -> In Progress -> Done). Cannot update 'employeeId'.
    ` 
  })
  @ApiParam({ 
    name: 'taskId', 
    type: String, 
    description: 'The unique identifier of the task' 
  })
  @ApiBody({ type: UpdateTaskDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Task updated successfully' 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad request - Invalid data or unauthorized field update' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Task not found' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized - Invalid or missing token' 
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Forbidden - User does not have permission to update this task' 
  })
  @Patch(':taskId')
  update(
    @Param('taskId') taskId: string,
    @User() user: JwtPayload, 
    @Body() updateTaskDto: UpdateTaskDto
  ) {
    return this.taskService.update(taskId, user, updateTaskDto);
  }

  @Delete(':taskId')
  @ApiOperation({ 
    summary: 'Delete a task',
    description: 'Deletes a task by ID. Requires appropriate permissions.'
  })
  @ApiParam({ 
    name: 'taskId', 
    type: String, 
    description: 'The unique identifier of the task' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Task deleted successfully' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Task not found' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized - Invalid or missing token' 
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Forbidden - User does not have permission to delete this task' 
  })
  remove(@Param('taskId') taskId: string, @User() user: JwtPayload) {
    return this.taskService.remove(taskId, user);
  }
}