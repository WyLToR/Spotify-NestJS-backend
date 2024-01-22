import { Controller, UseGuards, Patch, Param, Body, Delete} from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { ApiOperation, ApiResponse, ApiTags, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from '../auth/auth.service';
import { AuthDto } from '../auth/dto';

@UseGuards(JwtGuard)
@Controller('user')
@ApiTags('user')
export class UserController {
    constructor(private readonly authService: AuthService) { }

    @Patch("/:userId")
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
