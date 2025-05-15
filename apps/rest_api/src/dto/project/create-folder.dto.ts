import { IsNumber, IsString, Length, IsOptional } from "class-validator";

export class CreateFolderDto {
    @IsString({ message: "Название папки должно быть строкой!" })
    @Length(3, 40, { message: "Название проекта должно содержать не меньше 3 и не больше 40 символов!" })
    public title: string

    @IsNumber()
    public projectId: number

    @IsOptional()
    @IsNumber({}, { message: 'Parent ID must be a number' })
    public parentId: number | undefined

}