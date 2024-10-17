import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './tasks.model';
import { SetPositionTask } from './dto/set-position-task.dto';
import { ParamUser } from 'src/users/param-user.decorator';
import { User } from 'src/users/users.model';

@ApiTags('Задачи')
@Controller('tasks')
export class TasksController {

    constructor(private tasksService: TasksService) {}

    @ApiOperation({summary: 'Создание задачи'})
    @ApiResponse({status: 200, type: Task})
    @Post()
    create(@Body() dto: CreateTaskDto, @ParamUser() user: User) {
        return this.tasksService.createTask(dto, user);
    }

    @ApiOperation({summary: 'Получить задачу по Id'})
    @ApiResponse({status: 200, type: Task})
    @Get('/:taskId')
    getTaskById(@Param('taskId') taskId: number, @ParamUser() user: User) {
        return this.tasksService.getTaskById(taskId, user);
    }

    @ApiOperation({summary: 'Переместить задачу на новую позицию или в другой список задач'})
    @ApiResponse({status: 200, type: Task})
    @Put()
    setPosition(@Body() dto: SetPositionTask, @ParamUser() user: User) {
        return this.tasksService.setPositionTask(dto, user);
    }

    @ApiOperation({summary: 'Удалить задачу'})
    @ApiResponse({status: 200})
    @Delete('/:taskId')
    delete(@Param('taskId') taskId: number, @ParamUser() user: User) {
        return this.tasksService.deleteTask(taskId, user);
    }

}
