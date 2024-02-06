import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsString, IsStrongPassword } from "class-validator";

export class UserDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsStrongPassword()
    password: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    firstName?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    lastName?: string;

    @ApiProperty({ type: 'string', format: 'binary', required: false })
    @IsOptional()
    pictureFile?: Express.Multer.File;
}