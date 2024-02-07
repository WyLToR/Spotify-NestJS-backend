import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../db/prisma.service';
import { AlbumDto } from './dto';
import { FirebaseService } from 'src/firebase/firebase.service';

@Injectable()
export class AlbumService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly firebaseService: FirebaseService
    ) { }
    async createAlbum(artistId: string, dto: AlbumDto, pictureFile: Express.Multer.File) {
        const storage = this.firebaseService.getStorageInstance();
        const picturePath = `album/${artistId}/${pictureFile.originalname}`;
        await storage.bucket().upload(pictureFile.path, {
            destination: picturePath,
        });

        const file = storage.bucket().file(picturePath);
        const [pictureUrl] = await file.getSignedUrl({
            action: 'read',
            expires: '2099-12-31',
        });
        return this.prisma.album.create({
            data: {
                albumName: dto.albumName,
                artistId,
                pictureUrl,
                picturePath
            }
        })
    }
    async getAllAlbums() {
        const albums = await this.prisma.album.findMany({
            include: {
                artist: true,
                songs: true
            }
        })
        if (!albums) {
            throw new HttpException(`No albums`, HttpStatus.NOT_FOUND)
        }
        return albums
    }
    async getAlbumById(albumId: string) {
        const album = await this.prisma.album.findUnique({
            where: {
                id: albumId
            },
            include: {
                artist: true,
                songs: true
            }
        })
        if (!album) {
            throw new HttpException('No album', HttpStatus.NOT_FOUND)
        }
        return album;
    }
    async updateAlbum(artistId: string, albumId: string, dto: AlbumDto, pictureFile: Express.Multer.File) {
        const oldAlbumData = await this.prisma.album.findUnique({
            where: {
                id: albumId
            }
        })
        if (oldAlbumData.picturePath) {
            const oldFile = this.firebaseService.getStorageInstance().bucket().file(oldAlbumData.picturePath)
            await oldFile.delete()
        }
        const storage = this.firebaseService.getStorageInstance();
        const picturePath = `album/${artistId}/${pictureFile.originalname}`;
        await storage.bucket().upload(pictureFile.path, {
            destination: picturePath,
        });

        const file = storage.bucket().file(picturePath);
        const [pictureUrl] = await file.getSignedUrl({
            action: 'read',
            expires: '2099-12-31',
        });

        return this.prisma.album.update({
            where: {
                id: albumId
            },
            data: {
                albumName: dto.albumName,
                artistId: artistId,
                pictureUrl,
                picturePath,
            }
        })
    }
    async deleteAlbum(albumId: string) {
        const album = await this.prisma.album.findUnique({
            where: {
                id: albumId
            },
            include: {
                songs: true
            }
        })
        if (album.songs) {
            album.songs.forEach(async (song) => {
                if (song.songPath) {
                    const file = this.firebaseService.getStorageInstance().bucket().file(song.songPath)
                    await file.delete()
                }
            })
        }
        if (album.picturePath) {
            const file = this.firebaseService.getStorageInstance().bucket().file(album.picturePath)
            await file.delete()
        }
        return this.prisma.album.delete({
            where: {
                id: albumId
            }
        })
    }
}
