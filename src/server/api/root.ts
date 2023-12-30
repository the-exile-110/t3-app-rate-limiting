import {postRouter} from "~/server/api/routers/post";
import {rateLimitRouter} from "~/server/api/routers/rate-limit";
import {createTRPCRouter} from "~/server/api/trpc";
import {Ratelimit} from "@upstash/ratelimit";
import {Redis} from "@upstash/redis";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
    post: postRouter,
    rate: rateLimitRouter,
});

export const rateLimiter = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(2, "3 s")
});

// export type definition of API
export type AppRouter = typeof appRouter;
