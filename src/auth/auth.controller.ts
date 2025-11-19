import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Response } from 'express';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('forgot-password')
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  // Redirige al frontend con el token para que el usuario vea la UI de restablecer contraseña
  @Get('reset-password')
  getResetPassword(@Query('token') token: string, @Res() res: Response) {
    if (!token) {
      // Intentar ambas rutas posibles dependiendo de dónde esté corriendo el servidor
      return res.redirect('http://localhost:8080/frontend/index.html?error=token_invalido');
    }
    
    try {
      // Usar URL absoluta del frontend para evitar problemas con variables de entorno
      // El servidor HTTP puede estar corriendo desde MindConnectAI/ o desde MindConnectAI/frontend/
      const frontendUrl = 'http://localhost:8080';
      
      // Decodificar el token si viene codificado (puede venir doble codificado desde el correo)
      let decodedToken = token;
      try {
        decodedToken = decodeURIComponent(token);
      } catch (e) {
        // Si falla la decodificación, usar el token original
        decodedToken = token;
      }
      
      // Intentar primero con la ruta /frontend/ (si el servidor está en la raíz)
      // Si el servidor está corriendo desde frontend/, entonces la ruta sería directa
      // Probamos primero con /frontend/ que es el caso más común
      const dest = `${frontendUrl}/frontend/reset-password.html?token=${encodeURIComponent(decodedToken)}`;
      
      // Log para depuración (remover en producción)
      console.log('Redirigiendo a:', dest);
      console.log('Token recibido:', token.substring(0, 30) + '...');
      
      return res.redirect(dest);
    } catch (error) {
      console.error('Error al redirigir:', error);
      // En caso de error, redirigir con token codificado directamente a la ruta con /frontend/
      const dest = `http://localhost:8080/frontend/reset-password.html?token=${encodeURIComponent(token)}`;
      return res.redirect(dest);
    }
  }

  @Post('reset-password')
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }
}
