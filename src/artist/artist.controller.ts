import { Controller, Post, Body, Get, Param, Patch, Delete, UseGuards, UploadedFile, ParseFilePipeBuilder, HttpStatus, UseInterceptors } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { ArtistDto } from './dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '../auth/guard';
import { RolesGuard } from '../auth/roles';
import { Roles } from '../auth/decorators';
import Role from '../utils/role.enum';
import { CustomUploadFileTypeValidator } from 'src/song/validator';
import { FileInterceptor } from '@nestjs/platform-express';

const MAX_PICTURE_SIZE = 5 * 1024 * 1024;
const VALID_IMAGE_MIME_TYPES = [
    'image/jpeg', 'image/png', 'image/gif', 'image/bmp',
    'image/webp'
];

@Controller('artist')
@ApiTags('artist')
export class ArtistController {
    constructor(private readonly artistService: ArtistService) { }

    @Post('/')
    @UseGuards(JwtGuard, RolesGuard)
    @ApiBearerAuth()
    @UseInterceptors(FileInterceptor('pictureFile'))
    @ApiOperation({ summary: 'Create New Artist' })
    @ApiResponse({ status: 201, description: 'The artist has been successfully created' })
    @ApiResponse({ status: 400, description: 'Request body format is incorrect' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                name: { type: 'string' },
                genre: { type: 'string' },
                biography: { type: 'string' },
                pictureFile: { type: 'string', format: 'binary' },
            },
            required: ['name', 'genre', 'biography'],
        },
    })
    createArtist(
        @Body() dto: ArtistDto,
        @UploadedFile(
            new ParseFilePipeBuilder()
                .addValidator(
                    new CustomUploadFileTypeValidator({
                        fileType: VALID_IMAGE_MIME_TYPES,
                    }),
                )
                .addMaxSizeValidator({ maxSize: MAX_PICTURE_SIZE })
                .build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY })
        )
        pictureFile: Express.Multer.File,
    ) {
        try {
            return this.artistService.createArtist(dto, pictureFile);
        } catch (error) {
            return { error: error.message }
        }
    }

    @Get('/')
    @Roles(Role.USER, Role.ADMIN)
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
    @Roles(Role.USER, Role.ADMIN)
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
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update Artist' })
    @ApiResponse({ status: 200, description: 'Return the updated artist data' })
    @ApiResponse({ status: 400, description: 'Invalid request or artist not found' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                name: { type: 'string' },
                genre: { type: 'string' },
                biography: { type: 'string' },
                pictureFile: { type: 'string', format: 'binary' },
            },
            required: ['name', 'genre', 'biography'],
        },
    })
    async updateArtist(
        @Param('artistId') artistId: string,
        @Body() dto: ArtistDto,
        @UploadedFile(
            new ParseFilePipeBuilder()
                .addValidator(
                    new CustomUploadFileTypeValidator({
                        fileType: VALID_IMAGE_MIME_TYPES,
                    }),
                )
                .addMaxSizeValidator({ maxSize: MAX_PICTURE_SIZE })
                .build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY })
        )
        pictureFile: Express.Multer.File,
    ) {
        try {
            return this.artistService.updateArtist(artistId, dto, pictureFile);
        } catch (error) {
            return { error: error.message }
        }
    }

    @Delete('/:artistId')
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(Role.ADMIN)
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
