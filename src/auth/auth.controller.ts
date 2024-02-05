import { Controller, Post, Body} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';


@ApiTags('authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {
  }

  @Post('/register')
  @ApiOperation({ summary: 'Register User' })
  @ApiResponse({ status: 201, description: 'User successfully registered' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiBody({ type: AuthDto })
  async registerUser(
    @Body() dto: AuthDto,
  ) {
    try {
      const user = await this.authService.createUser(dto);
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