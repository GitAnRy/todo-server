import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString, Length } from "class-validator";

export class CreateProgectDto {

    @ApiProperty({example: '1', description: 'Идентефикатор пользователя'})
    @IsNumber({}, {message: 'Должно быть числом'})
    readonly userId: number;

    @ApiProperty({example: 'Дипломная работа', description: 'Наименование проекта'})
    @IsString({message: 'Должно быть строкой'})
    @Length(3, 50, {message: 'Не меньше 3 и не более 50 знаков'})
    readonly name: string;

    @ApiProperty({example: 'Дорожная карта по подготовке диплома', description: 'Описание проекта'})
    @IsString({message: 'Должно быть строкой'})
    @Length(3, 2000, {message: 'Не меньше 3 и не более 2000 знаков'})
    readonly description: string;
}