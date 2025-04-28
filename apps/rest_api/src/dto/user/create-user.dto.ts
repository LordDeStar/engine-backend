import { IsString, Length, Matches, MinLength } from "class-validator";

export class CreateUserDto {
    @IsString({ message: "Имя пользователя должно быть строкой!" })
    @Length(3, 40, { message: "Имя пользователя должно содержать не меньше 3 и не больше 40 символов!" })
    public readonly username: string

    @IsString({ message: "Пароль должен быть строкой!" })
    @MinLength(8, { message: "Пароль должен содержать не меньге 8 символов!" })
    @Matches(/^(?=.*[A-Z])(?=.*\d).+$/, { message: "Пароль должен содержать заглавные буквы и цифры!" })
    public readonly password: string
}