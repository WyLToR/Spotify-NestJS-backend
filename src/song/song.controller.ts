import { Controller, Post, Body, Get, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { SongService } from './song.service';
import { SongDto } from './dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '../auth/guard';
import { PlaylistService } from '../playlist/playlist.service';

@ApiTags('song')
@Controller('song')
export class SongController {
    constructor(
        private readonly songService: SongService,
        private readonly playListService: PlaylistService
    ) { }

    @Post('/:albumId')
    @UseGuards(JwtGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create New Song' })
    @ApiResponse({ status: 201, description: 'The song has been successfully created' })
    @ApiResponse({ status: 400, description: 'Request body format is incorrect' })
    @ApiBody({ type: SongDto })
    async createSong(
        @Param('albumId') albumId: string,
        @Body() dto: SongDto
    ) {
        try {
            return this.songService.createSong(albumId, dto);
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

    @Post('/:playListId/:songId')
    @UseGuards(JwtGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Add Song to Playlist' })
    @ApiResponse({ status: 201, description: 'The song has been successfully added to the playlist' })
    @ApiResponse({ status: 400, description: 'Invalid playlist or song ID' })
    async addSongToPlayList(
        @Param('playListId') playListId: string,
        @Param('songId') songId: string
    ) {
        try {
            return this.playListService.addSongToPlayList(playListId, songId)
        } catch (error) {
            return { error: error.message }
        }
    }

    @Delete('/:playlistId/:songId')
    @UseGuards(JwtGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete Song from Playlist' })
    @ApiResponse({ status: 200, description: 'The song has been successfully removed from the playlist' })
    @ApiResponse({ status: 400, description: 'Invalid playlist or song ID' })
    async deleteSongFromPlaylist(
        @Param('playlistId') playlistId: string,
        @Param('songId') songId: string
    ) {
        try {
            return this.playListService.deleteSongFromPlayList(playlistId, songId)
        } catch (error) {
            return { error: error.message }
        }
    }
    
    @Get('/:songId')
    @ApiOperation({ summary: 'Get Song by ID' })
    @ApiResponse({ status: 200, description: 'Return the song with the specified ID' })
    @ApiResponse({ status: 404, description: 'Song not found' })
    async getSongById(
        @Param('songId') songId: string
    ) {
        try {
            return this.songService.getSongById(songId);
        } catch (error) {
            return { error: error.message }
        }
    }

    @Patch('/:albumId/:songId')
    @UseGuards(JwtGuard)
    @ApiOperation({ summary: 'Update Song' })
    @ApiResponse({ status: 200, description: 'Return the updated song data' })
    @ApiResponse({ status: 400, description: 'Invalid request or song not found' })
    @ApiBody({ type: SongDto })
    async updateSong(
        @Param('albumId') albumId: string,
        @Param('songId') songId: string,
        @Body() dto: SongDto
    ) {
        try {
            return this.songService.updateSong(albumId, songId, dto);
        } catch (error) {
            return { error: error.message }
        }
    }

    @Delete('/:songId')
    @UseGuards(JwtGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete Song by ID' })
    @ApiResponse({ status: 200, description: 'The song has been successfully deleted' })
    @ApiResponse({ status: 404, description: 'Song not found' })
    async deleteSong(
        @Param('songId') songId: string
    ) {
        try {
            return this.songService.deleteSong(songId);
        } catch (error) {
            return { error: error.message }
        }
    }
}
