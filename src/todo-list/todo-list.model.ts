import { ApiProperty } from "@nestjs/swagger";
import { Progect } from "src/progects/progects.model";
import { Task } from "src/tasks/tasks.model";
import { Column, CreateDateColumn, Entity, Generated, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity({name: 'lists'})
export class ToDoList {

    @ApiProperty({example: '1', description: 'ID to-do листа'})
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({example: '1', description: 'Позиция для сортировки'})
    @Column({type: 'int'})
    position: number;

    @ApiProperty({example: 'to-do', description: 'Наименование листа'})
    @Column({type: 'varchar'})
    name: string;

    @ApiProperty({example: 'Планирую в работу', description: 'Описание листа'})
    @Column({type: 'varchar'})
    description: string;

    @ApiProperty({example: '2024.08.15 12:16:55', description: 'Время создания'})
    @CreateDateColumn()
    date: Date;

    @ApiProperty({example: 'progectId', description: 'ID проекта'})
    @Column({ nullable: true })
    progectId: number

    @ManyToOne(() => Progect, (progect) => progect.toDoLists)
    progect: Progect;

    @ApiProperty({example: 'Tasks', description: 'Список задач'})
    @OneToMany(() => Task, (task) => task.toDoList)
    tasks: Task[];
}