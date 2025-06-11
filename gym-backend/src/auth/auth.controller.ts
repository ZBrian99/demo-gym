import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LoginResponse } from './types/auth.types';
import { Auth, Public } from './decorators/auth.decorator';
import { Role } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  login(@Body() loginDto: LoginDto): Promise<LoginResponse> {
    return this.authService.login(loginDto);
  }

  @Public()
  @Get('public')
  isPublic() {
    return 'Ruta pública';
  }

  @Get('profile')
  getProfile() {
    return 'Ruta protegida por JWT';
  }

  @Auth(Role.ADMIN)
  @Get('admin')
  adminOnly() {
    return 'Ruta solo para administradores';
  }
}
