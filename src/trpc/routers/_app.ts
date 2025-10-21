
import { inngest } from '@/inngest/client';
import { protectedProcedure, createTRPCRouter } from '../init';
import prisma from '@/lib/db';
// import { google } from '@ai-sdk/google';
// import { generateText } from 'ai';

export const appRouter = createTRPCRouter({

    textAI: protectedProcedure.mutation(async () => {
        await inngest.send({
            name : "execute/ai",
        })

        return {
            success: true,
            message: "Job queued"
        }

    }),

    getWorkflows: protectedProcedure.query(({ ctx }) => {
        // console.log({user_id : ctx.auth.user.id});

        // So we getting a current login user data form the data table 
        return prisma.workflow.findMany();
    }),

    createWorkflow: protectedProcedure.mutation(async () => {
        await inngest.send({
            name: "test/hello.world",
            data: {
                email: "yuvi@gmall.com",
            },
        });

        return {
            success: true,
            message: "Job queued"
        }
    })

});
// export type definition of API
export type AppRouter = typeof appRouter;