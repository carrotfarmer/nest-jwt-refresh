import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TaskDto } from './dto';

@Injectable()
export class TodosService {
  constructor(private readonly prisma: PrismaService) {}

  async getTasks(userId: number) {
    return await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        todos: true,
      },
    });
  }

  async getTask(taskId: number, userId: number) {
    return await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        todos: {
          where: {
            id: taskId,
          },
        },
      },
    });
  }

  async createTask(taskDto: TaskDto, userId: number) {
    return await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        todos: {
          create: {
            name: taskDto.name,
            isComplete: false,
          },
        },
      },
    });
  }

  async deleteTask(userId: number, taskId: number) {
    const todo = await this.prisma.todo.findUnique({
      where: {
        id: taskId,
      },
    });

    if (todo) {
      return await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          todos: {
            delete: {
              id: taskId,
            },
          },
        },
      });
    } else {
      throw new NotFoundException('The requested todo was not found!');
    }
  }

  async updateTask(
    taskDto: TaskDto,
    isComplete: boolean,
    userId: number,
    taskId: number,
  ) {
    return this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        todos: {
          update: {
            where: {
              id: taskId,
            },
            data: {
              name: taskDto.name,
              isComplete,
            },
          },
        },
      },
      select: {
        todos: {
          where: {
            id: taskId,
          },
        },
      },
    });
  }
}
