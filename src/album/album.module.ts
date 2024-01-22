import { Module } from '@nestjs/common';
import { AlbumController } from './album.controller';
import { AlbumService } from './album.service';
import { PrismaService } from '../db/prisma.service';
import { JwtStrategy } from '../auth/strategy';

@Module({
    controllers: [AlbumController],
    providers: [AlbumService, PrismaService, JwtStrategy]
})
export class AlbumModule {}
