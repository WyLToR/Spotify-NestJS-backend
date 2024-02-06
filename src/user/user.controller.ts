import { Controller, UseGuards, Patch, Param, Body, Delete, UploadedFile, ParseFilePipeBuilder, HttpStatus, UseInterceptors} from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { ApiOperation, ApiResponse, ApiTags, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from '../auth/auth.service';
import { AuthDto } from '../auth/dto';
import { RolesGuard } from '../auth/roles';
import { Roles } from '../auth/decorators';
import { Role } from '@prisma/client';
import { CustomUploadFileTypeValidator } from 'src/song/validator';
import { UserDto } from './dto';
import { FileInterceptor } from '@nestjs/platform-express';

const MAX_PICTURE_SIZE = 5 * 1024 * 1024;
const VALID_IMAGE_MIME_TYPES = [
    'image/jpeg', 'image/png', 'image/gif', 'image/bmp',
    'image/webp'
];

@UseGuards(JwtGuard, RolesGuard)
@Controller('user')
@ApiTags('user')
export class UserController {
    constructor(private readonly authService: AuthService) { }
    @Patch("/:userId")
    @Roles(Role.USER, Role.ADMIN)
    @ApiBearerAuth()
    @UseInterceptors(FileInterceptor('pictureFile'))
    @ApiOperation({ summary: 'Update User' })
    @ApiResponse({ status: 200, description: 'Return updated user data' })
    @ApiResponse({ status: 400, description: 'Invalid request or user not found' })
    @ApiBody({ type: AuthDto })
    updateUser(
        @Body() dto: UserDto,
        @Param('userId') userId: string,
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
            return this.authService.updateUser(userId, dto, pictureFile);
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
