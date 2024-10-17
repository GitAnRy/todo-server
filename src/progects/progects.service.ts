import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Progect } from './progects.model';
import { Repository } from 'typeorm';
import { CreateProgectDto } from './dto/create-progect.dto';
import { UsersService } from 'src/users/users.service';
import { ToDoList } from 'src/todo-list/todo-list.model';
import { TasksService } from 'src/tasks/tasks.service';
import { TodoListService } from 'src/todo-list/todo-list.service';
import { User } from 'src/users/users.model';

@Injectable()
export class ProgectsService {

    constructor(
        @InjectRepository(Progect)
        private progectRepository: Repository<Progect>,
        @Inject(forwardRef(() => UsersService))
        private userService: UsersService,
        @Inject(forwardRef(() => TasksService))
        private tasksService: TasksService,
        @Inject(forwardRef(() => TodoListService))
        private toDoListService: TodoListService
    ) {}

    async createProgect(dto: CreateProgectDto, paramUser: User): Promise<Progect> {
        
        if(paramUser && dto.userId !== paramUser.id) {
            throw new HttpException('Нет прав доступа', HttpStatus.NOT_FOUND);
        }

        const user = await this.userService.getOnlyUserById(dto.userId);
        
        if (user) {
            const progect = await this.progectRepository.save(dto);
            progect.user = user;
            return progect;
        }
        throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
    }

    //async getAllProjects(): Promise<Progect[]> {

    //}

    async getOnlyProgectById(byId: number): Promise<Progect> {
        const progect = await this.progectRepository.findOne({
            where: {
                id: byId,
            }
        });

        if(progect) {
            return progect;
        }
        
        throw new HttpException('Проект не найден', HttpStatus.NOT_FOUND);
    }

    async getProgectById(byId: number, user: User): Promise<Progect> {

        if(user && !await this.verifiProgectId(user, byId)) {
            throw new HttpException('Нет прав доступа либо проект не существует', HttpStatus.NOT_FOUND);
        }

        const progect = await this.progectRepository.findOne({
            where: {
                id: byId
            },
            relations: {
                toDoLists: true,
            },
            order: {
                toDoLists: {
                    position: 'ASC'
                },
            }
        });

        if (progect.toDoLists && progect.toDoLists.length > 0)
        {
            for (let list of progect.toDoLists)
            {
                list.tasks = await this.tasksService.getTasksByListId(list.id);
            }
        }

        return progect;
    }

    async deleteProgect(byId: number, user: User) {

        if(user && !await this.verifiProgectId(user, byId)) {
            throw new HttpException('Нет прав доступа либо проект не существует', HttpStatus.NOT_FOUND);
        }
        
        const progect = await this.getProgectById(byId, null);

        if(progect.toDoLists.length > 0)
        {
            for(let list of progect.toDoLists) {
                await this.toDoListService.deleteList(list.id, null);
            }

        }
        
        const c = await this.progectRepository.delete(byId);
        
        return c.affected > 0;
    }

    async verifiProgectId(user: User, progectId: number) {
        const progect = await this.progectRepository.count({
            where: {
                id: progectId,
                userId: user.id
            }
        });

        console.log(progect);

        return progect === 1;
    }

}
