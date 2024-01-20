import { Controller, Post, Body, Get, Param, HttpStatus, ParseIntPipe, Patch, Delete } from '@nestjs/common';
import { SongService } from './song.service';
import { SongDto } from './dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('song')
@Controller('song')
export class SongController {
    constructor(private readonly songService: SongService) { }

    @Post('/')
    @ApiOperation({ summary: 'Create New Song' })
    @ApiResponse({ status: 201, description: 'The song has been successfully created' })
    @ApiResponse({ status: 400, description: 'Request body format is incorrect' })
    @ApiBody({ type: SongDto })
    async createSong(@Body() dto: SongDto) {
        try {
            return this.songService.createSong(dto);
        } catch (error) {
            return { error: error.message }
        }
    }

    @Get('/')
    @ApiOperation({ summary: 'Get All Songs' })
    @ApiResponse({ status: 200, description: 'Return all songs' })
    @ApiResponse({ status: 404, description: 'Songs not found' })
    async getAllSong() {
        try {
            return this.songService.getAllSong();
        } catch (error) {
            return { error: error.message }
        }
    }

    @Get('/:songId')
    @ApiOperation({ summary: 'Get Song by ID' })
    @ApiResponse({ status: 200, description: 'Return the song with the specified ID' })
    @ApiResponse({ status: 404, description: 'Song not found' })
    async getSongById(
        @Param('songId', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }))
        songId: number
    ) {
        try {
            return this.songService.getSongById(songId);
        } catch (error) {
            return { error: error.message }
        }
    }

    @Patch('/:songId')
    @ApiOperation({ summary: 'Update Song' })
    @ApiResponse({ status: 200, description: 'Return the updated song data' })
    @ApiResponse({ status: 400, description: 'Invalid request or song not found' })
    @ApiBody({ type: SongDto })
    async updateSong(
        @Param('songId', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }))
        songId: number,
        @Body() dto: SongDto
    ) {
        try {
            return this.songService.updateSong(songId, dto);
        } catch (error) {
            return { error: error.message }
        }
    }

    @Delete('/:songId')
    @ApiOperation({ summary: 'Delete Song by ID' })
    @ApiResponse({ status: 200, description: 'The song has been successfully deleted' })
    @ApiResponse({ status: 404, description: 'Song not found' })
    async deleteSong(
        @Param('songId', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }))
        songId: number
    ) {
        try {
            return this.songService.deleteSong(songId);
        } catch (error) {
            return { error: error.message }
        }
    }
}
