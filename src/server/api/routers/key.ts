
import {
    createTRPCRouter,
    protectedProcedure,
  } from "@/server/api/trpc";
  import { muid, makeRandomNumber } from "@/util/functions";
  import { z } from "zod";
  
  export const keyRouter = createTRPCRouter({
  
    getAll: protectedProcedure
      .query(async ({ ctx }) => {
          const apiKeys = await ctx.db.apiKey.findMany({
          where:{
              createdById: ctx.session.user.id,
              deletedAt: null
          }
        });
        return apiKeys ?? []
      }),
      create: protectedProcedure
      .input(z.object({
          name: z.string().max(18).optional()
      }))
      .mutation(async ({ctx, input}) => {

          let keyName = input.name
  
          if(!keyName || keyName === ""){
              const keys = Array.from({length:8}).map(_ => {return makeRandomNumber()}).join()
              const generatedName = `key_${keys.split(",").join("")}`
              keyName = generatedName
          }
  
          const generatedKey = muid()
          
          return ctx.db.apiKey.create({
              data: {
                  name: keyName,
                  key: generatedKey,
                  createdBy: {
                      connect:{
                          id: ctx.session.user.id
                      }
                  }
              }
          })
      }),
      delete: protectedProcedure
      .input(z.string())
      .mutation(async ({ctx, input}) => {
          return ctx.db.apiKey.update({
              where:{
                  id:input
              },
              data:{
                  deletedAt: new Date()
              }
          })
      }),
  });
  