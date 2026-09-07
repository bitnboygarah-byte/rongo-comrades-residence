import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Initialize the Upstash Redis client using REST credentials
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

/**
 * Strict Rate Limiter: For form submissions (e.g., adding listings, posting reviews)
 * Allows up to 5 requests per 10-second sliding window per IP.
 */
export const strictFormLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "10 s"),
  analytics: true,
  prefix: "@upstash/ratelimit/form",
});

/**
 * General Rate Limiter: For general API routes or search queries
 * Allows up to 20 requests per 10-second sliding window per IP.
 */
export const generalApiLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(20, "10 s"),
  analytics: true,
  prefix: "@upstash/ratelimit/api",
});