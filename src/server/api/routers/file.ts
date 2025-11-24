import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

export const fileRouter = createTRPCRouter({
  getById: protectedProcedure
  .input(z.object({
    file: z.string()
  }))
  .query(({ctx, input}) => {
      return ctx.db.file.findUnique({
        where:{
            id:input.file
        }
      })
  }),
  // create: protectedProcedure
  //   .input(z.object({ name: z.string().min(1) }))
  //   .mutation(async ({ ctx, input }) => {
  //     return ""
  //   }),
  getLatest: protectedProcedure.query(async ({ ctx }) => {
    const files = await ctx.db.file.findMany({
      orderBy: { createdAt: "desc" },
      where: { createdBy: { id: ctx.session.user.id } },
    });

    return files ?? [];
  })
});
