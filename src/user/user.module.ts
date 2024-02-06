import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { FirebaseService } from 'src/firebase/firebase.service';
import { AuthService } from 'src/auth/auth.service';
import { JwtStrategy } from 'src/auth/strategy';

@Module({
    controllers: [UserController],
    providers: [FirebaseService, AuthService, JwtStrategy]
})
export class UserModule {}
