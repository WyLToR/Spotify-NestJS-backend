import { Controller, Post, Body, UseInterceptors, ParseFilePipeBuilder, UploadedFile, HttpStatus } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CustomUploadFileTypeValidator } from 'src/song/validator';
const MAX_PICTURE_SIZE = 5 * 1024 * 1024;
const VALID_IMAGE_MIME_TYPES = [
  'image/jpeg', 'image/png', 'image/gif', 'image/bmp',
  'image/webp'
];

@ApiTags('authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {
  }

  @Post('/register')
  @ApiOperation({ summary: 'Register User' })
  @ApiResponse({ status: 201, description: 'User successfully registered' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @UseInterceptors(FileInterceptor('pictureFile'))
  @ApiBody({ type: AuthDto })
  async registerUser(
    @Body() dto: AuthDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addValidator(
          new CustomUploadFileTypeValidator({
            fileType: VALID_IMAGE_MIME_TYPES,
          }),
        )
        .addMaxSizeValidator({ maxSize: MAX_PICTURE_SIZE })
        .build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY })
      ,
    )
    pictureFile: Express.Multer.File,
  ) {
    try {
      const user = await this.authService.createUser(dto, pictureFile);
      return { message: 'User successfully registered', user };
    } catch (error) {
      return { error: error.message };
    }
  }

  @Post('/login')
  @ApiOperation({ summary: 'User Login' })
  @ApiResponse({ status: 200, description: 'User successfully logged in' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiBody({ type: AuthDto })
  async login(
    @Body() dto: AuthDto,
  ) {
    try {
      const { userId, token } = await this.authService.login(dto);
      return { message: 'User successfully logged in', userId, token };
    } catch (error) {
      return { error: error.message };
    }
  }
}