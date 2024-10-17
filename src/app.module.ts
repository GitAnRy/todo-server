import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/users.model';
import { ProgectsModule } from './progects/progects.module';
import { TodoListModule } from './todo-list/todo-list.module';
import { TasksModule } from './tasks/tasks.module';
import { Progect } from './progects/progects.model';
import { ToDoList } from './todo-list/todo-list.model';
import { Task } from './tasks/tasks.model';
import { AuthModule } from './auth/auth.module';

//задаем настройки конфигурации приложения 
@Module({
  imports: [
    //подключаем файл env
    ConfigModule.forRoot({
      envFilePath:`.${process.env.NODE_ENV}.env`
    }),
    //конфигурация базы данных
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRESS_HOST,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRESS_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [User, Progect, ToDoList, Task],
      synchronize: true,
      autoLoadEntities: true,
    }),
    //подключаем модули приложения
    UsersModule,
    ProgectsModule,
    TodoListModule,
    TasksModule,
    AuthModule,
    
  ],
  controllers: [],
  providers: [],
})

export class AppModule {}
