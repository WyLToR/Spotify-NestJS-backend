import { Controller, Post, Body, Get, Param, Patch, Delete, UseGuards, UseInterceptors, UploadedFile, ParseFilePipeBuilder, HttpStatus } from '@nestjs/common';
import { AlbumService } from './album.service';
import { AlbumDto } from './dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '../auth/guard';
import { RolesGuard } from '../auth/roles';
import { Roles } from '../auth/decorators';
import Role from '../utils/role.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { CustomUploadFileTypeValidator } from 'src/song/validator';
import { FirebaseService } from 'src/firebase/firebase.service';

const MAX_PICTURE_SIZE = 5 * 1024 * 1024;
const VALID_IMAGE_MIME_TYPES = [
    'image/jpeg', 'image/png', 'image/gif', 'image/bmp',
    'image/webp'
];

@Controller('album')
@ApiTags('album')
export class AlbumController {
    constructor(
        private readonly albumService: AlbumService,
    ) { }

    @Post('/:artistId')
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @ApiBearerAuth()
    @UseInterceptors(FileInterceptor('pictureFile'))
    @ApiOperation({ summary: 'Create New Album' })
    @ApiResponse({ status: 201, description: 'The album has been successfully created' })
    @ApiResponse({ status: 400, description: 'Request body format is incorrect' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                albumName: { type: 'string' },
                pictureFile: { type: 'string', format: 'binary' },
            },
            required: ['title'],
        },
    })
    async createAlbum(
        @Param('artistId') artistId: string,
        @Body() dto: AlbumDto,
        @UploadedFile(
            new ParseFilePipeBuilder()
                .addValidator(
                    new CustomUploadFileTypeValidator({
                        fileType: VALID_IMAGE_MIME_TYPES,
                    }),
                )
                .addMaxSizeValidator({ maxSize: MAX_PICTURE_SIZE })
                .build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY })
            ,
        )
        pictureFile: Express.Multer.File,
    ) {
        try {
            return this.albumService.createAlbum(artistId, dto, pictureFile);
        } catch (error) {
            return { error: error.message }
        }
    }

    @Get('/')
    @Roles(Role.USER, Role.ADMIN)
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
    @Roles(Role.USER, Role.ADMIN)
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
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @ApiBearerAuth()
    @UseInterceptors(FileInterceptor('pictureFile'))
    @ApiOperation({ summary: 'Update Album' })
    @ApiResponse({ status: 200, description: 'Return the updated album data' })
    @ApiResponse({ status: 400, description: 'Invalid request or album not found' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                albumName: { type: 'string' },
                pictureFile: { type: 'string', format: 'binary' },
            },
            required: ['title'],
        },
    })
    async updateAlbum(
        @Param('artistId') artistId: string,
        @Param('albumId') albumId: string,
        @Body() dto: AlbumDto,
        @UploadedFile(
            new ParseFilePipeBuilder()
                .addValidator(
                    new CustomUploadFileTypeValidator({
                        fileType: VALID_IMAGE_MIME_TYPES,
                    }),
                )
                .addMaxSizeValidator({ maxSize: MAX_PICTURE_SIZE })
                .build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY })
            ,
        )
        pictureFile: Express.Multer.File,
    ) {
        try {
            return this.albumService.updateAlbum(artistId, albumId, dto, pictureFile);
        } catch (error) {
            return { error: error.message }
        }
    }

    @Delete('/:albumId')
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(Role.ADMIN)
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
