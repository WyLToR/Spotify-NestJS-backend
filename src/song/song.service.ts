import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../db/prisma.service';
import { SongDto } from './dto';
import { NotFoundDataException } from '../utils/not-found.exception';

@Injectable()
export class SongService {
    constructor(private prisma: PrismaService) { }
    async createSong(albumId: string, dto: SongDto, songPath: string) {
        return this.prisma.song.create({
            data: {
                title: dto.title,
                albumId,
                songPath,
            }
        })
    }
    async getAllSong() {
        const songs = await this.prisma.song.findMany({
            include: {
                album: true,
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
    async updateSong(albumId: string, songId: string, dto: SongDto, songPath: string) {
        return this.prisma.song.update({
            where: {
                id: songId
            },
            data: {
                title: dto.title,
                albumId,
                songPath,
            }
        })
    }
    async deleteSong(songId: string) {
        return this.prisma.song.delete({
            where: {
                id: songId
            }
        })
    }
}
