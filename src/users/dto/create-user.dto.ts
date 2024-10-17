import { ApiProperty } from "@nestjs/swagger";
import { IsString, Length } from "class-validator";


export class CreateUserDto{

    @ApiProperty({example: `Иван`, description: `Имя пользователя`})
    @IsString({message: 'Должно быть строкой'})
    readonly name: string;

    @ApiProperty({example: `Darth Vader`, description: `Псевдоним пользователя`})
    @IsString({message: 'Должно быть строкой'})
    @Length(3, 16, {message: 'Не меньше 3 и не более 20 знаков'})
    readonly nickname: string;

    @ApiProperty({example: `qwerty`, description: `Пароль`})
    @IsString({message: 'Должно быть строкой'})
    @Length(4, 16, {message: 'Не меньше 4 и не более 20 знаков'})
    readonly password: string;
}