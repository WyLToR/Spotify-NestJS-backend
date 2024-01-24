import { Module } from '@nestjs/common';
import { PrismaModule } from './db/prisma.module';
import { ArtistService } from './artist/artist.service';
import { ArtistController } from './artist/artist.controller';
import { AlbumService } from './album/album.service';
import { SongService } from './song/song.service';
import { AlbumController } from './album/album.controller';
import { SongController } from './song/song.controller';
import { AlbumModule } from './album/album.module';
import { SongModule } from './song/song.module';
import { ArtistModule } from './artist/artist.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserController } from './user/user.controller';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { JwtService } from '@nestjs/jwt';
import { PlaylistService } from './playlist/playlist.service';
import { PlaylistController } from './playlist/playlist.controller';
import { PlaylistModule } from './playlist/playlist.module';
import { AdminController } from './admin/admin.controller';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
  }), MulterModule.registerAsync({
    imports: [ConfigModule],
    useFactory: async () => ({
      storage: diskStorage({
        destination: './upload',
        filename: (_, file, cb) => {
          const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          const originalName = file.originalname;
          const extension = originalName.split('.').pop();
          const fileName = `${unique}.${extension}`;
          cb(null, fileName);
        },
      }),
    }),
    inject: [ConfigService],
  }), PrismaModule, AlbumModule, SongModule, ArtistModule, AuthModule, PlaylistModule],
  providers: [ArtistService, AlbumService, SongService, AuthService, JwtService, PlaylistService],
  controllers: [ArtistController, AlbumController, SongController, UserController, AuthController, PlaylistController, AdminController],
})
export class AppModule {
}
