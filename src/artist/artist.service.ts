import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ArtistDto } from './dto';
import { PrismaService } from '../db/prisma.service';
import { FirebaseService } from 'src/firebase/firebase.service';

@Injectable()
export class ArtistService {
    constructor(
        private prisma: PrismaService,
        private readonly firebaseService: FirebaseService
    ) { }
    async createArtist(dto: ArtistDto, pictureFile: Express.Multer.File) {
        const { id: artistId } = await this.prisma.artist.create({
            data: dto
        })
        const storage = this.firebaseService.getStorageInstance();
        const picturePath = `artist/${artistId}/${pictureFile.originalname}`;
        await storage.bucket().upload(pictureFile.path, {
            destination: picturePath,
        });

        const picture = storage.bucket().file(picturePath);
        const [pictureUrl] = await picture.getSignedUrl({
            action: 'read',
            expires: '2099-12-31',
        });
        return this.prisma.artist.update({
            where: {
                id: artistId
            },
            data: {
                picturePath,
                pictureUrl
            }
        })

    }
    async getAllArtists() {
        const artists = await this.prisma.artist.findMany({
            include: {
                albums: {
                    select: {
                        id: true,
                        albumName: true
                    }
                }
            }
        })
        if (!artists) {
            throw new HttpException('Artists not found', HttpStatus.NOT_FOUND)
        }
        return artists
    }
    async getArtistById(artistId: string) {
        const artist = await this.prisma.artist.findUnique({
            where: {
                id: artistId
            },
            include: {
                albums: {
                    select: {
                        id: true,
                        albumName: true,
                        songs: true
                    }
                }
            }
        })
        if (!artist) {
            throw new HttpException('Artist not found', HttpStatus.NOT_FOUND)
        }
        return artist
    }
    async updateArtist(artistId: string, dto: ArtistDto, pictureFile: Express.Multer.File) {
        const storage = this.firebaseService.getStorageInstance();
        const picturePath = `artist/${artistId}/${pictureFile.originalname}`;
        await storage.bucket().upload(pictureFile.path, {
            destination: picturePath,
        });

        const picture = storage.bucket().file(picturePath);
        const [pictureUrl] = await picture.getSignedUrl({
            action: 'read',
            expires: '2099-12-31',
        });
        return await this.prisma.artist.update({
            where: {
                id: artistId
            },
            data: {
                ...dto,
                picturePath,
                pictureUrl,
            }
        })
    }
    async deleteArtist(artistId: string) {
        const artist = await this.prisma.artist.findUnique({
            where: {
                id: artistId
            },
            include: {
                albums: {
                    include: {
                        songs: true
                    }
                }
            }
        })
        if (artist.picturePath) {
            const file = this.firebaseService.getStorageInstance().bucket().file(artist.picturePath)
            await file.delete()
        }
        artist.albums.forEach(async (album) => {
            if (album.picturePath) {
                const file = this.firebaseService.getStorageInstance().bucket().file(album.picturePath)
                await file.delete()
            }
            album.songs.forEach(async (song) => {
                if (song.songPath) {
                    const file = this.firebaseService.getStorageInstance().bucket().file(song.songPath)
                    await file.delete()
                }
            })
        })
        return this.prisma.artist.delete({
            where: {
                id: artistId
            }
        })
    }
}
