import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";


export class SetPositionToDoList {

    @ApiProperty({example: '1', description: 'Идентификатор to-do листа'})
    @IsNumber({}, {message: 'Должно быть числом'})
    readonly toDoListId: number;

    @ApiProperty({example: '1', description: 'Позиция, на которую переместить список'})
    @IsNumber({}, {message: 'Должно быть числом'})
    readonly fromPosition: number;

}