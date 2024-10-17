import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";


export class SetPositionTask {

    @ApiProperty({example: '1', description: 'Идентификатор задачи'})
    @IsNumber({}, {message: 'Должно быть числом'})
    readonly taskId: number;

    @ApiProperty({example: '1', description: 'Новая позиция в списке'})
    @IsNumber({}, {message: 'Должно быть числом'})
    readonly fromPosition: number;

    @ApiProperty({example: '1', description: 'Идентификатор для смены to-do листа'})
    @IsNumber({}, {message: 'Должно быть числом'})
    readonly fromToDoListId: number;
}