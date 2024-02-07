import { Injectable, ForbiddenException, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../db/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import Role from '../utils/role.enum';
import { FirebaseService } from 'src/firebase/firebase.service';
import { UserDto } from 'src/user/dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
    private readonly jwt: JwtService,
    private readonly firebaseService: FirebaseService
  ) {
  }

  async createUser(dto: AuthDto, pictureFile: Express.Multer.File) {
    const hash = await argon.hash(dto.password);
    try {
      const registeredUser = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
          firstName: dto.firstName,
          lastName: dto.lastName,
        },
      });
      const storage = this.firebaseService.getStorageInstance();
      const picturePath = `user/${registeredUser.id}/${pictureFile.originalname}`;
      await storage.bucket().upload(pictureFile.path, {
        destination: picturePath,
      });

      const file = storage.bucket().file(picturePath);
      const [pictureUrl] = await file.getSignedUrl({
        action: 'read',
        expires: '2099-12-31',
      });
      const user = await this.prisma.user.update({
        where: {
          id: registeredUser.id
        },
        data: {
          picturePath,
          pictureUrl
        }
      })
      return {
        userId: user.id,
        token: await this.signToken(user.id, user.email, user.pictureUrl, user.role as Role),
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
    userPicture: string,
    role: Role,
  ): Promise<string> {
    const payload = {
      sub: userId,
      email,
      role,
      userPicture
    };
    const secret = this.config.get('JWT_SECRET');

    const token: string = await this.jwt.signAsync(
      payload,
      {
        secret: secret,
        expiresIn: '365d'
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
    if (!pwMatches) {
      throw new ForbiddenException(
        'Credentials incorrect',
      );
    }
    return {
      userId: user.id,
      token: await this.signToken(user.id, user.email, user.pictureUrl, user.role as Role),
    };
  }

  async updateUser(userId: string, dto: UserDto, pictureFile: Express.Multer.File) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId
      },
    });
    const storage = this.firebaseService.getStorageInstance();
    const picturePath = `user/${user.id}/${pictureFile.originalname}`;
    await storage.bucket().upload(pictureFile.path, {
      destination: picturePath,
    });

    const file = storage.bucket().file(picturePath);
    const [pictureUrl] = await file.getSignedUrl({
      action: 'read',
      expires: '2099-12-31',
    });
    const hash = await argon.hash(dto.password);
    const updatedUser = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        id: user.id,
        firstName: dto.firstName || user.firstName,
        lastName: dto.lastName || user.lastName,
        hash,
        picturePath,
        pictureUrl
      },
    });
    delete updatedUser.hash;
    delete updatedUser.id;
    delete updatedUser.role;
    delete updatedUser.picturePath;
    delete updatedUser.pictureUrl;
    return updatedUser;
  }

  async deleteUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId
      }
    })
    if (user.picturePath) {
      const file = this.firebaseService.getStorageInstance().bucket().file(user.picturePath)
      await file.delete()
    }
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
