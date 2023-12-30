import {z} from "zod";

import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
} from "~/server/api/trpc";
import {posts} from "~/server/db/schema";
import {rateLimiter} from "~/server/api/root";
import {TRPCError} from "@trpc/server";

export const postRouter = createTRPCRouter({
    rateLimit: protectedProcedure
        .query(async ({ctx}) => {
            const {success} = await rateLimiter.limit(ctx.session.user.id);
            if (!success) {
                throw new TRPCError({code: "TOO_MANY_REQUESTS"});
            }
            return "success";
        }),

    hello: publicProcedure
        .input(z.object({text: z.string()}))
        .query(({input}) => {
            return {
                greeting: `Hello ${input.text}`,
            };
        }),

    create: protectedProcedure
        .input(z.object({name: z.string().min(1)}))
        .mutation(async ({ctx, input}) => {
            // simulate a slow db call
            await new Promise((resolve) => setTimeout(resolve, 1000));

            await ctx.db.insert(posts).values({
                name: input.name,
                createdById: ctx.session.user.id,
            });
        }),

    getLatest: publicProcedure.query(({ctx}) => {
        return ctx.db.query.posts.findFirst({
            orderBy: (posts, {desc}) => [desc(posts.createdAt)],
        });
    }),

    getSecretMessage: protectedProcedure.query(() => {
        return "you can now see this secret message!";
    }),
});
