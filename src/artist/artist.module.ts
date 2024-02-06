import { Module } from '@nestjs/common';
import { ArtistController } from './artist.controller';
import { ArtistService } from './artist.service';
import { PrismaService } from '../db/prisma.service';
import { JwtStrategy } from '../auth/strategy';
import { FirebaseService } from 'src/firebase/firebase.service';

@Module({
    imports: [],
    controllers: [ArtistController],
    providers: [ArtistService, PrismaService, JwtStrategy, FirebaseService],
})
export class ArtistModule { }
