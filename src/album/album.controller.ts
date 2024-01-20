import { Controller, Post, Body, Get, Param, HttpStatus, ParseIntPipe, Patch, Delete } from '@nestjs/common';
import { AlbumService } from './album.service';
import { AlbumDto } from './dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('album')
@ApiTags('album')
export class AlbumController {
    constructor(private readonly albumService: AlbumService) { }

    @Post('/')
    @ApiOperation({ summary: 'Create New Album' })
    @ApiResponse({ status: 201, description: 'The album has been successfully created' })
    @ApiResponse({ status: 400, description: 'Request body format is incorrect' })
    @ApiBody({ type: AlbumDto })
    async createAlbum(@Body() dto: AlbumDto) {
        try {
            return this.albumService.createAlbum(dto)
        } catch (error) {
            return { error: error.message }
        }
    }

    @Get('/')
    @ApiOperation({ summary: 'Get All Albums' })
    @ApiResponse({ status: 200, description: 'Return all albums' })
    @ApiResponse({ status: 404, description: 'Albums not found' })
    async getAllAlbums() {
        try {
            return this.albumService.getAllAlbums();
        } catch (error) {
            return { error: error.message }
        }
    }

    @Get('/:albumId')
    @ApiOperation({ summary: 'Get Album by ID' })
    @ApiResponse({ status: 200, description: 'Return the album with the specified ID' })
    @ApiResponse({ status: 404, description: 'Album not found' })
    async getAlbumById(
        @Param('albumId', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }))
        albumId: number
    ) {
        try {
            return this.albumService.getAlbumById(albumId);
        } catch (error) {
            return { error: error.message }
        }
    }

    @Patch('/:albumId')
    @ApiOperation({ summary: 'Update Album' })
    @ApiResponse({ status: 200, description: 'Return the updated album data' })
    @ApiResponse({ status: 400, description: 'Invalid request or album not found' })
    @ApiBody({ type: AlbumDto })
    async updateAlbum(
        @Param('albumId', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }))
        albumId: number,
        @Body() dto: AlbumDto
    ) {
        try {
            return this.albumService.updateAlbum(albumId, dto);
        } catch (error) {
            return { error: error.message }
        }
    }

    @Delete('/:albumId')
    @ApiOperation({ summary: 'Delete Album by ID' })
    @ApiResponse({ status: 200, description: 'The album has been successfully deleted' })
    @ApiResponse({ status: 404, description: 'Album not found' })
    async deleteAlbum(
        @Param('albumId', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }))
        albumId: number
    ) {
        try {
            return this.albumService.deleteAlbum(albumId);
        } catch (error) {
            return { error: error.message }
        }
    }
}
