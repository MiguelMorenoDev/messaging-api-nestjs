import { Inject, Injectable } from '@nestjs/common';
import { REDIS_CLIENT } from './redis.module';
import Redis from 'ioredis';

@Injectable()
export class TokenBlacklistService {

  constructor(
    @Inject(REDIS_CLIENT)
    private readonly redis: Redis,
  ) {}

  // Añadir token a la blacklist con TTL = tiempo restante hasta expiración
  async blacklist(token: string, expiresInSeconds: number): Promise<void> {
    await this.redis.set(token, '1', 'EX', expiresInSeconds);
  }

  // Comprobar si un token está en la blacklist
  async isBlacklisted(token: string): Promise<boolean> {
    const result = await this.redis.get(token);
    return result !== null;
  }
}