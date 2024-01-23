import { Controller, UseGuards, Patch, Param, Body, Delete} from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { ApiOperation, ApiResponse, ApiTags, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from '../auth/auth.service';
import { AuthDto } from '../auth/dto';
import { RolesGuard } from '../auth/roles';
import { Roles } from '../auth/decorators';
import { Role } from '@prisma/client';

@UseGuards(JwtGuard, RolesGuard)
@Controller('user')
@ApiTags('user')
export class UserController {
    constructor(private readonly authService: AuthService) { }
    @Patch("/:userId")
    @Roles(Role.USER, Role.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update User' })
    @ApiResponse({ status: 200, description: 'Return updated user data' })
    @ApiResponse({ status: 400, description: 'Invalid request or user not found' })
    @ApiBody({ type: AuthDto })
    async updateUser(
        @Param('userId') userId: string,
        @Body() dto: AuthDto
    ) {
        try {
            return this.authService.updateUser(userId, dto);
        } catch (error) {
            return { error: error.message };
        }
    }
    @Delete("/:userId")
    @Roles(Role.USER, Role.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete User by ID' })
    @ApiResponse({ status: 200, description: 'Return deleted email, firstName, lastName' })
    @ApiResponse({ status: 404, description: 'User not found' })
    async deleteUser(
        @Param('userId') userId: string
    ) {
        try {
            return this.authService.deleteUser(userId);
        } catch (error) {
            return { error: error.message };
        }
    }
}
