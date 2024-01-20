import { Controller, UseGuards, Patch, Param, Body, Delete} from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from 'src/auth/auth.service';
import { AuthDto } from 'src/auth/dto';

@UseGuards(JwtGuard)
@Controller('user')
@ApiTags('user')
export class UserController {
    constructor(private readonly authService: AuthService) { }
    @Patch("/:userId")
    @ApiOperation({ summary: 'Get Artist by ID' })
    @ApiResponse({ status: 200, description: 'Return deleted email, firstName, lastName' })
    @ApiResponse({ status: 404, description: 'User not found' })
    async updateUser(
        @Param('userId') userId: string,
        @Body() dto: AuthDto
    ) {
        try {
            return this.authService.updateUser(userId, dto)
        } catch (error) {
            return { error: error.message }
        }
    }
    @Delete("/:userId")
    @ApiOperation({ summary: 'Delete user By ID' })
    @ApiResponse({ status: 200, description: 'Return deleted email, firstName, lastName' })
    @ApiResponse({ status: 404, description: 'User not found' })
    async deleteUser(
        @Param('userId') userId: string,
    ) {
        try {
            return this.authService.deleteUser(userId)
        } catch (error) {
            return { error: error.message }
        }
    }
}
