import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { User } from './users.model';
import { CreateUserDto } from './dto/create-user.dto';
import { ParamUser } from './param-user.decorator';

@ApiTags('Пользователи')
@Controller('users')
export class UsersController {

    constructor(private userService: UsersService) {}

    @ApiOperation({summary: `Создание пользователя`})
    @ApiResponse({status: 200, type: User})
    @Post()
    create(@Body() userDto: CreateUserDto) {
        return this.userService.createUser(userDto);
    }

    @ApiOperation({summary: 'Получить пользователя по id'})
    @ApiResponse({status: 200, type: User})
    @Get('/:userId')
    getUserById(@Param('userId') userId: number, @ParamUser() user: User) {
        return this.userService.getUserById(userId, user);
    }

    @ApiOperation({summary: 'Удалить пользователя'})
    @ApiResponse({status: 200})
    @Delete('/:userId')
    deleteUser(@Param('userId') userId: number, @ParamUser() user: User) {
        return this.userService.deleteUser(userId, user);
    }

    //update() {

    //}
}
