import { Module } from '@nestjs/common';
import { AlbumController } from './album.controller';
import { AlbumService } from './album.service';
import { PrismaService } from '../db/prisma.service';
import { JwtStrategy } from '../auth/strategy';
import { FirebaseService } from 'src/firebase/firebase.service';

@Module({
    controllers: [AlbumController],
    providers: [AlbumService, PrismaService, JwtStrategy, FirebaseService]
})
export class AlbumModule {}
