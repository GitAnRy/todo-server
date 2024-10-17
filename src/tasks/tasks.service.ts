import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './tasks.model';
import { Between, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { TodoListService } from 'src/todo-list/todo-list.service';
import { SetPositionTask } from './dto/set-position-task.dto';
import { User } from 'src/users/users.model';

@Injectable()
export class TasksService {

    constructor(
        @InjectRepository(Task)
        private taskRepository: Repository<Task>,
        @Inject(forwardRef(() => TodoListService))
        private toDoListService: TodoListService
    ) {}

    async createTask(dto: CreateTaskDto, user: User): Promise<Task> {

        if(user && !await this.verifiTaskId(user, dto.toDoListId)) {
            throw new HttpException('Нет прав доступа', HttpStatus.NOT_FOUND);
        }

        const list = await this.toDoListService.getOnlyToDoListById(dto.toDoListId);
        
        if(list) {
            const position = await this.getCount(dto.toDoListId) + 1;
            const task = await this.taskRepository.save({...dto, position: position});
            task.toDoList = list;
            return task;
        }

        throw new HttpException('to-do лист не найден', HttpStatus.NOT_FOUND);
    }

    async getTaskById(byId: number, user: User): Promise<Task> {

        const task = await this.taskRepository.findOne({
            where: {
                id: byId,
            },
        });

        if(task) {

            if(user && !await this.verifiTaskId(user, task.toDoListId)) {
                throw new HttpException('Нет прав доступа', HttpStatus.NOT_FOUND);
            }

            return task;

        }

        throw new HttpException('Задача не найдена', HttpStatus.NOT_FOUND);

        
    }

    async getTasksByListId(byId: number): Promise<Task[]> {
        const tasks = await this.taskRepository.find({
            where: {
                toDoListId: byId,
            },
            order: {
                position: 'ASC',
            }
        });

        return tasks;
    }

    async setPositionTask(dto: SetPositionTask, user: User): Promise<Task> {

        const task = await this.getTaskById(dto.taskId, null);

        if(task) {

            if(user && !await this.verifiTaskId(user, task.toDoListId)) {
                throw new HttpException('Нет прав доступа', HttpStatus.NOT_FOUND);
            }

            if(task.toDoListId !== dto.fromToDoListId) {

                const list = await this.toDoListService.getOnlyToDoListById(dto.fromToDoListId);

                if (list) {

                    const countFrom = await this.getCount(task.toDoListId);

                    if (task.position < countFrom) {

                        await this.biasPositions(task.toDoListId, task.position, countFrom, -1);
                        
                    }

                    const countTo = await this.getCount(dto.fromToDoListId);

                    if (dto.fromPosition < countTo) {

                        await this.biasPositions(dto.fromToDoListId, dto.fromPosition, countTo, 1);
                        
                        task.position = dto.fromPosition;
                    } else {
                        task.position = countTo + 1;
                    }
                    
                    task.toDoListId = dto.fromToDoListId;
                    task.toDoList = list;
                    await this.taskRepository.save(task);
                    return task;
                }

                throw new HttpException('Список задач не найден', HttpStatus.NOT_FOUND);
            }

            const count = await this.getCount(task.toDoListId);
                let position = (dto.fromPosition > count)? count:
                    (dto.fromPosition <= 0)? 1:dto.fromPosition;
                
                if(position !== task.position) {
                    
                    const start = Math.min(position, task.position);
                    const end = Math.max(position, task.position);

                    await this.biasPositions(task.toDoListId, start, end, (position > task.position)? -1:1);
                    
                    task.position = position;
                    await this.taskRepository.save(task);
    
                    return task;
                }

                throw new HttpException('Позиция равна себе', HttpStatus.NOT_FOUND);
            
        }
        
        throw new HttpException('Задача не найдена', HttpStatus.NOT_FOUND);
    }

    async biasPositions(listId: number, start: number, end: number, val: number) {
        await this.taskRepository.increment({
            toDoListId: listId,
            position: Between(start, end),
        }, 'position',  val);
    }

    async getCount(toDoListId: number): Promise<number> {
        const count = await this.taskRepository.count({
            where: {
                toDoListId: toDoListId,
            }
        });

        return count;
    }

    async deleteTask(byId: number, user) {

        const task = await this.getTaskById(byId, null);

        if(task) {

            if(user && !await this.verifiTaskId(user, task.toDoListId)) {
                throw new HttpException('Нет прав доступа', HttpStatus.NOT_FOUND);
            }

            const count = await this.getCount(task.toDoListId);

            if (task.position < count) {

                await this.biasPositions(task.toDoListId, task.position, count, -1);
                
            }

            const c = await this.taskRepository.delete(byId);
            return c.affected > 0;

        }

        throw new HttpException('Задача не найдена', HttpStatus.NOT_FOUND);
    }

    async deleteTaskByToDoListId(byId: number) {
        const c = await this.taskRepository.delete({toDoListId: byId});
        return c.affected > 0;
    }

    async verifiTaskId(user: User, toDoListId: number) {

        return this.toDoListService.verifiToDoListId(user, toDoListId, null);
    }

}
