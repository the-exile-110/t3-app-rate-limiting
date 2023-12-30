import {z} from "zod";

import {
    createTRPCRouter,
    protectedProcedure,
} from "~/server/api/trpc";
import {rateLimiter} from "~/server/api/root";
import {TRPCError} from "@trpc/server";

export const rateLimitRouter = createTRPCRouter({
    rateLimit: protectedProcedure
        .query(async ({ctx}) => {
            const {success} = await rateLimiter.limit(ctx.session.user.id);
            if (!success) {
                throw new TRPCError({code: "TOO_MANY_REQUESTS"});
            }
            return "success";
        }),
 });