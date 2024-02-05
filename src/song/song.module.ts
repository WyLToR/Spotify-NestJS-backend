import { Module } from '@nestjs/common';
import { SongController } from './song.controller';
import { SongService } from './song.service';
import { PlaylistService } from '../playlist/playlist.service';
import { JwtStrategy } from '../auth/strategy';
import { PrismaService } from '../db/prisma.service';
import { FirebaseModule } from 'src/firebase/firebase.module';

@Module({
    imports:[FirebaseModule],
    controllers: [SongController],
    providers: [SongService, JwtStrategy, PlaylistService, PrismaService]
})
export class SongModule {}
