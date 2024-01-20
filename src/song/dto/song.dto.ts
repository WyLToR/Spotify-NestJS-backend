import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";

export class SongDto {
    @ApiProperty({
        description: "Song title",
        default: "Lonely Day",
        type: String
    })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({
        description: "Album ID",
        default: 1,
        type: Number
    })
    @IsNotEmpty()
    albumId: number;

    @ApiProperty({
        description: "Duration of song",
        default: 4,
        type: Number
    })
    @IsNotEmpty()
    duration: number;
}