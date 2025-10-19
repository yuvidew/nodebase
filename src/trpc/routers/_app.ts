
import { protectedProcedure, createTRPCRouter } from '../init';
import prisma from '@/lib/db';
export const appRouter = createTRPCRouter({
    getUsers: protectedProcedure.query(({ctx}) => {
        // console.log({user_id : ctx.auth.user.id});

        // So we getting a current login user data form the data table 
            return prisma.user.findMany({
                where : {
                    id : ctx.auth.user.id
                }
            });
        }),
});
// export type definition of API
export type AppRouter = typeof appRouter;