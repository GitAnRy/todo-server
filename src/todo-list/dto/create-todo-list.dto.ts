import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString, Length } from "class-validator";


export class CreateToDoListDto {

    @ApiProperty({example: '1', description: 'Идентификатор проекта'})
    @IsNumber({}, {message: 'Должно быть числом'})
    readonly progectId: number;

    @ApiProperty({example: 'to-do', description: 'Наименование листа'})
    @IsString({message: 'Должно быть строкой'})
    @Length(3, 50, {message: 'Не меньше 3 и не более 50 знаков'})
    readonly name: string;

    @ApiProperty({example: 'Планирую в работу', description: 'Описание листа'})
    @IsString({message: 'Должно быть строкой'})
    @Length(3, 2000, {message: 'Не меньше 3 и не более 2000 знаков'})
    readonly description: string;
}