import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../db/prisma.service';
import { SongDto } from './dto';
import { NotFoundDataException } from '../utils/not-found.exception';
import { FirebaseService } from 'src/firebase/firebase.service';

@Injectable()
export class SongService {
    constructor(private prisma: PrismaService, private readonly firebaseService: FirebaseService) { }
    async createSong(albumId: string, dto: SongDto, songPath: string, url: string) {
        return this.prisma.song.create({
            data: {
                title: dto.title,
                albumId,
                songPath,
                url
            }
        })
    }
    async getAllSong() {
        const songs = await this.prisma.song.findMany({
            include: {
                album: {
                    include: {
                        artist: true
                    }
                }
            }
        })
        if (!songs) {
            throw new HttpException('Songs not found', HttpStatus.NOT_FOUND)
        }
        return songs
    }
    async getSongById(songId: string) {
        const song = this.prisma.song.findUnique({
            where: { id: songId },
            include: {
                album: {
                    include: {
                        artist: true
                    }
                }
            }
        });
        if (!song) {
            throw new NotFoundDataException('song', songId)
        }
        return song;
    }
    async updateSong(albumId: string, songId: string, dto: SongDto, songPath: string, url: string) {
        const oldSongData = await this.prisma.song.findUnique({
            where: {
                id: songId
            }
        })
        if (oldSongData.songPath) {
            const oldFile = this.firebaseService.getStorageInstance().bucket().file(oldSongData.url);
            await oldFile.delete();
        }
        return this.prisma.song.update({
            where: {
                id: songId
            },
            data: {
                title: dto.title,
                albumId,
                songPath,
                url

            }
        })
    }
    async deleteSong(songId: string) {
        const song = await this.prisma.song.findUnique({
            where: {
                id: songId
            }
        })
        const file = this.firebaseService.getStorageInstance().bucket().file(song.url)
        await file.delete()
        return this.prisma.song.delete({
            where: {
                id: songId
            }
        })
    }
}
