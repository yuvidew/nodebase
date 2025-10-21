import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/lib/db";


import { polarClient } from "./polar";
import { checkout, polar, portal } from "@polar-sh/better-auth";
// import { polar } from "@polar-sh/better-auth";.


export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", 
    }),
    emailAndPassword : {
        enabled : true,
        autoSignIn : true // user can auto sign in if user is register
    },
    plugins : [
        polar({
            client : polarClient,
            createCustomerOnSignUp : true,
            use : [
                checkout({
                    products : [
                        {
                            productId: "93a016cb-7087-43b7-aa5e-8ed4445cd462",
                            slug: "nodebase-pro"
                        }
                    ],
                    successUrl: process.env.POLAR_SUCCESS_URL,
                    authenticatedUsersOnly: true
                }),
                portal(),
            ]
        })
    ]
});