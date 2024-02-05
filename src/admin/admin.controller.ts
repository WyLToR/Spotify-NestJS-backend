import { Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from '../auth/auth.service';
import { JwtGuard } from '../auth/guard';
import { RolesGuard } from '../auth/roles';
import { Roles } from '../auth/decorators';
import Role from '../utils/role.enum';

@UseGuards(JwtGuard, RolesGuard)
@ApiBearerAuth()
@ApiTags('admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly authService: AuthService) {
  }
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Return the list of all users' })
  @Get('/users')
  async getAllUsers() {
    return this.authService.getAllUser();
  }
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Switch user role' })
  @ApiParam({ name: 'userId', description: 'ID of the user', type: 'string' })
  @ApiResponse({ status: 200, description: 'User role switched successfully' })
  @Patch('/role/:userId')
  async switchUserRole(@Param('userId') userId: string) {
    return this.authService.switchUserRole(userId);
  }
}
