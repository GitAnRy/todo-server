import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { TodoListService } from './todo-list.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ToDoList } from './todo-list.model';
import { CreateToDoListDto } from './dto/create-todo-list.dto';
import { SetPositionToDoList } from './dto/set-position-todo-list.dto';
import { ParamUser } from 'src/users/param-user.decorator';
import { User } from 'src/users/users.model';

@ApiTags('Список задач')
@Controller('lists')
export class TodoListController {

    constructor(private todoListService:TodoListService) {}

    @ApiOperation({summary: 'Создание листа'})
    @ApiResponse({status: 200, type: ToDoList})
    @Post()
    create(@Body() dto: CreateToDoListDto, @ParamUser() user: User) {
        return this.todoListService.createToDoList(dto, user);
    }

    @ApiOperation({summary: 'Получить лист по Id'})
    @ApiResponse({status: 200, type: ToDoList})
    @Get('/:toDoListId')
    getListById(@Param('toDoListId') toDoListId: number, @ParamUser() user: User) {
        return this.todoListService.getToDoListById(toDoListId, user);
    }

    @ApiOperation({summary: 'Задать новую позицию листу'})
    @ApiResponse({status: 200, type: ToDoList})
    @Put()
    setPosition(@Body() dto: SetPositionToDoList, @ParamUser() user: User) {
        return this.todoListService.setPositionToDoList(dto, user);
    }

    @ApiOperation({summary: 'Удалить to-do лист'})
    @ApiResponse({status: 200})
    @Delete('/:toDoListId')
    delete(@Param('toDoListId') toDoListId: number, @ParamUser() user: User) {
        return this.todoListService.deleteList(toDoListId, user);
    }
}
