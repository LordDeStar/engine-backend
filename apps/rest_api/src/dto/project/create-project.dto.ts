import { IsNumber, IsOptional, IsString, Length } from "class-validator";

export class CreateProjectDto {
    @IsString({ message: "Название проекта долюна быть строкой!" })
    @Length(3, 40, { message: "Название проекта должно быть не менее 3 и не более 40 символов!" })
    public title: string;

    @IsOptional()
    @IsString({ message: "Описание должно быть строкой!" })
    public description: string;

}