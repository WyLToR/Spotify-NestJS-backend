import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { SongDto } from './dto';
import { NotFoundDataException } from 'src/utils/not-found.exception';

@Injectable()
export class SongService {
    constructor(private prisma: PrismaService) { }
    async createSong(dto: SongDto) {
        return this.prisma.song.create({
            data: {
                title: dto.title,
                duration: Number(dto.duration),
                albumId: Number(dto.albumId)
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
    async getSongById(songId: number) {
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
    async updateSong(songId: number, dto: SongDto) {
        return this.prisma.song.update({
            where: {
                id: songId
            },
            data: {
                title: dto.title,
                duration: Number(dto.duration),
                albumId: Number(dto.albumId)
            }
        })
    }
    async deleteSong(songId: number) {
        return this.prisma.song.delete({
            where: {
                id: songId
            }
        })
    }
}
