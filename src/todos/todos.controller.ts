import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { GetCurrentUser } from '../common/decorators';
import { TaskDto } from './dto';
import { TodosService } from './todos.service';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Get()
  async tasks(@GetCurrentUser('sub') userId: number) {
    return this.todosService.getTasks(userId);
  }

  @Get(':id')
  task(@Param('id') id: number, @GetCurrentUser('sub') userId: number) {
    return this.todosService.getTask(Number(id), userId);
  }

  @Post()
  async createTask(
    @Body() taskDto: TaskDto,
    @GetCurrentUser('sub') userId: number,
  ) {
    return this.todosService.createTask(taskDto, userId);
  }

  @Patch(':id')
  updateTask(
    @Param('id') id: number,
    @GetCurrentUser('sub') userId: number,
    @Body() taskDto: TaskDto,
    @Body() isComplete: boolean,
  ) {
    return this.todosService.updateTask(
      taskDto,
      Boolean(isComplete),
      userId,
      Number(id),
    );
  }

  @Delete(':id')
  deleteTask(@Param('id') id: number, @GetCurrentUser('sub') userId: number) {
    return this.todosService.deleteTask(userId, Number(id));
  }
}
