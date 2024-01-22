import { Controller, Post, Body, Get, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { ArtistDto } from './dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '../auth/guard';

@Controller('artist')
@ApiTags('artist')
export class ArtistController {
    constructor(private readonly artistService: ArtistService) { }

    @Post('/')
    @UseGuards(JwtGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create New Artist' })
    @ApiResponse({ status: 201, description: 'The artist has been successfully created' })
    @ApiResponse({ status: 400, description: 'Request body format is incorrect' })
    @ApiBody({ type: ArtistDto })
    createArtist(
        @Body() dto: ArtistDto
    ) {
        try {
            return this.artistService.createArtist(dto);
        } catch (error) {
            return { error: error.message }
        }
    }

    @Get('/')
    @ApiOperation({ summary: 'Get All Artists' })
    @ApiResponse({ status: 200, description: 'Return all artists' })
    @ApiResponse({ status: 404, description: 'Artists not found' })
    async getAllArtists() {
        try {
            return this.artistService.getAllArtists();
        } catch (error) {
            return { error: error.message }
        }
    }

    @Get('/:artistId')
    @ApiOperation({ summary: 'Get Artist by ID' })
    @ApiResponse({ status: 200, description: 'Return the artist with the specified ID' })
    @ApiResponse({ status: 404, description: 'Artist not found' })
    async getArtistById(
        @Param('artistId') artistId: string
    ) {
        try {
            return this.artistService.getArtistById(artistId);
        } catch (error) {
            return { error: error.message }
        }
    }

    @Patch('/:artistId')
    @UseGuards(JwtGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update Artist' })
    @ApiResponse({ status: 200, description: 'Return the updated artist data' })
    @ApiResponse({ status: 400, description: 'Invalid request or artist not found' })
    @ApiBody({ type: ArtistDto })
    async updateArtist(
        @Param('artistId') artistId: string,
        @Body() dto: ArtistDto
    ) {
        try {
            return this.artistService.updateArtist(artistId, dto);
        } catch (error) {
            return { error: error.message }
        }
    }

    @Delete('/:artistId')
    @UseGuards(JwtGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete Artist by ID' })
    @ApiResponse({ status: 200, description: 'The artist has been successfully deleted' })
    @ApiResponse({ status: 404, description: 'Artist not found' })
    async deleteArtist(
        @Param('artistId') artistId: string
    ) {
        try {
            return this.artistService.deleteArtist(artistId);
        } catch (error) {
            return { error: error.message }
        }
    }
}
