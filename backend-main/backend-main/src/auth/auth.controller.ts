import { Controller, Post, Body, Get } from '@nestjs/common';
import { ChangePasswordDto, CreateUserDto, LoginUserDto, RecoverPasswordDto, RequestPasswordRecoveryDto } from './dtos';
import { AuthService } from './auth.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Auth, GetUser } from './decorators';
// import { ValidRoles } from './interfaces';
import { User } from './entities';

@ApiTags('Auth')
@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    // @Auth(ValidRoles.admin)
    @ApiOperation({ summary: 'Register a new user' })
    @ApiBody({ type: CreateUserDto })
    @ApiResponse({ status: 201, description: 'User registered successfully' })
    createUser(@Body() createUserDto: CreateUserDto) {
        return this.authService.registerUser(createUserDto);
    }

    @Post('login')
    @ApiOperation({ summary: 'Authenticate a user' })
    @ApiBody({ type: LoginUserDto })
    @ApiResponse({
        status: 200,
        description: 'User authenticated successfully',
    })
    loginUser(@Body() loginUserDto: LoginUserDto) {
        return this.authService.authenticateUser(loginUserDto);
    }

    @Post('refresh-token')
    @ApiOperation({ summary: 'Refresh JWT token' })
    @ApiBody({ schema: { type: 'object', properties: { refreshToken: { type: 'string' } } } })
    @ApiResponse({ status: 200, description: 'Token refreshed successfully' })
    refreshToken(@Body('refreshToken') refreshToken: string) {
        return this.authService.refreshToken(refreshToken);
    }

    @Post('change-password')
    @ApiOperation({ summary: 'Change user password' })
    @ApiBody({ type: ChangePasswordDto })
    @ApiResponse({
        status: 200,
        description: 'Password changed successfully',
    })
    changePassword(@Body() changePasswordDto: ChangePasswordDto) {
        return this.authService.changePassword(changePasswordDto);
    }

    @Post('request-password-recovery')
    @ApiOperation({ summary: 'Request password recovery' })
    @ApiBody({ type: RequestPasswordRecoveryDto })
    @ApiResponse({ status: 200, description: 'Password recovery email sent successfully' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    async requestPasswordRecovery(@Body() requestPasswordRecoveryDto: RequestPasswordRecoveryDto) {
        return await this.authService.sendPasswordRecoveryEmail(requestPasswordRecoveryDto);
    }

    @Post('recover-password')
    @ApiOperation({ summary: 'Recover password using token' })
    @ApiBody({ type: RecoverPasswordDto })
    @ApiResponse({ status: 200, description: 'Password updated successfully' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    async recoverPassword(@Body() recoverPasswordDto: RecoverPasswordDto) {
        return await this.authService.recoverPassword(recoverPasswordDto);
    }

    @Get('check-status')
    @Auth()
    @ApiOperation({ summary: 'Check if user is authenticated' })
    @ApiResponse({ status: 200, description: 'User authenticated' })
    @ApiResponse({ status: 401, description: 'User not authenticated' })
    async checkAuthStatus(@GetUser() user: User) {
        return await this.authService.checkAuthStatus(user);
    }
}