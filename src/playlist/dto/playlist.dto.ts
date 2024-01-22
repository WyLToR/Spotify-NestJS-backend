import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class PlayListDto{
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    title: string;
}