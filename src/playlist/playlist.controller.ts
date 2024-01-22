import { Controller, Post, Body, Param, Delete, UseGuards, Get } from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { PlayListDto } from './dto';
import { PlaylistService } from './playlist.service';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('playlist')
@ApiTags('playlist')
@ApiBearerAuth()
@UseGuards(JwtGuard)
export class PlaylistController {
    constructor(private readonly playListService: PlaylistService) { }

    @Post("/:userId")
    @ApiOperation({ summary: 'Create Playlist' })
    @ApiResponse({ status: 201, description: 'Playlist created successfully' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiBody({ type: PlayListDto })
    async createPlaylist(
        @Param("userId") userId: string,
        @Body() dto: PlayListDto
    ) {
        try {
            return this.playListService.createPlayList(userId, dto);
        } catch (error) {
            return { error: error.message };
        }
    }

    @Get('/user/:userId')
    @ApiOperation({ summary: 'Get All Playlists of a User' })
    @ApiResponse({ status: 200, description: 'Return all playlists of the user' })
    @ApiResponse({ status: 404, description: 'User not found' })
    async getMyAllPlaylist(
        @Param('userId') userId: string
    ) {
        try {
            return this.playListService.getMyAllPlaylist(userId);
        } catch (error) {
            return { error: error.message };
        }
    }

    @UseGuards(JwtGuard)
    @ApiOperation({ summary: 'Get Playlist by ID' })
    @ApiResponse({ status: 200, description: 'Return the playlist with the specified ID' })
    @ApiResponse({ status: 404, description: 'Playlist not found' })
    async getPlayListById(
        @Param('playlistId') playlistId: string
    ) {
        try {
            return this.playListService.getMyPlayListById(playlistId);
        } catch (error) {
            return { error: error.message };
        }
    }

    @Delete('/:playlistId')
    @ApiOperation({ summary: 'Delete Playlist by ID' })
    @ApiResponse({ status: 200, description: 'Playlist deleted successfully' })
    @ApiResponse({ status: 404, description: 'Playlist not found' })
    async deletePlaylist(
        @Param('playlistId') playlistId: string
    ) {
        try {
            return this.playListService.deletePlayList(playlistId);
        } catch (error) {
            return { error: error.message };
        }
    }
}
