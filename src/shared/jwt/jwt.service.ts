import { Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { error } from 'console';

@Injectable()
export class JWTService {
  constructor(private readonly jwt: JwtService) {}

  async signWithPrivateKey(
    payload: Record<string, any>,
    privateKey: string,
    options: JwtSignOptions,
  ): Promise<string> {
    return this.jwt.sign(payload, { privateKey, ...options });
  }

  verifyWithPublicKey(token: string, publicKey: string) {
    try {
      this.jwt.verify(token, { publicKey });
    } catch (err) {
      console.log('Errors [verify token]', error);
    }
  }
}
