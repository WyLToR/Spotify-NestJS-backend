import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsOptional } from "class-validator";

export class AlbumDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    albumName: string;

    @ApiProperty({ type: 'string', format: 'binary', required: false })
    @IsOptional()
    pictureFile?: Express.Multer.File;
}