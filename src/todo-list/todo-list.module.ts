import { forwardRef, Module } from '@nestjs/common';
import { TodoListController } from './todo-list.controller';
import { TodoListService } from './todo-list.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ToDoList } from './todo-list.model';
import { Progect } from 'src/progects/progects.model';
import { ProgectsModule } from 'src/progects/progects.module';
import { Task } from 'src/tasks/tasks.model';
import { TasksModule } from 'src/tasks/tasks.module';
import { User } from 'src/users/users.model';

@Module({
  controllers: [TodoListController],
  providers: [TodoListService],
  imports: [
    TypeOrmModule.forFeature([ToDoList, Progect, Task, User]),
    forwardRef(() => ProgectsModule),
    forwardRef(() => TasksModule)
  ],
  exports: [TodoListService]
})
export class TodoListModule {}
