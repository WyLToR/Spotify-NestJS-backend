import { Controller, Get, Param, Patch } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { AuthService } from '../auth/auth.service';

@ApiTags('admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Return the list of all users' })
  @Get('/users')
  async getAllUsers() {
    return this.authService.getAllUser();
  }

  @ApiOperation({ summary: 'Switch user role' })
  @ApiParam({ name: 'userId', description: 'ID of the user', type: 'string' })
  @ApiResponse({ status: 200, description: 'User role switched successfully' })
  @Patch('/role/:userId')
  async switchUserRole(@Param('userId') userId: string) {
    return this.authService.switchUserRole(userId);
  }
}
