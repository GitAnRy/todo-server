import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Progect } from './progects.model';
import { ProgectsService } from './progects.service';
import { CreateProgectDto } from './dto/create-progect.dto';
import { User } from 'src/users/users.model';
import { ParamUser } from 'src/users/param-user.decorator';

@ApiTags('Проект')
@Controller('progects')
export class ProgectsController {

    constructor(private progectService: ProgectsService) {}

    @ApiOperation({summary: 'Создание проекта'})
    @ApiResponse({status: 200, type: Progect})
    @Post()
    create(@Body() progectDto: CreateProgectDto, @ParamUser() user: User) {
        return this.progectService.createProgect(progectDto, user);
    }

    //@ApiOperation({summary: 'Получить все проекты'})
    //@ApiResponse({status: 200, type: [Progect]})
    //@Get()
    //getAll() {

    //}

    @ApiOperation({summary: 'Получить проект по id'})
    @ApiResponse({status: 200, type: Progect})
    @Get('/:progectId')
    getProgectById(@Param('progectId') progectId: number, @ParamUser() user: User) {
        return this.progectService.getProgectById(progectId, user);
    }

    @ApiOperation({summary: 'Удалить проект'})
    @ApiResponse({status: 200})
    @Delete('/:progectId')
    delete(@Param('progectId') progectId: number, @ParamUser() user: User) {
        return this.progectService.deleteProgect(progectId, user);
    }
}
