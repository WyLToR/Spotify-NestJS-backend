import { Module } from '@nestjs/common';
import { ArtistController } from './artist.controller';
import { ArtistService } from './artist.service';
import { PrismaService } from '../db/prisma.service';
import { JwtStrategy } from '../auth/strategy';

@Module({
    imports: [],
    controllers: [ArtistController],
    providers: [ArtistService, PrismaService, JwtStrategy],
})
export class ArtistModule { }
