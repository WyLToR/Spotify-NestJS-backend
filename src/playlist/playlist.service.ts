import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { PlayListDto } from './dto';

@Injectable()
export class PlaylistService {
    constructor(private readonly prisma: PrismaService) { }
    async createPlayList(userId: string, dto: PlayListDto) {
        return this.prisma.playList.create({
            data: {
                title: dto.title,
                userId
            }
        })
    }

    async addSongToPlayList(playlistId: string, songId: string) {
        return this.prisma.playlistSong.create({
            data: {
                playlistId,
                songId,
            }
        })
    }

    async getMyAllPlaylist(userId: string) {
        return this.prisma.playList.findMany({
            where: {
                userId
            },
            include:{
                playlistSongs:{
                    include:{
                        song: {
                            include:{
                                album: {
                                    include:{
                                        artist: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        })
    }

    async getMyPlayListById(playlistId: string) {
        return this.prisma.playList.findUnique({
            where: {
                id: playlistId
            },
            include: {
                playlistSongs: {
                    include: {
                        song: {
                            include: {
                                album: {
                                    include: {
                                        artist: {
                                            select: {
                                                name: true,
                                                genre: true,
                                                biography: true,
                                                albums: {
                                                    distinct: 'id'
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
    }
    async deleteSongFromPlayList(playlistId: string, songId: string) {
        return this.prisma.playlistSong.deleteMany({
            where: {
                songId,
                playlistId,
            },
        });
    }

    async deletePlayList(playListId: string) {
        return this.prisma.playList.delete({
            where: {
                id: playListId
            }
        })
    }
}
