import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ToDoList } from './todo-list.model';
import { Between, Repository } from 'typeorm';
import { CreateToDoListDto } from './dto/create-todo-list.dto';
import { ProgectsService } from 'src/progects/progects.service';
import { Progect } from 'src/progects/progects.model';
import { SetPositionToDoList } from './dto/set-position-todo-list.dto';
import { TasksService } from 'src/tasks/tasks.service';
import { User } from 'src/users/users.model';

@Injectable()
export class TodoListService {

    constructor(
        @InjectRepository(ToDoList)
        private todoListRepository: Repository<ToDoList>,
        @Inject(forwardRef(() => ProgectsService))
        private progectService: ProgectsService,
        @Inject(forwardRef(() => TasksService))
        private taskService: TasksService
    ) {}

    async createToDoList(dto: CreateToDoListDto, user: User): Promise<ToDoList> {

        if(user && !await this.verifiToDoListId(user, null, dto.progectId)) {
            throw new HttpException('Нет прав доступа', HttpStatus.NOT_FOUND);
        }

        const progect: Progect = await this.progectService.getOnlyProgectById(dto.progectId);
        
        if(progect)
        {
            const position = await this.getCount(dto.progectId) + 1;
            const list = await this.todoListRepository.save({...dto, position: position});
            list.progect = progect;
            return list;
        }

        throw new HttpException('Проект не найден', HttpStatus.NOT_FOUND);
    }

    async getOnlyToDoListById(byId: number): Promise<ToDoList> {
        const list = await this.todoListRepository.findOne({
            where: {
                id: byId,
            }
        });

        if (list) {
            return list;
        }

        throw new HttpException('Список не найден', HttpStatus.NOT_FOUND);
        
    }

    async getToDoListById(byId: number, user: User): Promise<ToDoList> {

        if(user && !await this.verifiToDoListId(user, byId, null))  {
            throw new HttpException('Нет прав доступа', HttpStatus.NOT_FOUND);
        }

        const list = await this.todoListRepository.findOne({
            where: {
                id: byId,
            },
            relations: {
                tasks: true,
            },
            order: {
                tasks: {
                    position: 'ASC'
                }
            }
        });

        if (list) {
            return list;
        }

        throw new HttpException('Список не найден', HttpStatus.NOT_FOUND);
    }

    async setPositionToDoList(dto: SetPositionToDoList, user: User): Promise<ToDoList> {

        if(user && !await this.verifiToDoListId(user, dto.toDoListId, null)) {
            throw new HttpException('Нет прав доступа', HttpStatus.NOT_FOUND);
        }
        
        const list = await this.getToDoListById(dto.toDoListId, null);
        
        if(list) {
            const count = await this.getCount(list.progectId);
            let position = (dto.fromPosition > count)? count:
                (dto.fromPosition <= 0)? 1:dto.fromPosition;

            if(position !== list.position)
            {
                const start = Math.min(position, list.position);
                const end = Math.max(position, list.position);

                await this.biasPositions(list.progectId, start, end, (position > list.position)? -1:1);

                list.position = position;
                await this.todoListRepository.save(list);
    
                return list;
            }
            
            throw new HttpException('Позиция равна себе', HttpStatus.NOT_FOUND);
            
        }
        
        throw new HttpException('Список не найден', HttpStatus.NOT_FOUND);
    }

    async biasPositions(progectId: number, start: number, end: number, val: number) {
        await this.todoListRepository.increment({
            progectId: progectId,
            position: Between(start, end),
        }, 'position', val);
    }

    async getCount(progectId: number): Promise<number> {
        const count = await this.todoListRepository.count({
            where: {
                progectId: progectId,
            }
        });

        return count;
    }

    async deleteList(byId: number, user: User) {

        if(user && !await this.verifiToDoListId(user, byId, null)) {
            throw new HttpException('Нет прав доступа', HttpStatus.NOT_FOUND);
        }

        const list = await this.getOnlyToDoListById(byId);

        if (list) {

            const count = await this.getCount(list.progectId);

            if(list.position < count)
            {
                await this.biasPositions(list.progectId, list.position, count, -1);
            }
            
            await this.taskService.deleteTaskByToDoListId(byId);
            const c = await this.todoListRepository.delete(byId);
    
            return c.affected > 0;
        }

        throw new HttpException('Лист задач не найден', HttpStatus.NOT_FOUND);
        
    }

    async verifiToDoListId(user: User, toDoListId: number, progectId: number) {

        progectId ||= (await this.getOnlyToDoListById(toDoListId)).progectId
        
        return this.progectService.verifiProgectId(user, progectId);
    }


}
