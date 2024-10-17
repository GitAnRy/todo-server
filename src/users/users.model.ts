import { ApiProperty } from "@nestjs/swagger";
import { Progect } from "src/progects/progects.model";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity({name:'users'})
export class User {

    @ApiProperty({example: '1', description: 'ID пользователя'})
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({example: 'Иван', description: 'Имя пользователя'})
    @Column({type: 'varchar'})
    name: string;

    @ApiProperty({example: 'Darth Vader', description: 'Псевдоним пользователя'})
    @Column({type: 'varchar'})
    nickname: string;

    @ApiProperty({example: 'qwerty', description: 'Пароль'})
    @Column({type: 'varchar'})
    password: string;

    @ApiProperty({example: 'Progects', description: 'Список проектов пользователя'})
    @OneToMany(() => Progect, (progect) => progect.user)
    progects: Progect[];
}