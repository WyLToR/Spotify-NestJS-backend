import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../db/prisma.service';
import { AlbumDto } from './dto';

@Injectable()
export class AlbumService {
    constructor(private prisma: PrismaService) { }
    async createAlbum(artistId: string, dto: AlbumDto) {
        return this.prisma.album.create({ data: { albumName: dto.albumName, artistId } })
    }
    async getAllAlbums() {
        const albums = await this.prisma.album.findMany({
            include: {
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
    async updateAlbum(artistId: string, albumId: string, dto: AlbumDto) {
        return this.prisma.album.update({
            where: {
                id: albumId
            },
            data: {
                albumName: dto.albumName,
                artistId: artistId
            }
        })
    }
    async deleteAlbum(albumId: string) {
        return this.prisma.album.delete({
            where: {
                id: albumId
            }
        })
    }
}
