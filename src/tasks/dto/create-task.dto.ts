import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString, Length } from "class-validator";


export class CreateTaskDto {

    @ApiProperty({example: '1', description: 'Идентификатор to-do листа'})
    @IsNumber({}, {message: 'Должно быть числом'})
    readonly toDoListId: number;

    @ApiProperty({example: 'Титульный лист', description: 'Наименование задачи'})
    @IsString({message: 'Должно быть строкой'})
    @Length(3, 50, {message: 'Не меньше 3 и не более 50 знаков'})
    readonly name: string;

    @ApiProperty({example: 'Напечатать титульный лист', description: 'Описание задачи'})
    @IsString({message: 'Должно быть строкой'})
    @Length(3, 2000, {message: 'Не меньше 3 и не более 2000 знаков'})
    readonly description: string;
}