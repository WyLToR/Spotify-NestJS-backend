import { Module } from '@nestjs/common';
import { ArtistController } from './artist.controller';
import { ArtistService } from './artist.service';
import { PrismaService } from 'src/db/prisma.service';
import { JwtStrategy } from 'src/auth/strategy';

@Module({
    imports: [],
    controllers: [ArtistController],
    providers: [ArtistService, PrismaService, JwtStrategy],
})
export class ArtistModule { }
