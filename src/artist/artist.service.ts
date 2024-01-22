import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ArtistDto } from './dto';
import { PrismaService } from '../db/prisma.service';

@Injectable()
export class ArtistService {
    constructor(private prisma: PrismaService) { }
    async createArtist(dto: ArtistDto) {
        return this.prisma.artist.create({
            data: dto
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
                        albumName: true
                    }
                }
            }
        })
        if (!artist) {
            throw new HttpException('Artist not found', HttpStatus.NOT_FOUND)
        }
        return artist
    }
    async updateArtist(artistId: string, dto: ArtistDto) {
        return await this.prisma.artist.update({
            where: {
                id: artistId
            },
            data: dto
        })
    }
    async deleteArtist(artistId: string) {
        return this.prisma.artist.delete({
            where: {
                id: artistId
            }
        })
    }
}
