import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export const redis = Redis.fromEnv();

export const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.fixedWindow(25, "5 h"),
  analytics: true,
});

export const increaseLimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.fixedWindow(1, "24 h"),
  analytics: true,
});

export const askLimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.fixedWindow(1, "1 h"),
  analytics: true,
});