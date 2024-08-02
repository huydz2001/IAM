import { Body, Controller, HttpCode, Ip, Post, Req } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { getRealIp } from 'src/util/common';
import { AuthService } from './auth.service';
import { LoginDto, LoginGuestDto } from './dtos/login.dto';
import { UserRegisterDto } from './dtos/user-register.dto';
import { RefreshTokenDto } from './dtos/token-refresh.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'register' })
  @Post('/register')
  async createUser(@Body() payload: UserRegisterDto) {
    return await this.authService.register(payload);
  }

  @ApiOperation({ summary: 'login guest' })
  @Post('/login-guest')
  @HttpCode(200)
  async loginGuest(@Body() payload: LoginGuestDto) {
    return await this.authService.loginGuestClient(payload);
  }

  @ApiOperation({ summary: 'login' })
  @Post('/login')
  @HttpCode(200)
  async login(
    @Body() payload: LoginDto,
    @Req() request: Request,
    @Ip() ip: string,
  ) {
    const ipAdress = getRealIp(request, ip);
    return await this.authService.loginClient({ ipAdress, ...payload });
  }

  @ApiOperation({ summary: 'refresh token' })
  @Post('/refresh-token')
  @HttpCode(200)
  async refreshToken(
    @Body() payload: RefreshTokenDto,
    @Req() request: Request,
    @Ip() ip: string,
  ) {
    const ipAdress = getRealIp(request, ip);
    return await this.authService.refreshTokenClient(payload, ipAdress);
  }
}
