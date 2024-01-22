import { Controller, Post, Body, Get, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { AlbumService } from './album.service';
import { AlbumDto } from './dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guard';

@Controller('album')
@ApiTags('album')
export class AlbumController {
    constructor(private readonly albumService: AlbumService) { }

    @Post('/:artistId')
    @UseGuards(JwtGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create New Album' })
    @ApiResponse({ status: 201, description: 'The album has been successfully created' })
    @ApiResponse({ status: 400, description: 'Request body format is incorrect' })
    @ApiBody({ type: AlbumDto })
    async createAlbum(
        @Param('artistId') artistId: string,
        @Body() dto: AlbumDto
    ) {
        try {
            return this.albumService.createAlbum(artistId, dto);
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
        @Param('albumId') albumId: string
    ) {
        try {
            return this.albumService.getAlbumById(albumId);
        } catch (error) {
            return { error: error.message }
        }
    }

    @Patch('/:artistId/:albumId')
    @UseGuards(JwtGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update Album' })
    @ApiResponse({ status: 200, description: 'Return the updated album data' })
    @ApiResponse({ status: 400, description: 'Invalid request or album not found' })
    @ApiBody({ type: AlbumDto })
    async updateAlbum(
        @Param('artistId') artistId: string,
        @Param('albumId') albumId: string,
        @Body() dto: AlbumDto
    ) {
        try {
            return this.albumService.updateAlbum(artistId, albumId, dto);
        } catch (error) {
            return { error: error.message }
        }
    }

    @Delete('/:albumId')
    @UseGuards(JwtGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete Album by ID' })
    @ApiResponse({ status: 200, description: 'The album has been successfully deleted' })
    @ApiResponse({ status: 404, description: 'Album not found' })
    async deleteAlbum(
        @Param('albumId') albumId: string
    ) {
        try {
            return this.albumService.deleteAlbum(albumId);
        } catch (error) {
            return { error: error.message }
        }
    }
}
