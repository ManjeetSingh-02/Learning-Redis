// internal-imports
import { APP_CONFIG } from '../config/constants.js';
import { redis } from '../redis/client.js';

// external-imports
import type { Request, Response, NextFunction } from 'express';

// function for global rate-limiting
export async function globalRateLimiter(_request: Request, response: Response, next: NextFunction) {
  // check if the key exists in Redis
  const currentCount = await redis.get(APP_CONFIG.RATE_LIMITER_CONFIG.GLOBAL_RATE_LIMIT_KEY);

  // check if key doesn't exists
  if (currentCount === null) {
    // initialize the count of requests to 0
    await redis.set(APP_CONFIG.RATE_LIMITER_CONFIG.GLOBAL_RATE_LIMIT_KEY, 0);

    // set an expiry for the key
    await redis.expire(
      APP_CONFIG.RATE_LIMITER_CONFIG.GLOBAL_RATE_LIMIT_KEY,
      APP_CONFIG.RATE_LIMITER_CONFIG.TIME_WINDOW
    );
  }

  // if currentCount is greater than or equal to the LIMIT_VALUE
  if (Number(currentCount) >= APP_CONFIG.RATE_LIMITER_CONFIG.LIMIT_VALUE)
    return response.status(429).json({ message: 'Too many requests' });

  // increment the count of requests in Redis
  await redis.incr(APP_CONFIG.RATE_LIMITER_CONFIG.GLOBAL_RATE_LIMIT_KEY);

  // call the next middleware
  next();
}
