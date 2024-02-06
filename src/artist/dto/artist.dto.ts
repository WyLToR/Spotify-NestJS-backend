import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsOptional } from "class-validator";


export class ArtistDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;
    
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    genre: string;
    
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    biography: string;

    @ApiProperty({ type: 'string', format: 'binary', required: false })
    @IsOptional()
    pictureFile?: Express.Multer.File;
}