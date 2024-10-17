import { forwardRef, Module } from '@nestjs/common';
import { ProgectsController } from './progects.controller';
import { ProgectsService } from './progects.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Progect } from './progects.model';
import { User } from 'src/users/users.model';
import { UsersModule } from 'src/users/users.module';
import { ToDoList } from 'src/todo-list/todo-list.model';
import { TasksModule } from 'src/tasks/tasks.module';
import { Task } from 'src/tasks/tasks.model';
import { TodoListModule } from 'src/todo-list/todo-list.module';

@Module({
  controllers: [ProgectsController],
  providers: [ProgectsService],
  imports: [
    TypeOrmModule.forFeature([Progect, User, ToDoList, Task]),
    forwardRef(() => UsersModule),
    TasksModule,
    TodoListModule
  ],
  exports: [ProgectsService]
})
export class ProgectsModule {}
