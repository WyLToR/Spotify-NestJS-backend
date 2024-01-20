import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";

export class AlbumDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    albumName: string;
    
    @ApiProperty()
    @IsNotEmpty()
    artistId: number;
}