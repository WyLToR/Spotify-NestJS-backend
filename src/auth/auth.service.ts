import { Injectable, ForbiddenException, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly config: ConfigService,
        private readonly jwt: JwtService
    ) { }
    async createUser(dto: AuthDto) {
        const hash = await argon.hash(dto.password);
        try {
            const user = this.prisma.user.create({
                data: {
                    email: dto.email,
                    hash,
                    firstName: dto.firstName,
                    lastName: dto.lastName
                }
            })
            return this.signToken((await user).id, (await user).email)
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new HttpException('Credentials taken', HttpStatus.FORBIDDEN)
                }
            }
        }
    }
    async signToken(
        userId: string,
        email: string,
    ): Promise<{ access_token: string }> {
        const payload = {
            sub: userId,
            email,
        };
        const secret = this.config.get('JWT_SECRET');

        const token = await this.jwt.signAsync(
            payload,
            {
                expiresIn: '30m',
                secret: secret,
            },
        );

        return {
            access_token: token,
        };
    }
    async login(dto: AuthDto) {
        const user =
            await this.prisma.user.findUnique({
                where: {
                    email: dto.email,
                },
            });
        if (!user)
            throw new ForbiddenException(
                'Credentials incorrect',
            );

        const pwMatches = await argon.verify(
            user.hash,
            dto.password,
        );
        if (!pwMatches)
            throw new ForbiddenException(
                'Credentials incorrect',
            );
        return this.signToken(user.id, user.email);
    }
    async getAllUser() {
        return this.prisma.user.findMany({
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true
            }
        })
    }
    async updateUser(userId: string, dto: AuthDto) {
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email,
                id: userId
            }
        })
        if (userId !== user.id) {
            throw new ForbiddenException(
                'Credentials incorrect',
            );
        }
        const updatedUser = await this.prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                id: user.id,
                email: dto.email,
                firstName: dto.firstName || user.firstName,
                lastName: dto.lastName || user.lastName,
                hash: user.hash
            }
        })
        delete updatedUser.hash, updatedUser.id
        return updatedUser;
    }
    async deleteUser(userId: string) {
        const deletedUser = await this.prisma.user.delete({
            where: {
                id: userId
            }
        })
        delete deletedUser.hash, deletedUser.id
        return deletedUser
    }
}
