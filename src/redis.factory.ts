import Redis from 'ioredis';

export class RedisFactory {
  private static _redisClient: Redis;

  static create(): Redis {
    if (this._redisClient) {
      return this._redisClient;
    }

    this._redisClient = new Redis({
      host: String(process.env.REDIS_HOST),
      port: Number(process.env.REDIS_PORT),
      password: process.env.REDIS_PASSWORD,
    });

    this._redisClient.on('error', (error) => {
      console.error(error);
    });

    this._redisClient.on('connect', () => {
      console.log('Redis client connected');
    });

    return this._redisClient;
  }

  static get client(): Redis {
    return this._redisClient;
  }
}
