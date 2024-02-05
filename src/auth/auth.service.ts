import { Injectable, ForbiddenException, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../db/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import Role from '../utils/role.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
    private readonly jwt: JwtService,
  ) {
  }

  async createUser(dto: AuthDto) {
    const hash = await argon.hash(dto.password);
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
          firstName: dto.firstName,
          lastName: dto.lastName,
        },
      });
      return {
        userId: user.id,
        token: await this.signToken(user.id, user.email, user.role as Role),
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new HttpException('Credentials taken', HttpStatus.FORBIDDEN);
        }
      }
    }
  }

  async signToken(
    userId: string,
    email: string,
    role: Role
  ): Promise<string> {
    const payload = {
      sub: userId,
      email,
      role,
    };
    const secret = this.config.get('JWT_SECRET');

    const token: string = await this.jwt.signAsync(
      payload,
      {
        secret: secret,
        expiresIn:'365d'
      },
    );
    return token;
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
    return {
      userId: user.id,
      token: await this.signToken(user.id, user.email, user.role as Role),
    };
  }

  async updateUser(userId: string, dto: AuthDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
        id: userId,
      },
    });
    if (userId !== user.id) {
      throw new ForbiddenException(
        'Credentials incorrect',
      );
    }
    const hash = await argon.hash(dto.password);
    const updatedUser = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        id: user.id,
        email: dto.email,
        firstName: dto.firstName || user.firstName,
        lastName: dto.lastName || user.lastName,
        hash
      },
    });
    delete updatedUser.hash;
    delete updatedUser.id;
    return updatedUser;
  }

  async deleteUser(userId: string) {
    const deletedUser = await this.prisma.user.delete({
      where: {
        id: userId,
      },
    });
    delete deletedUser.hash
    delete deletedUser.id;
    return deletedUser;
  }

  async getAllUser() {
    const users = await this.prisma.user.findMany();
    if (!users) {
      throw new HttpException('No founded users', HttpStatus.NOT_FOUND);
    }
    return users;
  }

  async switchUserRole(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    }), modifiedUser = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        role: user.role === Role.USER ? Role.ADMIN : Role.USER,
      },
    });
    delete modifiedUser.hash;
    delete modifiedUser.id;
    return modifiedUser;
  }
}
