import { Module } from '@nestjs/common';
import { PlaylistController } from './playlist.controller';
import { PlaylistService } from './playlist.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../auth/strategy';
import { PrismaService } from '../db/prisma.service';

@Module({
    imports:[JwtModule.register({})],
    controllers:[PlaylistController],
    providers: [PlaylistService, JwtStrategy, PrismaService]
})
export class PlaylistModule {}
