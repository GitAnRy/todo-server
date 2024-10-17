import { ApiProperty } from "@nestjs/swagger";
import { ToDoList } from "src/todo-list/todo-list.model";
import { User } from "src/users/users.model";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity({name: 'progects'})
export class Progect {

    @ApiProperty({example: '1', description: 'ID проекта'})
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({example: 'Дипломная работа', description: 'Наименование проекта'})
    @Column({type: 'varchar'})
    name: string;

    @ApiProperty({example: 'Дорожная карта по подготовке диплома', description: 'Описание проекта'})
    @Column({type: 'varchar'})
    description: string;

    @ApiProperty({example: '2024.08.15 12:16:55', description: 'Время создания'})
    @CreateDateColumn()
    date: Date;

    @ApiProperty({example: 'userId', description: 'ID пользователя'})
    @Column({ nullable: true })
    userId: number

    @ManyToOne(() => User, (user) => user.progects)
    user: User;

    @ApiProperty({example: 'toDoLists', description: 'Список to-do листов с задачами'})
    @OneToMany(() => ToDoList, (toDoList) => toDoList.progect)
    toDoLists: ToDoList[];

}