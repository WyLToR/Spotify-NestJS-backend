import {ApiProperty} from "@nestjs/swagger";
import {IsString, IsNotEmpty} from "class-validator";

export class SongDto {
    @ApiProperty({
        description: "Song title",
        default: "Lonely Day",
        type: String
    })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({ type: 'string', format: 'binary', required: true })
    songFile?: Express.Multer.File;
}