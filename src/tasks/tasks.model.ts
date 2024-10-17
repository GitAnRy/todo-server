import { ApiProperty } from "@nestjs/swagger";
import { ToDoList } from "src/todo-list/todo-list.model";
import { Column, CreateDateColumn, Entity, Generated, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity({name: 'tasks'})
export class Task {

    @ApiProperty({example: '1', description: 'ID задачи'})
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({example: '1', description: 'Позиция для сортировки'})
    @Column({type: 'int'})
    position: number;


    @ApiProperty({example: 'Титульный лист', description: 'Наименование задачи'})
    @Column({type: 'varchar', length: 100})
    name: string;

    @ApiProperty({example: 'Напечатать титульный лист', description: 'Описание задачи'})
    @Column({type: 'varchar', length: 1000})
    description: string;

    @ApiProperty({example: '2024.08.15 12:16:55', description: 'Время создания'})
    @CreateDateColumn()
    date: Date;

    @ApiProperty({example: 'toDoListId', description: 'ID списка задач'})
    @Column({ nullable: true })
    toDoListId: number

    @ManyToOne(() => ToDoList, (toDoList) => toDoList.tasks)
    toDoList: ToDoList;
}