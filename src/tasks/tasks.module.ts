import { forwardRef, Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './tasks.model';
import { ToDoList } from 'src/todo-list/todo-list.model';
import { TodoListModule } from 'src/todo-list/todo-list.module';
import { User } from 'src/users/users.model';

@Module({
  controllers: [TasksController],
  providers: [TasksService],
  imports: [
    TypeOrmModule.forFeature([Task, ToDoList, User]),
    TodoListModule
  ],
  exports: [TasksService]
})
export class TasksModule {}
