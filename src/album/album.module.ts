import { Module } from '@nestjs/common';
import { AlbumController } from './album.controller';
import { AlbumService } from './album.service';
import { PrismaService } from 'src/db/prisma.service';
import { JwtStrategy } from 'src/auth/strategy';

@Module({
    controllers: [AlbumController],
    providers: [AlbumService, PrismaService, JwtStrategy]
})
export class AlbumModule {}
