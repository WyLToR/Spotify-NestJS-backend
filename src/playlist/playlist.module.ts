import { Module } from '@nestjs/common';
import { PlaylistController } from './playlist.controller';
import { PlaylistService } from './playlist.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/auth/strategy';

@Module({
    imports:[JwtModule.register({})],
    controllers:[PlaylistController],
    providers: [PlaylistService, JwtStrategy]
})
export class PlaylistModule {}
