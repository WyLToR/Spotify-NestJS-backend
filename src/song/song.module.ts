import { Module } from '@nestjs/common';
import { SongController } from './song.controller';
import { SongService } from './song.service';
import { PlaylistService } from 'src/playlist/playlist.service';
import { JwtStrategy } from 'src/auth/strategy';

@Module({
    imports:[],
    controllers: [SongController],
    providers: [SongService, JwtStrategy, PlaylistService]
})
export class SongModule {}
