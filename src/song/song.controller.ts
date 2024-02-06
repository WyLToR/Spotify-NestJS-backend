import {
  Bind,
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { SongService } from './song.service';
import { SongDto } from './dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '../auth/guard';
import { PlaylistService } from '../playlist/playlist.service';
import { RolesGuard } from '../auth/roles';
import { Roles } from '../auth/decorators';
import Role from '../utils/role.enum';
import { CustomUploadFileTypeValidator } from './validator';
import { FileInterceptor } from '@nestjs/platform-express';
import { FirebaseService } from 'src/firebase/firebase.service';


const MAX_SONG_SIZE = 2 * 1024 * 1024;
const VALID_SONG_MIME_TYPES = [
  'audio/mpeg', 'audio/aac', 'audio/midi', 'audio/x-midi',
  'audio/ogg', 'audio/opus', 'audio/wav', 'audio/webm',
];


@ApiTags('song')
@Controller('song')
export class SongController {
  constructor(
    private readonly songService: SongService,
    private readonly playListService: PlaylistService,
  ) {
  }

  @Post('/:albumId')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('songFile'))
  @ApiOperation({ summary: 'Create New Song' })
  @ApiResponse({ status: 201, description: 'The song has been successfully created' })
  @ApiResponse({ status: 400, description: 'Request body format is incorrect' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        songFile: { type: 'string', format: 'binary' },
      },
      required: ['title', 'songFile'],
    },
  })
  async createSong(
    @Param('albumId') albumId: string,
    @Body() dto: any,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addValidator(
          new CustomUploadFileTypeValidator({
            fileType: VALID_SONG_MIME_TYPES,
          }),
        )
        .addMaxSizeValidator({ maxSize: MAX_SONG_SIZE })
        .build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY })
    )
    songFile: Express.Multer.File,
  ) {
    try {
      return this.songService.createSong(albumId, dto, songFile);
    } catch (error) {
      return { error: error.message };
    }
  }



  @Get('/')
  @Roles(Role.USER, Role.ADMIN)
  @ApiOperation({ summary: 'Get All Songs' })
  @ApiResponse({ status: 200, description: 'Return all songs' })
  @ApiResponse({ status: 404, description: 'Songs not found' })
  async getAllSong() {
    try {
      return this.songService.getAllSong();
    } catch (error) {
      return { error: error.message };
    }
  }

  @Post('/:playListId/:songId')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.USER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add Song to Playlist' })
  @ApiResponse({ status: 201, description: 'The song has been successfully added to the playlist' })
  @ApiResponse({ status: 400, description: 'Invalid playlist or song ID' })
  async addSongToPlayList(
    @Param('playListId') playListId: string,
    @Param('songId') songId: string,
  ) {
    try {
      return this.playListService.addSongToPlayList(playListId, songId);
    } catch (error) {
      return { error: error.message };
    }
  }

  @Delete('/:playlistId/:songId')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.USER, Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete Song from Playlist' })
  @ApiResponse({ status: 200, description: 'The song has been successfully removed from the playlist' })
  @ApiResponse({ status: 400, description: 'Invalid playlist or song ID' })
  async deleteSongFromPlaylist(
    @Param('playlistId') playlistId: string,
    @Param('songId') songId: string,
  ) {
    try {
      return this.playListService.deleteSongFromPlayList(playlistId, songId);
    } catch (error) {
      return { error: error.message };
    }
  }

  @Get('/:songId')
  @ApiOperation({ summary: 'Get Song by ID' })
  @ApiResponse({ status: 200, description: 'Return the song with the specified ID' })
  @ApiResponse({ status: 404, description: 'Song not found' })
  async getSongById(
    @Param('songId') songId: string,
  ) {
    try {
      return this.songService.getSongById(songId);
    } catch (error) {
      return { error: error.message };
    }
  }

  @Patch('/:albumId/:songId')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @UseInterceptors(FileInterceptor('songFile'))
  @ApiOperation({ summary: 'Update Song' })
  @ApiResponse({ status: 200, description: 'Return the updated song data' })
  @ApiResponse({ status: 400, description: 'Invalid request or song not found' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        songFile: { type: 'string', format: 'binary' },
      },
      required: ['title', 'songFile'],
    },
  })
  async updateSong(
    @Param('albumId') albumId: string,
    @Param('songId') songId: string,
    @Body() dto: SongDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addValidator(
          new CustomUploadFileTypeValidator({
            fileType: VALID_SONG_MIME_TYPES,
          }),
        )
        .addMaxSizeValidator({ maxSize: MAX_SONG_SIZE })
        .build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY })
      ,
    )
    songFile: Express.Multer.File,
  ) {
    try {
      return this.songService.updateSong(albumId, songId, dto, songFile);
    } catch (error) {
      return { error: error.message };
    }
  }

  @Delete('/:songId')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete Song by ID' })
  @ApiResponse({ status: 200, description: 'The song has been successfully deleted' })
  @ApiResponse({ status: 404, description: 'Song not found' })
  async deleteSong(
    @Param('songId') songId: string,
  ) {
    try {
      return this.songService.deleteSong(songId);
    } catch (error) {
      return { error: error.message };
    }
  }
}
