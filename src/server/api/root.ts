import {postRouter} from "~/server/api/routers/post";
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
});

export const rateLimiter = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(1, "60 s")
});

// export type definition of API
export type AppRouter = typeof appRouter;
