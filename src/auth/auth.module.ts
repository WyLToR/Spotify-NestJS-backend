import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategy';
import { PassportModule } from '@nestjs/passport';
import { FirebaseService } from 'src/firebase/firebase.service';

@Module({
  imports: [PassportModule,
    JwtModule.register({
      global: true,
      signOptions: { expiresIn: '2h' },
    }),],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, FirebaseService],
  exports: [JwtModule]
})
export class AuthModule { }
