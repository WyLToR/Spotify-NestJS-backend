import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";


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
}